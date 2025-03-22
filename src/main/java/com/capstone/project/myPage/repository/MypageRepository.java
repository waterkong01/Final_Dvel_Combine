package com.capstone.project.myPage.repository;

import com.capstone.project.myPage.entity.Mypage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MypageRepository extends JpaRepository<Mypage, Integer> {
}