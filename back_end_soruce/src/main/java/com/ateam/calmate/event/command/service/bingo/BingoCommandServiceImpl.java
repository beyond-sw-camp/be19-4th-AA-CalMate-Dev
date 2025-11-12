package com.ateam.calmate.event.command.service.bingo;

import com.ateam.calmate.event.command.dto.bingo.CheckCellWithUploadCommand;
import com.ateam.calmate.event.command.dto.bingo.CheckCellWithUploadResult;
import com.ateam.calmate.event.command.entity.bingo.BingoBoardEntity;
import com.ateam.calmate.event.command.entity.bingo.BingoCellEntity;
import com.ateam.calmate.event.command.entity.bingo.BingoFileUploadEntity;
import com.ateam.calmate.event.command.port.FileStoragePort;
import com.ateam.calmate.event.command.port.PointsPort;
import com.ateam.calmate.event.command.repository.bingo.BingoBoardCommandRepository;
import com.ateam.calmate.event.command.repository.bingo.BingoCellCommandRepository;
import com.ateam.calmate.event.command.repository.bingo.BingoFileUploadCommandRepository;
import com.ateam.calmate.event.query.dto.bingo.BingoLineJudge;
import com.ateam.calmate.member.command.entity.Point;
import com.ateam.calmate.member.command.repository.PointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BingoCommandServiceImpl implements BingoCommandService {

    private final BingoBoardCommandRepository boardRepo;
    private final BingoCellCommandRepository cellRepo;
    private final BingoFileUploadCommandRepository uploadRepo;
    private final FileStoragePort fileStorage;
    private final PointsPort pointsPort;
    private final PointRepository pointRepository;

    @Value("${bingo.points.perLine:50}")
    private int perLinePoint;

    @Value("${bingo.points.boardBonus:500}")
    private int boardBonusPoint;

    @Value("${bingo.default-extend-file-path-id:1}")
    private Long defaultExtendFilePathId;

    @Override
    @Transactional
    public CheckCellWithUploadResult checkCellWithUpload(CheckCellWithUploadCommand cmd, InputStream fileStream) {
        BingoCellEntity cell = cellRepo.findByIdForUpdate(cmd.getCellId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 셀입니다."));
        BingoBoardEntity board = boardRepo.findByIdForUpdate(cell.getBoard().getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 보드입니다."));

        if (!board.getMemberId().equals(cmd.getMemberId()))
            throw new IllegalArgumentException("본인 보드만 수정할 수 있습니다.");

        // 파일 저장
        String directory = "bingo/" + board.getId() + "/" + cell.getId();
        var saved = fileStorage.save(directory, cmd.getOriginalFilename(), cmd.getContentType(), fileStream, cmd.getFileSize());

        BingoFileUploadEntity upload = BingoFileUploadEntity.builder()
                .cell(cell)
                .name(cmd.getOriginalFilename())
                .mimeType(cmd.getContentType())
                .reName(saved.storedFileName())
                .path(saved.relativePath())
                .createdAt(LocalDateTime.now())
                .extendFilePathId(resolveExtendFilePathId(cmd.getExtendFilePathId()))
                .build();
        uploadRepo.save(upload);

        boolean wasAlreadyChecked = Boolean.TRUE.equals(cell.getChecked());

        // 셀 체크 처리
        if (!wasAlreadyChecked) {
            cell.setChecked(true);
            cell.setCheckedAt(LocalDateTime.now());
        }

        // 라인 판정
        List<BingoLineJudge.Pos> checked = new ArrayList<>();
        var allCells = cellRepo.findAllByBoardId(board.getId());
        for (BingoCellEntity c : allCells) {
            if (!Boolean.TRUE.equals(c.getChecked())) {
                continue;
            }
            Integer rowIdx = toZeroBased(c.getRow());
            Integer colIdx = toZeroBased(c.getCol());
            if (rowIdx == null || colIdx == null) {
                continue;
            }
            checked.add(new BingoLineJudge.Pos(rowIdx, colIdx));
        }

        var progress = BingoLineJudge.judge(board.getSize(), checked, BingoLineJudge.CompletionPolicy.oneLine());

        // 포인트 지급
        int points = 0;
        if (progress.getCompletedLineCount() > 0) {
            pointsPort.addPoints(board.getMemberId(), perLinePoint, "BINGO_LINE");
            recordPointHistory(board, perLinePoint, Point.Distinction.EARN);
            points += perLinePoint;
        }
        if (progress.isCompleted()) {
            pointsPort.addPoints(board.getMemberId(), boardBonusPoint, "BINGO_COMPLETE");
            recordPointHistory(board, boardBonusPoint, Point.Distinction.EARN);
            points += boardBonusPoint;
        }

        return CheckCellWithUploadResult.builder()
                .boardId(board.getId())
                .cellId(cell.getId())
                .wasAlreadyChecked(wasAlreadyChecked)
                .newlyCompletedLineCount(progress.getCompletedLineCount())
                .boardCompletedNow(progress.isCompleted())
                .pointsGranted(points)
                .uploadedPath("/uploads/" + saved.relativePath())
                .storedFileName(saved.storedFileName())
                .build();
    }

    private Long resolveExtendFilePathId(Long requested) {
        if (requested != null) {
            return requested;
        }
        return defaultExtendFilePathId;
    }

    @Override
    @Transactional
    public boolean deleteUploadedFile(Integer fileId, Long memberId) {
        // 파일 업로드 엔티티 조회
        BingoFileUploadEntity upload = uploadRepo.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("업로드된 파일을 찾을 수 없습니다."));

        // 연관된 셀 조회
        BingoCellEntity cell = upload.getCell();
        BingoBoardEntity board = cell.getBoard();

        // 본인의 보드인지 확인
        if (!board.getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("본인 보드의 파일만 삭제할 수 있습니다.");
        }

        // 파일 시스템에서 파일 삭제
        String relativePath = upload.getPath();
        boolean fileDeleted = fileStorage.delete(relativePath);

        // DB에서 파일 업로드 기록 삭제
        uploadRepo.delete(upload);

        return fileDeleted;
    }

    @Override
    @Transactional
    public boolean cancelCellCheck(Integer boardId, Integer cellId, Long memberId) {
        // 셀 조회
        BingoCellEntity cell = cellRepo.findById(cellId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 셀입니다."));

        // 보드 조회
        BingoBoardEntity board = boardRepo.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 보드입니다."));

        // 본인의 보드인지 확인
        if (!board.getMemberId().equals(memberId)) {
            throw new IllegalArgumentException("본인 보드만 수정할 수 있습니다.");
        }

        // 셀이 체크되어 있는지 확인
        if (!Boolean.TRUE.equals(cell.getChecked())) {
            throw new IllegalArgumentException("이미 체크 취소된 셀입니다.");
        }

        // 연관된 파일들 찾아서 삭제
        List<BingoFileUploadEntity> uploads = uploadRepo.findByBingoCellId(cellId);
        for (BingoFileUploadEntity upload : uploads) {
            // 파일 시스템에서 파일 삭제
            try {
                fileStorage.delete(upload.getPath());
            } catch (Exception e) {
                // 파일 삭제 실패해도 계속 진행
                System.err.println("Failed to delete file: " + upload.getPath());
            }
        }
        // DB에서 파일 업로드 기록 삭제
        uploadRepo.deleteAll(uploads);

        // 셀 체크 취소
        cell.setChecked(false);
        cell.setCheckedAt(null);

        return true;
    }

    private void recordPointHistory(BingoBoardEntity board, int amount, Point.Distinction distinction) {
        Point history = new Point();
        history.setMemberId(board.getMemberId());
        history.setPoint(amount);
        history.setDistinction(distinction);
        history.setBingoBoardId(board.getId());
        pointRepository.save(history);
    }

    private Integer toZeroBased(Integer value) {
        if (value == null) {
            return null;
        }
        if (value <= 0) {
            return value;
        }
        return value - 1;
    }
}
