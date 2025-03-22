package com.capstone.project.myPage.repository;

import com.capstone.project.myPage.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Integer> {
    List<Education> findByMypage_MypageId(Integer memberId);
}