package com.capstone.project.myPage.dto;

import com.capstone.project.myPage.entity.Mypage;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Slf4j
@ToString
@NoArgsConstructor
public class MypageResponseDto {

    private Integer mypageId;
    private String mypageContent;  // bio
    private List<SkillResponseDto> skillList;
    private List<CareerResponseDto> careerList;
    private List<EducationResponseDto> educationList;

    public MypageResponseDto(Mypage mypage) {
        this.mypageId = mypage.getMypageId();
        this.mypageContent = mypage.getMypageContent();
        this.skillList = mypage.getSkillList().stream()
                .map(SkillResponseDto::new)
                .collect(Collectors.toList());
        this.careerList = mypage.getCareerList().stream()
                .map(CareerResponseDto::new)
                .collect(Collectors.toList());
        this.educationList = mypage.getEducationList().stream()
                .map(EducationResponseDto::new)
                .collect(Collectors.toList());
    }
}
