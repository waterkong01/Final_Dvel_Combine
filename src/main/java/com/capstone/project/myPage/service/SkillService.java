package com.capstone.project.myPage.service;

import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.entity.Skill;
import com.capstone.project.myPage.repository.MypageRepository;
import com.capstone.project.myPage.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final MypageRepository profileRepository;

    @Autowired
    public SkillService(SkillRepository skillRepository, MypageRepository profileRepository){
        this.skillRepository=skillRepository;
        this.profileRepository=profileRepository;
    }

    // 기술 작성
    public Skill createSkill(Integer mypageId, Skill skill) {
        Optional<Mypage> profile = profileRepository.findById(mypageId);
        if (profile.isPresent()){
            skill.setMypage(profile.get());
            return skillRepository.save(skill);
        } else {
            throw new IllegalArgumentException("Mypage Not Found");
        }
    }

    // 기술 조회
    public List<Skill> getSkillByMypageId(Integer mypageId) {
        return skillRepository.findByMypage_MypageId(mypageId);
    }

    // 기술 수정
    public Skill updateSkill(Integer mypageId, Integer skillId, Skill skill) {
        Optional<Skill> existingSkill = skillRepository.findById(skillId);
        if (existingSkill.isPresent()){
            skill.setMypage(existingSkill.get().getMypage());
            skill.setSkillId(skillId);
            return skillRepository.save(skill);
        } else {
            throw new IllegalArgumentException("Skill Not Found");
        }
    }

    // 기술 삭제
    public void deleteSkill(Integer mypageId, Integer skillId) {
        Optional<Skill> skill = skillRepository.findById(skillId);
        if (skill.isPresent() && skill.get().getMypage().getMypageId().equals(mypageId)){
            skillRepository.delete(skill.get());
        } else {
            throw new IllegalArgumentException("Skill Not Found or Unauthorized Access");
        }
    }
}
