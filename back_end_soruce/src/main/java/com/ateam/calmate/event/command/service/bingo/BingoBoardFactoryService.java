package com.ateam.calmate.event.command.service.bingo;

import com.ateam.calmate.event.command.entity.bingo.BingoBoardEntity;
import com.ateam.calmate.event.command.entity.bingo.BingoCellEntity;
import com.ateam.calmate.event.command.repository.bingo.BingoBoardCommandRepository;
import com.ateam.calmate.event.command.repository.bingo.BingoCellCommandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.dao.DataIntegrityViolationException;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BingoBoardFactoryService {

    private final BingoBoardCommandRepository boardRepo;
    private final BingoCellCommandRepository cellRepo;

    /**
     * 현재 월 보드가 없으면 생성(셀 시드 포함), 있으면 반환
     */
    @Transactional
    public BingoBoardEntity ensureMonthlyBoard(Long memberId, YearMonth ym, int size, String title) {
        var start = ym.atDay(1);
        return boardRepo.findByMemberIdAndStartDate(memberId, start)
                .orElseGet(() -> createMonthlyBoardWithSeeds(memberId, ym, size, title));
    }

    private BingoBoardEntity createMonthlyBoardWithSeeds(Long memberId, YearMonth ym, int size, String title) {
        var start = ym.atDay(1);
        var end   = ym.atEndOfMonth();
        try {
            var board = BingoBoardEntity.builder()
                    .memberId(memberId)
                    .title(title != null ? title : (ym + " Bingo"))
                    .size(size)
                    .startDate(start)
                    .endDate(end)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            var saved = boardRepo.save(board);

            List<BingoCellEntity> cells = new ArrayList<>(size * size);
            for (int r = 0; r < size; r++) {
                for (int c = 0; c < size; c++) {
                    cells.add(BingoCellEntity.builder()
                            .board(saved).row(r).col(c)
                            .label("r" + r + "c" + c)
                            .checked(false)
                            .build());
                }
            }
            cellRepo.saveAll(cells);
            return saved;

        } catch (DataIntegrityViolationException dup) {
            // 동시성: 유니크 충돌 → 이미 생성된 보드를 다시 조회
            return boardRepo.findByMemberIdAndStartDate(memberId, start)
                    .orElseThrow(() -> dup);
        }
    }
}