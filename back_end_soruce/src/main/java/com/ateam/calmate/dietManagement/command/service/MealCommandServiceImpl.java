package com.ateam.calmate.dietManagement.command.service;

import com.ateam.calmate.dietManagement.command.dto.FoodRequest;
import com.ateam.calmate.dietManagement.command.dto.MealRequest;
import com.ateam.calmate.dietManagement.command.entity.ExtendFilePath;
import com.ateam.calmate.dietManagement.command.entity.Food;
import com.ateam.calmate.dietManagement.command.entity.FoodFileUpload;
import com.ateam.calmate.dietManagement.command.entity.Meal;
import com.ateam.calmate.dietManagement.command.repository.ExtendFilePathRepository;
import com.ateam.calmate.dietManagement.command.repository.FoodFileUploadRepository;
import com.ateam.calmate.dietManagement.command.repository.FoodRepository;
import com.ateam.calmate.dietManagement.command.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MealCommandServiceImpl implements MealCommandService {

    private final MealRepository mealRepository;
    private final FoodRepository foodRepository;
    private final FoodFileUploadRepository fileUploadRepository;
    private final ExtendFilePathRepository extendFilePathRepository;

    private final String uploadRootDir = "uploads/meal";

    @Override
    public Long createMeal(MealRequest request, List<MultipartFile> files) {
        Meal meal = Meal.builder()
                .date(request.getDate())
                .type(request.getType())
                .memberId(request.getMemberId())
                .build();

        Food food = buildFoodFromRequest(request.getFood());
        foodRepository.save(food);

        List<Food> foods = new ArrayList<>();
        foods.add(food);
        meal.setFoods(foods);

        mealRepository.save(meal);

        if (files != null && !files.isEmpty()) {
            int order = 1;
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                saveFile(meal, file, order++);
            }
        }

        return meal.getId();
    }

    @Override
    public void updateMeal(Long id, MealRequest request, List<MultipartFile> files) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("meal not found"));

        meal.setDate(request.getDate());
        meal.setType(request.getType());
        meal.setMemberId(request.getMemberId());

        meal.getFoods().clear();
        Food food = buildFoodFromRequest(request.getFood());
        foodRepository.save(food);
        meal.getFoods().add(food);

        if (files != null && !files.isEmpty()) {
            deletePhysicalFiles(meal);

            List<FoodFileUpload> oldFiles = new ArrayList<>(meal.getFiles());
            for (FoodFileUpload f : oldFiles) {
                meal.getFiles().remove(f);
            }

            int order = 1;
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                saveFile(meal, file, order++);
            }
        }
    }

    @Override
    public void deleteMeal(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("meal not found"));

        deletePhysicalFiles(meal);
        mealRepository.delete(meal);
    }

    private Food buildFoodFromRequest(FoodRequest foodReq) {
        if (foodReq == null) {
            throw new IllegalArgumentException("food is required");
        }

        Integer gram = foodReq.getGram() != null ? foodReq.getGram() : 100;
        BigDecimal kcal = foodReq.getKcal() != null ? foodReq.getKcal() : BigDecimal.ZERO;
        BigDecimal carbo = foodReq.getCarbo() != null ? foodReq.getCarbo() : BigDecimal.ZERO;
        BigDecimal protein = foodReq.getProtein() != null ? foodReq.getProtein() : BigDecimal.ZERO;
        BigDecimal fat = foodReq.getFat() != null ? foodReq.getFat() : BigDecimal.ZERO;
        BigDecimal sodium = foodReq.getSodium() != null ? foodReq.getSodium() : BigDecimal.ZERO;

        return Food.builder()
                .name(foodReq.getName())
                .gram(gram)
                .kcal(kcal)
                .carbo(carbo)
                .protein(protein)
                .fat(fat)
                .sodium(sodium)
                .build();
    }

    private void saveFile(Meal meal, MultipartFile file, int order) {
        try {
            String originalName = file.getOriginalFilename();
            String ext = StringUtils.getFilenameExtension(originalName);
            String storeName = UUID.randomUUID() + (ext != null ? "." + ext : "");

            Path root = Paths.get(uploadRootDir).toAbsolutePath().normalize();
            Path dir = root.resolve(String.valueOf(meal.getId()));
            Files.createDirectories(dir);

            Path filePath = dir.resolve(storeName);
            file.transferTo(filePath.toFile());

            ExtendFilePath extendFilePath = ExtendFilePath.builder()
                    .urlPath("")
                    .build();
            extendFilePathRepository.save(extendFilePath);

            FoodFileUpload upload = FoodFileUpload.builder()
                    .meal(meal)
                    .name(originalName)
                    .type(file.getContentType())
                    .reName(storeName)
                    .path(dir.toString())
                    .thumbPath("")
                    .uploadOrder(order)
                    .extendFilePath(extendFilePath)
                    .build();

            meal.addFile(upload);
            fileUploadRepository.save(upload);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("file save error: " + e.getMessage(), e);
        }
    }

    private void deletePhysicalFiles(Meal meal) {
        if (meal.getFiles() == null || meal.getFiles().isEmpty()) {
            return;
        }

        for (FoodFileUpload f : meal.getFiles()) {
            try {
                if (f.getPath() == null || f.getReName() == null) {
                    continue;
                }
                Path path = Paths.get(f.getPath(), f.getReName());
                Files.deleteIfExists(path);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
