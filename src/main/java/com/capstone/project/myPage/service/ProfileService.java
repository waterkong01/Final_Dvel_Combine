package com.capstone.project.myPage.service;

import com.capstone.project.member.entity.Member;
import com.capstone.project.member.repository.MemberRepository;
import com.capstone.project.myPage.dto.*;
import com.capstone.project.myPage.entity.Profile;
import com.capstone.project.myPage.repository.ProfileRepository;
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
public class ProfileService {
/*    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MemberRepository memberRepository;*/
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    // 마이페이지 데이터 조회
    public MemberProfileResponseDto getMyPageData(Integer memberId) {
        MemberProfileResponseDto dto = profileRepository.findMemberProfileById(memberId);

        // 전화번호에 하이픈 추가
        if (dto.getPhoneNumber() != null) {
            dto.setPhoneNumber(formatPhoneNumber(dto.getPhoneNumber()));
        }

        return dto;
    }

    // 하이픈 추가 유틸리티 메서드
    private String formatPhoneNumber(String phoneNumber) {
        // 예시: 01012345678 -> 010-1234-5678
        if (phoneNumber.length() == 11) {
            return phoneNumber.replaceAll("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
        } else if (phoneNumber.length() == 10) {
            return phoneNumber.replaceAll("(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3");
        }
        return phoneNumber; // 기본적으로 원본 반환
    }
    // 이름 수정
    public void updateName(String name, int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(()-> new RuntimeException("맴버를 조회 할 수 없습니다."));

        member.setName(name);
        memberRepository.save(member);
    }
    // 전화번호 수정
    public void updatePhone(String phone, int memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(()-> new RuntimeException("맴버를 조회 할 수 없습니다."));

        // 전화번호에서 하이픈 제거 후 저장
        member.setPhoneNumber(phone.replaceAll("-", ""));
        memberRepository.save(member);
    }

    // 지역 수정
    public void updateLocation(String location, int memberId) {
        log.error("멤버 아이디 :{}",memberId);
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> createProfileForMember(memberId));

        profile.setLocation(location);
        profileRepository.save(profile);
    }


    // 자기소개 수정
    public void updateBio(String bio, int memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> createProfileForMember(memberId));

        profile.setBio(bio);
        profileRepository.save(profile);
    }

    // 이력서 URL 수정
    public void updateResumeUrl(String resumeUrl, int memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> createProfileForMember(memberId));

        profile.setResumeUrl(resumeUrl);
        profileRepository.save(profile);
    }
    public void updateSkills (String skills, int memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseGet(() -> createProfileForMember(memberId));

        profile.setSkills(skills);
        profileRepository.save(profile);
    }

    // 프로필이 없으면 생성하는 메서드
    private Profile createProfileForMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Profile profile = new Profile();

        profile.setMember(member); // Member와 연결
        return profileRepository.save(profile);
    }




/*    // 프로필 작성
    public Profile createProfile(MemberProfileRequestDto requestDto) {
        Profile profile = new Profile();
        profile.setBio(requestDto.getBio());
        return profileRepository.save(profile);
    }

    // 프로필 조회
    @Transactional(readOnly = true)
    public MemberProfileResponseDto getProfileById(Integer memberId) {
        Profile profile = profileRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필이 없습니다. ID: " + memberId));

        // Profile을 ProfileResponseDto로 변환해서 반환
        return new MemberProfileResponseDto(profile);
    }

    // 프로필 수정
    @Transactional
    public MemberProfileResponseDto updateProfile(Integer memberId, MemberProfileRequestDto requestDto) {
        Profile profile = profileRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필이 없습니다. ID: " + memberId));

        profile.setBio(requestDto.getBio());
        profileRepository.save(profile); // 수정된 프로필 저장

        // Profile을 ProfileResponseDto로 변환해서 반환
        return new MemberProfileResponseDto(profile);
    }

    // 전체 프로필 목록 조회
    public List<MemberProfileResponseDto> getAllProfiles() {
        // 전체 프로필을 ProfileResponseDto로 변환하여 반환
        return profileRepository.findAll().stream()
                .map(MemberProfileResponseDto::new)
                .collect(Collectors.toList());
    }

    // 프로필 삭제
    public void deleteProfile(Integer memberId) {
        // 프로필이 존재하는지 확인
        Profile profile = profileRepository.findById(memberId).orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        profileRepository.delete(profile); // 프로필 삭제
    }
    // 프로필 생성 로직
    @Transactional
    public Profile createProfileForMember(Member member) {
        Profile profile = new Profile();
        profile.setBio(null);  // 기본 프로필 내용 설정
        profile.setMember(member);  // 회원과 프로필 연결
        return profile;
    }*/
}