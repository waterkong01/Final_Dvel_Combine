package com.capstone.project.chat.controller;

import com.capstone.project.chat.dto.ChatMsgDto;
import com.capstone.project.chat.dto.ChatRoomResDto;
import com.capstone.project.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;
    // 1:1 채팅방 생성 또는 기존 방 조회
    @PostMapping("/room")
    public ResponseEntity<ChatRoomResDto> createRoom(@RequestBody Map<String, Integer> request) {
        Integer senderId = request.get("senderId");
        Integer receiverId = request.get("receiverId");

        ChatRoomResDto chatRoom = chatService.createChatRoom(senderId, receiverId);
        return ResponseEntity.ok(chatRoom);
    }
    // 참여중인 채팅방 리스트
    @GetMapping("/myRooms/{memberId}")
    public ResponseEntity<List<ChatRoomResDto>> getChatRoomsByMemberId(@PathVariable Integer memberId) {
        log.info("Requested memberId : {}", memberId);
        // Service 호출하여 참여 중인 채팅방 리스트 반환
        List<ChatRoomResDto> chatRooms = chatService.getChatRoomsByMemberId(memberId);
        return ResponseEntity.ok(chatRooms);
    }
    // 방 정보 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoomResDto> findRoomById(@PathVariable String roomId) {
        log.info("Requested roomId : {}", roomId);
        try {
            ChatRoomResDto room = chatService.findRoomById(roomId);
            if (room != null) {
                log.info("채팅방 정보 가져가기 : {}", room);
                return ResponseEntity.ok(room);
            } else {
                log.warn("채팅방을 ID로 찾을 수 없음: {}", roomId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("채팅방 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/cntRoomMember/{roomId}")
    public ResponseEntity<Integer> cntRoomMember(@PathVariable String roomId) {
        try {
            int memberCnt = chatService.cntOfRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return ResponseEntity.ok(memberCnt);
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // 메시지 저장하기
    @PostMapping("/saveMessage")
    public ResponseEntity<ChatMsgDto> saveMessage(@RequestBody ChatMsgDto chatMsgDto) {
        chatService.saveMsg(chatMsgDto.getRoomId(), chatMsgDto.getMemberId(), chatMsgDto.getProfile(), chatMsgDto.getNickName(), chatMsgDto.getMsg());
        return ResponseEntity.ok(chatMsgDto);
    }
    // 채팅 내역 리스트
    @GetMapping("/message/{roomId}")
    public ResponseEntity<List<ChatMsgDto>> findAll(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.findAllChatting(roomId));
    }
    // 마지막 채팅 내용
    @GetMapping("/lastMessage/{roomId}")
    public ResponseEntity<ChatMsgDto> getLastMsg (@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getLastMsg(roomId));
    }
/*    // 참여 이후 채팅 내역 리스트
    @GetMapping("/message/{roomId}/{memberId}")
    public ResponseEntity<List<ChatMsgDto>> findAll(@PathVariable String roomId, @PathVariable Long memberId) {
        return ResponseEntity.ok(chatService.findAllChatting(roomId, memberId));
    }*/
}