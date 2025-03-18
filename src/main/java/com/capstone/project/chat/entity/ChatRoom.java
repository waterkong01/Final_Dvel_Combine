package com.capstone.project.chat.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.capstone.project.constant.ChatRoomType;
import com.capstone.project.member.entity.Member;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "chatRoom")
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    // senderId_receiverId 형식 사용하기
    @Id
    @Column(name = "room_id")
    private String roomId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Member sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Member receiver;

    @Column(name = "created_at")
    private LocalDateTime regDate; // 방 생성 시간

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private ChatRoomType roomType; // 채팅방 유형: PRIVATE or GROUP

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Chat> chats = new ArrayList<>(); // 채팅방 대화 내용 저장

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMember> chatMember = new ArrayList<>();

    // 채팅방 최대 멤버 수 설정
    // 1:1에서는 2로 설정
    @Column(name = "person_cnt", nullable = false)
    private Integer personCnt = 2; // 최대 입장 가능 인원

    // roomType 기본값 PRIVATE로 설정
    @PrePersist
    public void prePersist() {
        if (this.roomType == null) {
            this.roomType = ChatRoomType.PRIVATE;
        }
    }

    // 1:1 채팅방 roomId 생성 메서드
    public static String generateRoomId(Integer senderId, Integer receiverId) {
        return senderId < receiverId
                ? senderId + "_" + receiverId
                : receiverId + "_" + senderId;
    }

    public ChatRoom(Member sender, Member receiver) {
        this.sender = sender;   // 추가
        this.receiver = receiver;   // 추가
        this.roomId = generateRoomId(sender.getMemberId(), receiver.getMemberId());
        this.regDate = LocalDateTime.now();
        this.roomType = ChatRoomType.PRIVATE;
    }
}