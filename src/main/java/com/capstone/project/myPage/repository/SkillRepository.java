package com.capstone.project.myPage.repository;

import com.capstone.project.myPage.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Integer> {

    List<Skill> findByMypage_MypageId(Integer mypageId);
}