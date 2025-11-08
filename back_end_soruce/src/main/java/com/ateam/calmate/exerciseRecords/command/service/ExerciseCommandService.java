package com.ateam.calmate.exerciseRecords.command.service;


import com.ateam.calmate.exerciseRecords.command.dto.ExerciseRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ExerciseCommandService {

    Long createExercise(ExerciseRequest request, List<MultipartFile> files);

    void updateExercise(Long id, ExerciseRequest request, List<MultipartFile> files);

    void deleteExercise(Long id);
}