package com.capstone.project.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.capstone.project.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "send_member")
    private String sendMember;

    @Column(name = "profile")
    private String profile;

    // 전송자 닉네임
    @Column(name = "nick_name")
    private String nickName;

    // 전송 내용
    @Column(name = "msg")
    private String msg;

    // 전송 시간
    @Column(name = "sent_at")
    private LocalDateTime regDate;

    // 채팅방 id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private ChatRoom chatRoom;
}