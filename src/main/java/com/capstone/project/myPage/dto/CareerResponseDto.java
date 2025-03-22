package com.capstone.project.myPage.dto;

import com.capstone.project.myPage.entity.Career;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class CareerResponseDto {

    private Integer careerId;
    private String companyName;
    private String jobName;
    private LocalDate startDate;
    private LocalDate endDate;

    public CareerResponseDto(Career career){
        this.careerId=career.getCareerId();
        this.companyName=career.getCompanyName();
        this.jobName=career.getJobName();
        this.startDate=career.getStartDate();
        this.endDate=career.getEndDate();
    }

}
