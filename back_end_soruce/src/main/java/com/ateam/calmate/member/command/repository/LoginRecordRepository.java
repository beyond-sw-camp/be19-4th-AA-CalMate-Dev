package com.ateam.calmate.member.command.repository;

import com.ateam.calmate.member.command.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRecordRepository  extends JpaRepository<LoginHistory,Long> {
}
