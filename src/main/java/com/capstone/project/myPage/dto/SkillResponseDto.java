package com.capstone.project.myPage.dto;

import com.capstone.project.myPage.entity.Skill;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SkillResponseDto {
    private Integer skillId;
    private String skillName;

    public SkillResponseDto(Skill skill) {
        this.skillId = skill.getSkillId();
        this.skillName = skill.getSkillName();
    }
}