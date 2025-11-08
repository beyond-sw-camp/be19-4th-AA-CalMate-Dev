package com.ateam.calmate.exerciseRecords.command.repository;

import com.ateam.calmate.exerciseRecords.command.entity.ExerciseFileUpload;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseFileUploadRepository extends JpaRepository<ExerciseFileUpload, Long> {
}