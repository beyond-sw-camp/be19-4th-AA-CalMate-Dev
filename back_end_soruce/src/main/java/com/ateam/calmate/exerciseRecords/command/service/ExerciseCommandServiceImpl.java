package com.ateam.calmate.exerciseRecords.command.service;

import com.ateam.calmate.exerciseRecords.command.dto.ExerciseRequest;
import com.ateam.calmate.exerciseRecords.command.entity.Exercise;
import com.ateam.calmate.exerciseRecords.command.entity.ExerciseFileUpload;
import com.ateam.calmate.exerciseRecords.command.repository.ExerciseFileUploadRepository;
import com.ateam.calmate.exerciseRecords.command.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseCommandServiceImpl implements ExerciseCommandService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseFileUploadRepository fileUploadRepository;

    // 프로젝트 루트 기준으로 uploads/exercise 밑에 저장
    private final String uploadRootDir = "uploads/exercise";

    @Override
    public Long createExercise(ExerciseRequest request, List<MultipartFile> files) {
        Exercise exercise = Exercise.builder()
                .date(request.getDate())
                .type(request.getType())
                .category(request.getCategory())
                .min(request.getMin())
                .burnedKcal(request.getBurnedKcal())
                .memberId(request.getMemberId())
                .build();

        exerciseRepository.save(exercise);

        if (files != null && !files.isEmpty()) {
            int order = 1;
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                saveFile(exercise, file, order++);
            }
        }

        return exercise.getId();
    }

    @Override
    public void updateExercise(Long id, ExerciseRequest request, List<MultipartFile> files) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("exercise not found"));

        exercise.setDate(request.getDate());
        exercise.setType(request.getType());
        exercise.setCategory(request.getCategory());
        exercise.setMin(request.getMin());
        exercise.setBurnedKcal(request.getBurnedKcal());
        exercise.setMemberId(request.getMemberId());

        if (files != null && !files.isEmpty()) {
            deletePhysicalFiles(exercise);
            List<ExerciseFileUpload> oldFiles = new ArrayList<>(exercise.getFiles());
            for (ExerciseFileUpload f : oldFiles) {
                exercise.getFiles().remove(f);
            }

            int order = 1;
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                saveFile(exercise, file, order++);
            }
        }
    }


    @Override
    public void deleteExercise(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("exercise not found"));

        deletePhysicalFiles(exercise);
        exerciseRepository.delete(exercise);
    }


    private void saveFile(Exercise exercise, MultipartFile file, int order) {
        try {
            String originalName = file.getOriginalFilename();
            String ext = StringUtils.getFilenameExtension(originalName);
            String storeName = UUID.randomUUID() + (ext != null ? "." + ext : "");

            // uploads/exercise/{exerciseId}
            Path root = Paths.get(uploadRootDir).toAbsolutePath().normalize();
            Path dir = root.resolve(String.valueOf(exercise.getId()));

            // 디렉터리 생성
            Files.createDirectories(dir);

            // 실제 저장 경로
            Path filePath = dir.resolve(storeName);
            file.transferTo(filePath.toFile());

            ExerciseFileUpload upload = ExerciseFileUpload.builder()
                    .exercise(exercise)
                    .name(originalName)
                    .type(file.getContentType())
                    .reName(storeName)
                    .path(dir.toString())  // 디렉터리 경로 저장
                    .uploadOrder(order)
                    .build();

            exercise.addFile(upload);
            fileUploadRepository.save(upload);
        } catch (Exception e) {
            // 여기서 실제 예외 메시지 찍히면 원인 파악 가능
            e.printStackTrace();
            throw new RuntimeException("file save error: " + e.getMessage(), e);
        }
    }

    private void deletePhysicalFiles(Exercise exercise) {
        if (exercise.getFiles() == null || exercise.getFiles().isEmpty()) {
            return;
        }

        for (ExerciseFileUpload f : exercise.getFiles()) {
            try {
                if (f.getPath() == null || f.getReName() == null) {
                    continue;
                }
                Path path = Paths.get(f.getPath(), f.getReName());
                Files.deleteIfExists(path);
            } catch (Exception e) {
                // 삭제 실패해도 서비스 전체가 죽지 않게 예외만 로그
                e.printStackTrace();
            }
        }
    }
}
