package com.capstone.project.myPage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class EducationRequestDto {

    // Getters and Setters
    private String schoolName;
    private String degree;
    private LocalDate startDate;
    private LocalDate endDate;

}
