package com.ateam.calmate.security;

public class MemberGoalNotFoundException extends RuntimeException {
    public MemberGoalNotFoundException(String message) {
        super(message);
    }
}
