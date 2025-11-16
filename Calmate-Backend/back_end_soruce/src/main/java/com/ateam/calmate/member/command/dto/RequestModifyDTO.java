package com.ateam.calmate.member.command.dto;

import com.ateam.calmate.member.command.entity.MemberGoal;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class RequestModifyDTO {

    private Long id;
    private String email;
    private String nickname;
    private String phone;
    private BigDecimal weight;
    private BigDecimal height;
    private int bodyMetric;
    private MemberGoal.GoalType goalType;
    private LocalDateTime endDate;
    private String bmr;
    private BigDecimal targetValue;
}