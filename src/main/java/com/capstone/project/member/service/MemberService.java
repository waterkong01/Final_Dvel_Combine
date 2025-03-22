package com.capstone.project.member.service;

import com.capstone.project.jwt.TokenProvider;
import com.capstone.project.jwt.repository.RefreshTokenRepository;
import com.capstone.project.member.dto.request.MemberRequestDto;
import com.capstone.project.member.dto.response.MemberResponseDto;
import com.capstone.project.member.entity.Member;
import com.capstone.project.member.repository.MemberRepository;
import com.capstone.project.myPage.entity.Mypage;
import com.capstone.project.myPage.service.MypageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 회원 서비스 클래스
 * <p>
 * 회원 관련 비즈니스 로직을 처리합니다.
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final MypageService mypageService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProvider tokenProvider;
    /**
     * 회원 프로필 조회
     *
     * @param memberId 조회할 회원 ID
     * @return MemberResponseDto 회원 프로필 정보
     * @throws EntityNotFoundException 회원을 찾을 수 없을 경우 예외 발생
     */
    public MemberResponseDto getMemberProfile(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + memberId));

        // 프로필 사진 URL이 없으면 기본 URL 사용
        String profileImg = member.getProfileImg();
        if (profileImg == null || profileImg.isEmpty()) {
            profileImg = "https://firebasestorage.googleapis.com/v0/b/kh-react-firebase.firebasestorage.app/o/default-profile-picture-url.jpg?alt=media&token=16b39451-4ee9-4bdd-adc9-78b6cda4d4bb";
        }

        log.info("Fetching profile for memberId={} | Name={}| NickName={} | Email={} | ProfileImg={}",
                memberId, member.getName(), member.getNickName(), member.getEmail(), profileImg);

        return new MemberResponseDto(
                member.getId(),
                member.getEmail(),
                member.getName(),
                member.getNickName(),
                member.getPhoneNumber(),
                member.getCurrentCompany(),
                member.getShowCompany(),
                profileImg,
                member.getRole().name()
        );
    }

    /**
     * 회원 프로필 수정
     *
     * @param memberId   수정할 회원 ID
     * @param requestDto 수정할 정보가 담긴 DTO
     * @return 수정된 회원 프로필 정보 DTO
     */
    public MemberResponseDto updateMemberProfile(Integer memberId, MemberRequestDto requestDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + memberId));

        member.setName(requestDto.getName());
        member.setPhoneNumber(requestDto.getPhoneNumber());
        member.setCurrentCompany(requestDto.getCurrentCompany());
        member.setShowCompany(requestDto.getShowCompany());

        Member updatedMember = memberRepository.save(member);
        return new MemberResponseDto(updatedMember);
    }

    /**
     * 회원 탈퇴 (계정 삭제)
     *
     * @param memberId 삭제할 회원 ID
     * @throws EntityNotFoundException 회원을 찾을 수 없을 경우 예외 발생
     */
    public void deleteMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + memberId));

        // 먼저 연관된 RefreshToken 삭제 (Integer -> Long으로 변환)
        refreshTokenRepository.deleteByMemberId(memberId);

        memberRepository.delete(member);
    }

    /**
     * 현재 로그인된 회원 정보 조회
     *
     * @param userId 로그인된 회원 ID
     * @return MemberResponseDto 현재 회원 정보
     * @throws RuntimeException 회원을 찾을 수 없을 경우 예외 발생
     */
    public MemberResponseDto getCurrentUser(Integer userId) {
        log.error("유저 아이디 값 : {}", userId);
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new MemberResponseDto(member);
    }

    /**
     * 이메일로 회원 정보 수정
     *
     * @param email      수정할 회원 이메일
     * @param requestDto 수정할 정보가 담긴 DTO
     * @return 수정된 회원 정보 DTO
     * @throws RuntimeException 회원을 찾을 수 없을 경우 예외 발생
     */
    @Transactional
    public MemberResponseDto updateUser(String email, MemberRequestDto requestDto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        member.setName(requestDto.getName());
        member.setPhoneNumber(requestDto.getPhoneNumber());
        member.setCurrentCompany(requestDto.getCurrentCompany());
        member.setShowCompany(requestDto.getShowCompany());

        return new MemberResponseDto(member);
    }

    /**
     * 사용자 역할 업데이트
     *
     * @param email 회원 이메일
     * @param role  업데이트할 역할 (대소문자 무관)
     * @throws RuntimeException 회원을 찾을 수 없을 경우 예외 발생
     */
    @Transactional
    public void updateUserRole(String email, String role) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        member.setRole(Member.Role.valueOf(role.toUpperCase()));
    }

    /**
     * 이메일로 계정 삭제
     *
     * @param email 삭제할 회원 이메일
     * @throws RuntimeException 회원을 찾을 수 없을 경우 예외 발생
     */
    @Transactional
    public void deleteAccount(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        memberRepository.delete(member);
    }

    /**
     * 해당 회원이 ADMIN 권한을 가지고 있는지 확인
     *
     * @param memberId 확인할 회원 ID
     * @return true: ADMIN, false: USER
     * @throws IllegalArgumentException 잘못된 회원 ID일 경우 예외 발생
     */
    public boolean isAdmin(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID: " + memberId));
        return member.getRole() == Member.Role.ADMIN;
    }

    /**
     * 특정 회원의 친구 ID 목록을 반환
     *
     * @param memberId 현재 로그인된 회원 ID
     * @return 친구들의 회원 ID 리스트
     * @throws EntityNotFoundException 회원을 찾을 수 없을 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public List<Integer> getFriendIds(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + memberId));

        return member.getFriends().stream()
                .map(Member::getId)
                .collect(Collectors.toList());
    }

    /**
     * 랜덤 친구 추천 목록 조회
     * <p>
     * 현재 로그인한 회원을 제외하고 최근 가입한 회원 중 5명을 랜덤 추천합니다.
     * </p>
     *
     * @param memberId 현재 로그인한 회원 ID
     * @return 추천된 회원 정보 DTO 리스트
     */
    @Transactional(readOnly = true)
    public List<MemberResponseDto> getSuggestedFriends(Integer memberId) {
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "registeredAt")); // 최신 회원 5명 추천

        List<Member> suggestedMembers = memberRepository.findRandomMembersExcludingUser(memberId, pageable);

        return suggestedMembers.stream()
                .map(member -> new MemberResponseDto(
                        member.getId(),
                        member.getEmail(),
                        member.getName(),
                        member.getNickName(),
                        member.getPhoneNumber(),
                        member.getCurrentCompany(),
                        member.getShowCompany(),
                        member.getProfileImg(),
                        member.getRole().name()
                ))
                .collect(Collectors.toList());
    }






    // 토큰에서 Member 객체를 받아오는 메서드( 클래스 외부에서도 불러올 수 있게 public )
    public Member convertTokenToEntity(String token) {
        try{
            // 토큰 앞에 있는 "Bearer " 제거
            token = token.replace("Bearer ", "");
            // token 을 통해 memberId를 담고 있는 객체 Authentication 을 불러옴
            Authentication authentication = tokenProvider.getAuthentication(token);
            log.warn("Authentication 의 형태 : {}", authentication);
            // Name 은 String 으로 되어 있기 때문에 Long으로 바꿔주는 과정이 있어야 타입이 일치
            Integer id = Integer.parseInt(authentication.getName());
            Member member = memberRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("존재 하지 않는 memberId 입니다."));

            // 이메일을 반환하여 클라이언트에서 처리하도록 함
            String email = member.getEmail();
            String nickName = member.getNickName();
            String profileImg = member.getProfileImg();
            Integer memberId = member.getId();
            log.warn("토큰으로부터 얻은 이메일: {}", email);
            log.warn("토큰으로부터 얻은 닉네임: {}", nickName);
            log.warn("토큰으로부터 얻은 프로필이미지: {}", profileImg);
            log.warn("토큰으로부터 얻은 멤버아이디: {}", memberId);
            log.warn("토큰으로부터 얻은 Member: {}", member);
            return member;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
    // 채팅 - memberId로 nickName 가져오기
    public String getNickNameById(Integer id) {
        return memberRepository.getNickNameById(id);
    }
    // 채팅 - memberId로 profileImg 가져오기
    public String getProfileImgById(Integer id) {
        return memberRepository.getProfileImgById(id);
    }
}
