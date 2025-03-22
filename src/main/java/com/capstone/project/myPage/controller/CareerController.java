package com.capstone.project.myPage.controller;


import com.capstone.project.myPage.entity.Career;
import com.capstone.project.myPage.service.CareerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/career/{mypageId}")
public class CareerController {
    private final CareerService careerService;

    @Autowired
    public CareerController(CareerService careerService) {
        this.careerService = careerService;
    }

    // 경력 추가
    @PostMapping
    public Career createCareer(@PathVariable Integer mypageId, @RequestBody Career career){
        return careerService.createCareer(mypageId, career);

    }

    // 경력 특정 ID 조회
    @GetMapping
    public List<Career> getCareerByMypageId(@PathVariable Integer mypageId){
        return careerService.getCareerByMypageId(mypageId);
    }

    // 경력 수정
    @PutMapping("/{careerId}")
    public ResponseEntity<Career> updateCareer(@PathVariable Integer mypageId, @PathVariable Integer careerId, @RequestBody Career career){
        Career updatedCareer = careerService.updateCareer(mypageId, careerId, career);
        return ResponseEntity.ok(updatedCareer);

    }

    // 경력 삭제
    @DeleteMapping("/{careerId}")
    public ResponseEntity<Void> deleteCareer(@PathVariable Integer mypageId, @PathVariable Integer careerId){
        careerService.deleteCareer(mypageId, careerId);
        return ResponseEntity.noContent().build();
    }
}
