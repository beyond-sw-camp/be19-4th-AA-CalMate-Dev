package com.ateam.calmate.exerciseRecords.command.controller;

import com.ateam.calmate.exerciseRecords.command.dto.ExerciseRequest;
import com.ateam.calmate.exerciseRecords.command.service.ExerciseCommandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exercise-records")
public class ExerciseCommandController {

    private final ExerciseCommandService exerciseCommandService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createExercise(
            @RequestPart("request") ExerciseRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        Long id = exerciseCommandService.createExercise(request, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateExercise(
            @PathVariable Long id,
            @RequestPart("request") ExerciseRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        exerciseCommandService.updateExercise(id, request, files);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseCommandService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

}