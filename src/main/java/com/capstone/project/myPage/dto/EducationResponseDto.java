package com.capstone.project.myPage.dto;

import com.capstone.project.myPage.entity.Education;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class EducationResponseDto {

    // Getters and Setters
    private Integer educationId;
    private String schoolName;
    private String degree;
    private LocalDate startDate;
    private LocalDate endDate;

    // Constructor
    public EducationResponseDto(Education education) {
        this.educationId = education.getEducationId();
        this.schoolName = education.getSchoolName();
        this.degree = education.getDegree();
        this.startDate = education.getStartDate();
        this.endDate = education.getEndDate();
    }

}
