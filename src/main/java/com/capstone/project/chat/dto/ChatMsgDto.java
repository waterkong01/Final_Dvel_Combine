package com.capstone.project.chat.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMsgDto {
    public enum MsgType {
        ENTER, TALK, CLOSE
    }
    private MsgType type;
    private Long id;
    private String roomId;
    private Integer memberId;
    private String profile;
    private String nickName;
    private String sendMember;
    private String msg;
    private LocalDateTime regDate;

    public ChatMsgDto(String msg, String roomId, Integer memberId, LocalDateTime regDate) {
        this.msg = msg;
        this.roomId = roomId;
        this.memberId = memberId;
        this.regDate = regDate;
    }

    public ChatMsgDto() {}
}