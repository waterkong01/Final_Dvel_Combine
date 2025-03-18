package com.capstone.project.chat.dto;

import com.capstone.project.constant.ChatRoomType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomReqDto { //채팅방 생성 요청시 전달되는 데이터
//    private String name;
    private String senderId;    // 추가
    private String receiverId;  // 추가
    private ChatRoomType roomType = ChatRoomType.PRIVATE; // 기본값 설정
    private Integer personCnt = 2; // 참여 가능 인원 필드 추가
}
