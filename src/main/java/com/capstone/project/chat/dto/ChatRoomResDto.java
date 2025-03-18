package com.capstone.project.chat.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.capstone.project.constant.ChatRoomType;
import com.capstone.project.chat.entity.ChatRoom;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Setter
@Slf4j
@ToString
@NoArgsConstructor
public class ChatRoomResDto {
    private String roomId;
//    private String name;
    private Integer senderId;    // 추가
    private Integer receiverId;  // 추가
    private LocalDateTime regDate;
    private ChatRoomType roomType = ChatRoomType.PRIVATE; // 기본값 설정
    private Integer personCnt = 2; // 참여 가능 인원 필드 추가

    @JsonIgnore // 웹소켓 세션의 직렬화 방지
    private Set<WebSocketSession> sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());

    //세션 수가 0인지 확인하는 메서드
    public boolean isSessionEmpty() {
        return this.sessions == null || this.sessions.isEmpty();
    }

    public ChatRoomResDto(ChatRoom chatRoom) {
        this.roomId = chatRoom.getRoomId();
        this.senderId = chatRoom.getSender().getMemberId();  // 수정: Member 타입 유지
        this.receiverId = chatRoom.getReceiver().getMemberId();
        this.regDate = chatRoom.getRegDate();
        this.roomType = chatRoom.getRoomType();
    }

    @Builder    // 빌더 패턴 적용
    public ChatRoomResDto(String roomId, Integer senderId, Integer receiverId, LocalDateTime regDate, Integer personCnt) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.regDate = regDate;
        this.personCnt = personCnt;
        this.sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());
    }
}
