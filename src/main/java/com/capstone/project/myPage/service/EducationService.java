package com.capstone.project.myPage.service;

import com.capstone.project.myPage.entity.Education;
import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.repository.EducationRepository;
import com.capstone.project.myPage.repository.MypageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EducationService {

    private final EducationRepository educationRepository;
    private final MypageRepository profileRepository;

    @Autowired
    public EducationService(EducationRepository educationRepository, MypageRepository profileRepository) {
        this.educationRepository = educationRepository;
        this.profileRepository = profileRepository;
    }

    // 교육 정보 작성
    public Education createEducation(Integer mypageId, Education education) {
        Optional<Mypage> profile = profileRepository.findById(mypageId);
        if (profile.isPresent()) {
            education.setMypage(profile.get());
            return educationRepository.save(education);
        } else {
            throw new IllegalArgumentException("Mypage not found");
        }
    }

    // 교육 정보 조회
    public List<Education> getEducationByMypageId(Integer mypageId) {
        return educationRepository.findByMypage_MypageId(mypageId);
    }

    // 특정 교육 정보 수정
    public Education updateEducation(Integer mypageId, Integer educationId, Education education) {
        Optional<Education> existingEducation = educationRepository.findById(educationId);
        if (existingEducation.isPresent()) {
            education.setMypage(existingEducation.get().getMypage()); // 기존 Mypage 유지
            education.setEducationId(educationId);
            return educationRepository.save(education);
        } else {
            throw new IllegalArgumentException("Education not found");
        }
    }

    // 특정 교육 정보 삭제
    public void deleteEducation(Integer mypageId, Integer educationId) {
        Optional<Education> education = educationRepository.findById(educationId);
        if (education.isPresent() && education.get().getMypage().getMypageId().equals(mypageId)) {
            educationRepository.delete(education.get());
        } else {
            throw new IllegalArgumentException("Education not found");
        }
    }
}
