package com.capstone.project.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.capstone.project.chat.dto.ChatMsgDto;
import com.capstone.project.chat.dto.ChatRoomResDto;
import com.capstone.project.member.entity.Member;
import com.capstone.project.chat.entity.Chat;
import com.capstone.project.chat.entity.ChatMember;
import com.capstone.project.chat.entity.ChatRoom;
import com.capstone.project.member.repository.MemberRepository;
import com.capstone.project.chat.repository.ChatMemberRepository;
import com.capstone.project.chat.repository.ChatRepository;
import com.capstone.project.chat.repository.ChatRoomRepository;
import com.capstone.project.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class ChatService {
    private final ObjectMapper objectMapper; // JSON 문자열로 변환하기 위한 객체
    private final MemberService memberService;
    private Map<String, ChatRoomResDto> chatRooms; // 채팅방 정보를 담을 맵
//    private final Map<Long, WebSocketSession> sessionMap = new ConcurrentHashMap<>();
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MemberRepository memberRepository;

    @PostConstruct // 의존성 주입 이후 초기화 수행하는 메소드
/*    private void init() {
        chatRooms = chatRoomRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ChatRoom::getRoomId, this::convertEntityToRoomDto));
    }*/
    public void init() {
        chatRooms = new LinkedHashMap<>();
    }

    // 모든 채팅방 조회
    public List<ChatRoomResDto> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }

    // 채팅방 목록 조회
    public List<ChatRoomResDto> findRoomList() {
        List<ChatRoomResDto> chatRoomResDtoList = new ArrayList<>();
        for (ChatRoom chatRoom : chatRoomRepository.findAllByOrderByRegDateAsc()) {
            ChatRoomResDto chatRoomDto = convertEntityToRoomDto(chatRoom);
            chatRoomResDtoList.add(chatRoomDto);
        }
        return chatRoomResDtoList;
    }

    // 참여중인 채팅방 목록 조회
    public List<ChatRoomResDto> getChatRoomsByMemberId(Integer memberId) {
        // ChatRoom 엔티티 리스트를 가져옴
        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByMemberId(memberId);

        // ChatRoom 엔티티를 ChatRoomResDto로 변환
        return chatRooms.stream()
                .map(this::convertEntityToRoomDto)
                .collect(Collectors.toList());
    }

    public ChatRoomResDto createChatRoom(Integer senderId, Integer receiverId) {
        Member sender = memberRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자 찾을 수 없음"));
        Member receiver = memberRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("받는 사용자 찾을 수 없음"));

        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .or(() -> chatRoomRepository.findBySenderIdAndReceiverId(receiverId, senderId));

        ChatRoom chatRoom = existingRoom.orElseGet(() -> chatRoomRepository.save(new ChatRoom(sender, receiver)));

        return new ChatRoomResDto(chatRoom);
    }

    // 채팅방에 입장한 회원 수 반환
    public int cntOfRoomMember(String roomId) {
        try {
            int memberCnt = chatMemberRepository.cntRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return memberCnt;
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            throw new RuntimeException("채팅방 회원 수 반환 중 오류");
        }
    }

    // 채팅방 id를 기반으로 채팅방 찾기
    public ChatRoomResDto findRoomById(String roomId) {
        if (chatRooms.containsKey(roomId)) {
            return chatRooms.get(roomId);
        }

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방이 존재하지 않습니다."));
//        return convertEntityToRoomDto(chatRoom);
        ChatRoomResDto roomDto = convertEntityToRoomDto(chatRoom);
        chatRooms.put(roomId, roomDto); // 새로운 채팅방을 맵에 저장
        return roomDto;
    }

    // 전체 채팅 내역
    public List<ChatMsgDto> findAllChatting(String roomId) {
        List<Chat> chat = chatRepository.findRecentMsg(roomId);
        List<ChatMsgDto> chatMsgDtos = new ArrayList<>();
        for (Chat chat1 : chat) {
            chatMsgDtos.add(convertEntityToChatDto(chat1));
        }
        return chatMsgDtos;
    }

    // 마지막 채팅 내용
    public ChatMsgDto getLastMsg(String roomId) {
        Chat lastChat = chatRepository.findLastMsg(roomId);

        // 메시지가 없는 경우 기본 값 반환
        if (lastChat == null) {
            return new ChatMsgDto("메시지 없음", null, null, null);
        }

        // Chat 엔티티 데이터를 ChatMsgDto로 변환하여 반환
        return convertEntityToChatDto(lastChat);
    }

/*    // 참여 이후 채팅 내역
    public List<ChatMsgDto> findAllChatting(String roomId, Long memberId) {
        List<Chat> chat = chatRepository.findRecentMsg(roomId, memberId);
        List<ChatMsgDto> chatMsgDtos = new ArrayList<>();
        for (Chat chat1 : chat) {
            chatMsgDtos.add(convertEntityToChatDto(chat1));
        }
        return chatMsgDtos;
    }*/

    // 채팅방 삭제
    public boolean removeRoom(String roomId) {
        ChatRoomResDto room = chatRooms.get(roomId); // 방 정보 가져오기
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(
                        () -> new RuntimeException("해당 채팅방이 존재하지 않습니다.1")
                );

        // 채팅방에 남아있는 회원 수 확인
        int memberCount = cntOfRoomMember(roomId);

        // 채팅방에 회원이 없으면 삭제
        if (memberCount == 0) {
            chatRooms.remove(roomId); // 메모리에서 제거
            chatRoomRepository.delete(chatRoom); // DB에서 제거
            return true;
        }
        return false;
    }

    // 채팅방에 입장한 세션 추가
    public void addSessionAndHandlerEnter(String roomId, WebSocketSession session, ChatMsgDto chatMsg) {
        ChatRoomResDto room = findRoomById(roomId);
        log.error("room 객체 해시코드: {}", System.identityHashCode(room));
        log.error("roomId : {}", roomId);
        if (room != null) {
            log.debug("findRoomById 성공: {}", roomId);

            room.getSessions().add(session);    // 채팅방에 입장한 세션을 추가

            log.info("현재 세션 수 (추가 후): {}", room.getSessions().size());

            log.error("세션 추가 : {}", session.getId());

            log.error("추가된 세션들 : {}", room.getSessions());
            Member member = memberRepository.findByNickName(chatMsg.getSendMember()).orElseThrow(
                    () -> new RuntimeException("해당 멤버 없음")
            );
            ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                    () -> new RuntimeException("해당 채팅방 없음")
            );

            boolean isSender = chatRoom.getSender().equals(member);
            boolean isReceiver = chatRoom.getReceiver().equals(member);

            if (!isSender && !isReceiver) {
                throw new RuntimeException("채팅방의 멤버가 아닙니다.");
            }

            Optional<ChatMember> existingChatMember = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom);
            if (!existingChatMember.isPresent()) {
                ChatMember chatMember = new ChatMember();
                chatMember.setMember(member);
                chatMember.setChatRoom(chatRoom);
                chatMember.setRegDate(LocalDateTime.now());

                chatMemberRepository.save(chatMember);
            } else {
                log.info("이미 참여한 채팅방 멤버입니다.");
            }
        }
    }

    // 채팅방에서 퇴장한 세션 제거
    public void removeSessionAndHandleExit(String roomId, WebSocketSession session, ChatMsgDto chatMsg) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            room.getSessions().remove(session); // 채팅방에서 퇴장한 세션 제거
            log.debug("세션 제거됨 : {}", session);

            Member member = memberRepository.findByNickName(chatMsg.getSendMember()).orElseThrow(
                    () -> new RuntimeException("해당 멤버 없음")
            );
            ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(
                    () -> new RuntimeException("해당 채팅방 없음")
            );

            ChatMember chatMember = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom).orElseThrow(
                    () -> new RuntimeException("해당 멤버가 있는 채팅방 없음")
            );

            if (room.isSessionEmpty()) {
                removeRoom(roomId);
            }

            if (chatMember != null) {
                chatMemberRepository.delete(chatMember);
                log.debug("ChatMember 삭제 : member = {}, chatRoom = {}", member.getNickName(), chatRoom.getRoomId());
                removeRoom(roomId);
            }
        }
    }

    public void sendMsgToAll(String roomId, ChatMsgDto msg) {
        log.error("오늬...?");
        log.error("채팅방 : {}", roomId);
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            for (WebSocketSession session : room.getSessions()) {
                // 해당 세션에 메시지 발송
                sendMsg(session, msg);  // 채팅 메세지를 보내는 메소드
                log.warn("전송 메시지 : {}", msg);
            }
        } else {
            log.warn("해당 방을 찾을 수 없음 : {}", roomId);
        }
    }

    // 웹소켓 세션에 메시지 전송
    public <T> void sendMsg(WebSocketSession session, T msg) {
        try {
            log.error("메시지 전송 성공 : {}", msg);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        } catch (IOException e) {
            log.error("메시지 전송 실패 : {}", e.getMessage());
        }
    }

    // 채팅 메세지 DB 저장
    public void saveMsg(String roomId, Integer id, String nickName, String msg, String profile) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 채팅방이 존재하지 않습니다."));

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 멤버 없음")
        );

        Chat chatMsg = new Chat();
        chatMsg.setChatRoom(chatRoom);
        chatMsg.setMember(member);
        chatMsg.setSendMember(nickName);
        chatMsg.setMsg(msg);
        chatMsg.setProfile(profile);
        chatMsg.setNickName(nickName);
        chatMsg.setRegDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        chatRepository.save(chatMsg);
        log.warn("DB에 채팅 저장");
    }

    // ChatRoom 엔티티 Dto로 변환
    private ChatRoomResDto convertEntityToRoomDto(ChatRoom chatRoom) {
        ChatRoomResDto chatRoomResDto = new ChatRoomResDto();
        chatRoomResDto.setRoomId(chatRoom.getRoomId());
//        chatRoomResDto.setName(chatRoom.getRoomName());
        chatRoomResDto.setSenderId(chatRoom.getSender().getMemberId());
        chatRoomResDto.setReceiverId(chatRoom.getReceiver().getMemberId());
        chatRoomResDto.setRegDate(chatRoom.getRegDate());
        chatRoomResDto.setRoomType(chatRoom.getRoomType());
        chatRoomResDto.setPersonCnt(chatRoom.getPersonCnt());
        return chatRoomResDto;
    }

    // Chat 엔티티 Dto로 변환
    private ChatMsgDto convertEntityToChatDto(Chat chat) {
        ChatMsgDto chatMsgDto = new ChatMsgDto();
        chatMsgDto.setId(chat.getChatId());
        chatMsgDto.setRoomId(chat.getChatRoom().getRoomId());
        chatMsgDto.setMemberId(chat.getMember().getMemberId());
        chatMsgDto.setProfile(chat.getProfile());
        chatMsgDto.setNickName(chat.getNickName());
        chatMsgDto.setSendMember(chat.getNickName());
        chatMsgDto.setMsg(chat.getMsg());
        chatMsgDto.setRegDate(chat.getRegDate());

        return chatMsgDto;
    }
}