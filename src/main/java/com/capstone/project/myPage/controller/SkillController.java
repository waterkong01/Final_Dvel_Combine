package com.capstone.project.myPage.controller;

import com.capstone.project.myPage.entity.Skill;
import com.capstone.project.myPage.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/skill/{mypageId}")
public class SkillController {
    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService){
        this.skillService=skillService;
    }

    // 기술 추가
    @PostMapping
    public Skill createSkill(@PathVariable Integer mypageId, @RequestBody Skill skill){
        return skillService.createSkill(mypageId, skill);
    }

    // 기술 특정 조회
    @GetMapping
    public List<Skill> getSkillByMypageId(@PathVariable Integer mypageId){
        return skillService.getSkillByMypageId(mypageId);
    }
    // 기술 수정
    @PutMapping("/{skillId}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Integer mypageId, @PathVariable Integer skillId, @RequestBody Skill skill){
        Skill updatedSkill = skillService.updateSkill(mypageId, skillId, skill);
        return ResponseEntity.ok(updatedSkill);
    }

    // 기술 삭제
    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Integer mypageId, @PathVariable Integer skillId){
        skillService.deleteSkill(mypageId,skillId);
        return ResponseEntity.noContent().build();
    }
}
