package com.capstone.project.myPage.controller;

import com.capstone.project.myPage.entity.Education;
import com.capstone.project.myPage.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/education/{mypageId}")
public class EducationController {
    private final EducationService educationService;

    @Autowired
    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    // 교육 추가
    @PostMapping
    public Education createEducation(@PathVariable Integer mypageId, @RequestBody Education education) {
        return educationService.createEducation(mypageId, education);
    }

    // 교육 특정 ID 조회
    @GetMapping
    public List<Education> getEducationByMypageId(@PathVariable Integer mypageId) {
        return educationService.getEducationByMypageId(mypageId);
    }

    // 교육 수정
    @PutMapping("/{educationId}")
    public ResponseEntity<Education> updateEducation(@PathVariable Integer mypageId, @PathVariable Integer educationId, @RequestBody Education education) {
        Education updatedEducation = educationService.updateEducation(mypageId, educationId, education);
        return ResponseEntity.ok(updatedEducation);
    }

    // 교육 삭제
    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Integer mypageId, @PathVariable Integer educationId) {
        educationService.deleteEducation(mypageId, educationId);
        return ResponseEntity.noContent().build();
    }
}
