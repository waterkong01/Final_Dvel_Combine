package com.capstone.project.myPage.service;

import com.capstone.project.member.entity.Member;
import com.capstone.project.myPage.dto.MypageRequestDto;
import com.capstone.project.myPage.dto.MypageResponseDto;
import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.repository.MypageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MypageService {
    private final MypageRepository mypageRepository;

    // 프로필 작성
    @Transactional
    public Mypage createMypage(MypageRequestDto requestDto) {
        Mypage mypage = new Mypage();
        mypage.setMypageContent(requestDto.getMypageContent());
        return mypageRepository.save(mypage);
    }

    // 프로필 조회
    @Transactional(readOnly = true)
    public MypageResponseDto getMypageById(Integer mypageId) {
        Mypage mypage = mypageRepository.findById(mypageId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필이 없습니다. ID: " + mypageId));

        // Mypage을 MypageResponseDto로 변환해서 반환
        return new MypageResponseDto(mypage);
    }

    // 프로필 수정
    @Transactional
    public MypageResponseDto updateMypage(Integer mypageId, MypageRequestDto requestDto) {
        Mypage mypage = mypageRepository.findById(mypageId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필이 없습니다. ID: " + mypageId));

        mypage.setMypageContent(requestDto.getMypageContent());
        mypageRepository.save(mypage); // 수정된 프로필 저장

        // Mypage을 MypageResponseDto로 변환해서 반환
        return new MypageResponseDto(mypage);
    }

    // 전체 프로필 목록 조회
    public List<MypageResponseDto> getAllMypages() {
        // 전체 프로필을 MypageResponseDto로 변환하여 반환
        return mypageRepository.findAll().stream()
                .map(MypageResponseDto::new)
                .collect(Collectors.toList());
    }

    // 프로필 삭제
    public void deleteMypage(Integer mypageId) {
        // 프로필이 존재하는지 확인
        Mypage mypage = mypageRepository.findById(mypageId).orElseThrow(() -> new IllegalArgumentException("Mypage not found"));
        mypageRepository.delete(mypage); // 프로필 삭제
    }
    // 프로필 생성 로직
    @Transactional
    public Mypage createMypageForMember(Member member) {
        Mypage mypage = new Mypage();
        mypage.setMypageContent(null);  // 기본 프로필 내용 설정
        mypage.setMember(member);  // 회원과 프로필 연결
        return mypage;
    }
}
