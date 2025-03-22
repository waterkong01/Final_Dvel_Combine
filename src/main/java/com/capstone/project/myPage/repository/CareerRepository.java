package com.capstone.project.myPage.repository;

import com.capstone.project.myPage.entity.Career;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareerRepository extends JpaRepository<Career, Integer> {
    List<Career> findByMypage_MypageId(Integer mypageId);
}