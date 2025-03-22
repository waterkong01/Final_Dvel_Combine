package com.capstone.project.myPage.controller;

import com.capstone.project.myPage.dto.MypageRequestDto;
import com.capstone.project.myPage.dto.MypageResponseDto;
import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.service.MypageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/mypage")
public class MypageController {
    private final MypageService mypageService;

    @Autowired
    public MypageController(MypageService mypageService){
        this.mypageService = mypageService;
    }

    // 프로필 추가
    @PostMapping
    public MypageResponseDto createMypage(@RequestBody MypageRequestDto requestDto){
        Mypage mypage = mypageService.createMypage(requestDto);
        return new MypageResponseDto(mypage); // Mypage을 MypageResponseDto로 변환하여 반환
    }

    // 프로필 전체 조회
    @GetMapping
    public List<MypageResponseDto> getAllMypage() {
        return mypageService.getAllMypages(); // 이미 MypageResponseDto 리스트 반환
    }

    // 프로필 특정 ID 조회
    @GetMapping("/{mypageId}")
    public MypageResponseDto getMypageById(@PathVariable Integer mypageId){
        return mypageService.getMypageById(mypageId); // 이미 MypageResponseDto 반환
    }

    // 프로필 수정
    @PutMapping("/{mypageId}")
    public ResponseEntity<MypageResponseDto> updateMypage(@PathVariable Integer mypageId, @RequestBody MypageRequestDto requestDto){
        MypageResponseDto updatedMypage = mypageService.updateMypage(mypageId, requestDto);
        return ResponseEntity.ok(updatedMypage); // MypageResponseDto로 반환
    }

    // 프로필 삭제
    @DeleteMapping("/{mypageId}")
    public ResponseEntity<String> deleteMypage(@PathVariable Integer mypageId) {
        mypageService.deleteMypage(mypageId); // 프로필 삭제
        return ResponseEntity.ok("Mypage deleted successfully"); // 성공 메시지 반환
    }
}
