package com.capstone.project.myPage.service;

import com.capstone.project.myPage.entity.Career;
import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.repository.CareerRepository;
import com.capstone.project.myPage.repository.MypageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CareerService {

    private final CareerRepository careerRepository;
    private final MypageRepository mypageRepository;

    @Autowired
    public CareerService(CareerRepository careerRepository, MypageRepository mypageRepository) {
        this.careerRepository = careerRepository;
        this.mypageRepository = mypageRepository;
    }

    // 경력 작성
    public Career createCareer(Integer mypageId, Career career) {
        Optional<Mypage> mypage = mypageRepository.findById(mypageId);
        if (mypage.isPresent()) {
            career.setMypage(mypage.get());
            return careerRepository.save(career);
        } else {
            throw new IllegalArgumentException("Mypage Not Found");
        }
    }

    // 경력 조회
    public List<Career> getCareerByMypageId(Integer mypageId) {
        return careerRepository.findByMypage_MypageId(mypageId);
    }

    // 경력 수정
    public Career updateCareer(Integer mypageId, Integer careerId, Career career) {
        Optional<Career> existingCareer = careerRepository.findById(careerId);
        if (existingCareer.isPresent()) {
            career.setMypage(existingCareer.get().getMypage()); // 기존 경력의 Mypage 정보 설정
            career.setCareerId(careerId); // 기존 Career의 ID 유지
            return careerRepository.save(career); // 수정된 경력 저장
        } else {
            throw new IllegalArgumentException("Career Not Found");
        }
    }

    // 경력 삭제
    public void deleteCareer(Integer mypageId, Integer careerId) {
        Optional<Career> career = careerRepository.findById(careerId);
        if (career.isPresent() && career.get().getMypage().getMypageId().equals(mypageId)) {
            careerRepository.delete(career.get());
        } else {
            throw new IllegalArgumentException("Career Not Found or Unauthorized Access");
        }
    }
}
