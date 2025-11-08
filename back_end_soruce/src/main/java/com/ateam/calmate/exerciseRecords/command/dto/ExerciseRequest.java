package com.ateam.calmate.exerciseRecords.command.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseRequest {

    private LocalDate date;
    private String type;
    private String category;
    private Integer min;
    private Integer burnedKcal;
    private Long memberId;
}

