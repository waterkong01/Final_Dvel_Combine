package com.capstone.project.myPage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class CareerRequestDto {

    private String companyName;
    private String jobName;
    private LocalDate startDate;
    private LocalDate endDate;

}
