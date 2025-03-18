package com.capstone.project.chat.repository;

import com.capstone.project.member.entity.Member;
import com.capstone.project.chat.entity.ChatMember;
import com.capstone.project.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findByChatRoom(ChatRoom chatRoom);

    Optional<ChatMember> findByMemberAndChatRoom(Member member, ChatRoom chatRoom);

/*
    Optional<ChatMember> findBySenderAndChatRoom(Member sender, ChatRoom chatRoom);
    Optional<ChatMember> findByReceiverAndChatRoom(Member receiver, ChatRoom chatRoom);
*/

    // 해당 roomId에 입장한 회원 수
    @Query("SELECT COUNT(cm) FROM ChatMember cm WHERE cm.chatRoom.roomId = :roomId")
    int cntRoomMember(@Param("roomId") String roomId);
}
