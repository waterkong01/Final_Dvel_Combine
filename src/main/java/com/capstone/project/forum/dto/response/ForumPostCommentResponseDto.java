package com.capstone.project.forum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 댓글 응답 DTO
 * API 응답에 필요한 댓글 정보를 포함
 */
@Data
@Builder
@AllArgsConstructor
public class ForumPostCommentResponseDto {

    private Integer id; // 댓글 ID
    private String content; // 댓글 내용
    private String authorName; // 작성자 이름
    private Integer memberId; // 댓글 작성자 ID 추가
    private Integer likesCount; // 좋아요 수
    private Boolean hidden; // 숨김 여부
    private String removedBy; // 삭제자 정보
    private String editedBy; // 수정자 정보 (추가)
    private Boolean locked; // 편집 잠금 상태 (추가)
    private LocalDateTime createdAt; // 생성 시간
    private LocalDateTime updatedAt; // 수정 시간
    private String fileUrl; // 첨부 파일 URL
    private Long reportCount; // 누적 신고 횟수
    private Boolean hasReported; // 신고 여부 추가

    // 추가 필드: 부모 댓글 정보
    private Integer parentCommentId; // 부모 댓글 ID (답글의 경우)
    private String parentContent; // 부모 댓글 내용 (UI에서 사용)

    // 추가 필드: OP 작성자 및 내용 (인용 시 필요)
    private String opAuthorName; // OP 작성자 이름
    private String opContent; // OP 내용

    // Derived field to indicate admin edits
    public Boolean getEditedByAdmin() {
        return "ADMIN".equals(this.editedBy);
    }
}
