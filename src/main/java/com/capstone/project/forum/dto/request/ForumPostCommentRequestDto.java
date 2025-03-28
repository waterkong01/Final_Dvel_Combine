package com.capstone.project.forum.dto.request;

import lombok.Data;

/**
 * 새로운 댓글 생성을 위한 요청 DTO
 */
@Data
public class ForumPostCommentRequestDto {
    private Integer postId; // 게시글 ID
    private Integer memberId; // 작성자 ID
    private String content; // 댓글 내용

    // 추가 필드: 부모 댓글 ID (답글 또는 인용 시 사용)
    private Integer parentCommentId;

    // 추가 필드: OP 작성자의 이름 (인용 시 필요)
    private String opAuthorName;

    // 추가 필드: OP 내용 (인용 시 필요)
    private String opContent;

    private Boolean editedByAdmin = false; // 관리자 수정 여부

    private Boolean editedByAdminTitle = false; // 관리자에 의해 제목이 수정되었는지 여부
    private Boolean editedByAdminContent = false; // 관리자에 의해 내용이 수정되었는지 여부

    private String fileUrl; // 첨부 파일 URL (Firebase 또는 다른 스토리지 서비스에서 반환된 URL)
}
