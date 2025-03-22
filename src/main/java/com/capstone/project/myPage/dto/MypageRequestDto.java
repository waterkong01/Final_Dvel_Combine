package com.capstone.project.myPage.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class MypageRequestDto {

    private String profileName;
    private String mypageContent;
    private List<SkillRequestDto> skillList;
    private List<CareerRequestDto> careerList;
    private List<EducationRequestDto> educationList;
}
