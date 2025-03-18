package com.capstone.project.chat.repository;

import com.capstone.project.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    // 전체 조회 (오름차순 정렬)
    List<ChatRoom> findAllByOrderByRegDateAsc();

    // 특정 사용자끼리의 1:1 채팅방 존재 여부 확인
    Optional<ChatRoom> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

/*    // 로그인한 회원이 포함된 채팅방 목록 조회 (단체 채팅)
    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatMember cm WHERE cm.member.memberId = :memberId")
    List<ChatRoom> findChatRoomsByMemberId(@Param("memberId") Long memberId);*/

    // 특정 사용자가 속한 1:1 채팅방 목록 조회 (1:1 채팅)
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.sender.id = :memberId OR cr.receiver.id = :memberId ORDER BY cr.regDate ASC")
    List<ChatRoom> findChatRoomsByMemberId(@Param("memberId") Integer memberId);

/*    @Query("SELECT cr FROM ChatRoom cr JOIN FETCH cr.sender JOIN FETCH cr.receiver WHERE cr.sender.memberId = :memberId OR cr.receiver.memberId = :memberId ORDER BY cr.regDate ASC")
    List<ChatRoom> findChatRoomsByMemberId(@Param("memberId") Long memberId);*/
    @Query("SELECT cr FROM ChatRoom cr JOIN FETCH cr.sender JOIN FETCH cr.receiver WHERE cr.roomId = :roomId")
    Optional<ChatRoom> findByRoomId(@Param("roomId") String roomId);
}
