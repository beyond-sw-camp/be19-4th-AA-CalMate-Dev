package com.ateam.calmate.ai.command.controller;

import com.ateam.calmate.ai.command.dto.*;
import com.ateam.calmate.ai.command.service.AiDietCommandService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;

@RestController
@RequestMapping("/ai")
@Slf4j
public class AiDietCommandController {
    private final AiDietCommandService aiDietCommandService;

    @Autowired
    public AiDietCommandController(AiDietCommandService aiDietCommandService) {
        this.aiDietCommandService = aiDietCommandService;
    }

    @PostMapping("/diet")
    public ResponseEntity<AiResponseDTO> requestDiet(@RequestBody RequestDietDTO request) {
        log.info(request.toString());
        AiResponseDTO response = aiDietCommandService.getDietAndSave(request);
        log.info(response.toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/exercise")
    public ResponseEntity<AiExerciseResponseDTO> requestExercise(@RequestBody RequestExerciseDTO request) {
        log.info(request.toString());
        AiExerciseResponseDTO response = aiDietCommandService.getExercise(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
