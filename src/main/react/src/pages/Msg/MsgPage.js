import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import {
    OverlayContainer,
    OverlayContent,
    BtnBox,
    ChattingRoomBg,
    ChattingTitle,
    ChattingIcon,
    MessagesContainer,
    DateSeparator,
    MessageBox,
    Sender,
    MsgTime,
    Message,
    SentTime,
    MsgInputBox,
    MsgInput, SendButton, ExitMsg, ProfileImg
} from "../../design/Msg/MsgPageDesign";
import { useNavigate, useParams } from "react-router-dom";
import Common from "../../utils/Common";
import { ChatContext } from "../../api/context/ChatStore";
import ChattingApi from "../../api/ChattingApi";

function formatLocalDateTime(localDateTime) {
    if (localDateTime) {
        // JavaScript의 Date 객체로 변환 후 KST로 변환
        const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
        const kstDate = new Date(localDateTime + kstOffset);
        return kstDate.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        return new Date().toLocaleString(); // 만약 null일 경우, 현재 시간 반환
    }
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
};

const MsgPage = ({ setSelectedPage, darkMode }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay 상태 관리
    const [socketConnected, setSocketConnected] = useState(false);  // 웹소켓 연결 여부
    const [inputMsg, setInputMsg] = useState("");   // 입력 메시지
    const [chatList, setChatList] = useState([]);   // 채팅 글 목록
    const [sendMember, setSendMember] = useState("");   // 보낸사람
    const [roomName, setRoomName] = useState("");   // 채팅방 이름(상대방 닉네임)
    const {roomId, roomNames, setRoomNames, roomImgs, setRoomImgs} = useContext(ChatContext);   // 채팅방 번호, 새로운 방 개설, 기존 방 입장
    const [roomImg, setRoomImg] = useState("");
    const [nickName, setNickName] = useState("");
    const [profile, setProfile] = useState("");
    const [regDate, setRegDate] = useState("");
    const ws = useRef(null);    // 웹소켓 객체 생성, 소켓 연결 정보를 유지해야하지만 렌더링과는 무관
    const [memberId, setMemberId] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const MSG_ICON_URL = [
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fchat%2Fclose%201.png?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fchat%2Fclose%202.png?alt=media",
    ]


    useEffect(() => {
        // 현재 로그인한 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await Common.getTokenByMemberId();
                const memberId = response.data; // 서버에서 반환한 memberId
                console.log("Chatting, 로그인 한 memberId:", memberId);
                setLoggedInUser(memberId);
                setMemberId(memberId);

                if (!memberId) {
                    console.error("로그인한 사용자 ID를 가져올 수 없습니다.");
                    return;
                }

                // 채팅방 정보 가져오기
                const getChatRoom = async () => {
                    try {
                        const rsp = await ChattingApi.chatDetail(roomId);

                        if (rsp) {
                            console.log("채팅방 정보: ", rsp);

                            if (!rsp.senderId || !rsp.receiverId) {
                                console.error("senderId 또는 receiverId가 null입니다.");
                            }

                            // 현재 로그인한 사용자가 sender인지 receiver인지 확인
                            if (rsp.senderId === memberId) {
                                console.log("로그인한 사용자는 sender입니다.");
                            } else {
                                console.log("로그인한 사용자는 receiver입니다.");
                            }

                            // sender와 receiver 중 로그인한 사용자가 아닌 memberId를 roomName으로 설정
                            const chatPartnerId = rsp.senderId === memberId ? rsp.receiverId : rsp.senderId;
                            console.log("상대방의 memberId:", chatPartnerId);

                            // 상대방의 닉네임 가져오기
                            try {
                                const nickNameRes = await ChattingApi.getNickNameByMemberId(chatPartnerId);
                                const partnerNickName = nickNameRes.data;
                                console.log("상대방의 nickName:", nickNameRes);
                                setRoomName(partnerNickName);
                                setRoomNames(prev => ({ ...prev, [roomId]: partnerNickName}));
                            } catch (error) {
                                console.error("상대방 닉네임 가져오는 중 오류:", error);
                            }

                            // 상대방의 프로필 가져오기
                            try {
                                const profileRes = await ChattingApi.getProfileByMemberId(chatPartnerId);
                                const partnerProfile = profileRes.data;
                                console.log("상대방의 profile:", profileRes);
                                setRoomImg(partnerProfile);
                                setRoomImgs(prev => ({ ...prev, [roomId]: partnerProfile}));
                            } catch (error) {
                                console.error("상대방 프로필이미지 가져오는 중 오류:", error);
                            }
                        } else {
                            console.warn("Invalid data format: ", rsp);
                            alert("채팅방 정보를 불러올 수 없습니다. 이전 페이지로 이동합니다.");
                        }
                    } catch (error) {
                        console.error("Error fetching chat details:", error);
                        alert("채팅방 정보를 불러오지 못했습니다.");
                    }
                };

                if (roomId) getChatRoom();

                const token = localStorage.getItem("accessToken");  // 로컬 스토리지에서 가져오기
                if (!token) {
                    console.error("토큰이 없습니다.");
                    return;
                }
                try {
                    const response = await ChattingApi.getNickName();   // 토큰에서 닉네임 가져오기
                    // console.log("API 응답: ", response);

                    const nickName = await response;  // API 응답 자체가 문자열이라면 이렇게 가져오기
                    if (!nickName) {
                        console.error("닉네임을 찾을 수 없습니다.");
                        return;
                    }
                    setSendMember(nickName); // sender에 닉네임 저장 후 웹소켓으로 보내기 전에 준비
                    console.log("닉네임 : ", nickName);
                } catch (error) {
                    console.error("Error fetching nickName: ", error);
                }

                if (roomId) {
                    console.log("roomId : ", roomId);
                    getChatRoom();
                } else {
                    console.warn("Invalid roomId : ", roomId);
                }
            } catch (error) {
                console.error("로그인한 사용자 정보를 가져오는 중 오류 발생: ", error);
            }
        };
        fetchUserInfo();
    }, [memberId, roomId]);

    // 이전 채팅 내용을 가져오는 함수
    const loadPreviousChat = async () => {
        try {
            const res = await ChattingApi.chatHistory(roomId);
            console.log("이전채팅내용 : ", res.data);

            // regDate만 추출
            const regDates = res.data.map(chat => chat.regDate);
            console.log("이전 채팅 전송 시간들 : ", regDates);
            const recentMessages = res.data;
            setChatList(recentMessages);
        } catch (error) {
            alert("Chatting_300 error : 이전 대화내용을 불러오지 못했습니다.");
        }
    };

    // UTC -> KST 변환
    const getKSTDate = () => {
        const date = new Date();
        // UTC 시간에 9시간 추가
        const offset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
        return new Date(date.getTime() + offset);
    };

    const onChangeMsg = e => {
        setInputMsg(e.target.value);
    };

    const onEnterKey = (e) => {
        // 엔터키 입력 시, 공백 제거 후 비어있지 않으면
        if (e.key === "Enter" && inputMsg.trim() !== "") {
            e.preventDefault(); // 기존 이벤트 무시
            onClickMsgSend(e);
        }
    };

    // 뒤로 가기(채팅 목록으로)
    const onClickExit = () => {
        setSelectedPage("defaultPage");   // 채팅 목록으로 이동
        localStorage.setItem("selectedPage", "defaultPage");  // 로컬스토리지에 저장
    };

    // 채팅 종료
    const onClickMsgClose = () => {
        // 메시지 전송
        ws.current.send(
            JSON.stringify({
                type: "CLOSE",
                roomId: roomId,
                memberId: memberId,
                sendMember: sendMember,
                message: inputMsg,
            })
        );
        ws.current.close();
        setSelectedPage("chatList");   // 채팅 목록으로 이동
    };

    useEffect(() => {
        if (memberId === null) return;
        // 웹소켓 연결하는 부분, 이전 대화내용 불러오는 함수 호출
        if (!ws.current) {
            ws.current = new WebSocket(Common.KH_SOCKET_URL);
            ws.current.onopen = async () => {
                setSocketConnected(true);
                console.log("소켓 연결 상태: ", ws.current);
                await loadPreviousChat();
                // 채팅방 입장하기 전에 sender에 nickName을 설정
                if (sendMember === "") {  // sender가 비어있을 경우에만 nickName을 가져와서 설정
                    const fetchNickName = async () => {
                        const token = localStorage.getItem("accessToken");  // 로컬 스토리지에서 가져오기
                        if (!token) {
                            console.error("토큰이 없습니다.");
                            return;
                        }
                        try {
                            const response = await ChattingApi.getNickName();   // 토큰에서 닉네임 가져오기
                            const nickName = await response.data;
                            setSendMember(nickName); // sender에 닉네임 저장 후 웹소켓으로 보내기 전에 준비
                        } catch (error) {
                            console.error("Error fetching nickName: ", error);
                        }
                    };
                    fetchNickName();
                }
            };
        }
        if (socketConnected) {
            // 웹소켓 연결이 되어있다면,
            ws.current.send(
                JSON.stringify({
                    type: "ENTER",
                    roomId: roomId,
                    memberId: memberId,
                    sendMember: sendMember,
                    profile: profile,
                    nickName: nickName,
                    msg: "첫 입장",
                })
            );
            loadPreviousChat();
        }
        ws.current.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (!data.regDate) {
                data.regDate = new Date().toLocaleString();  // 메시지가 전송된 현재 시간으로 대체
            }
            console.log("받은 메시지:", msg.data);
            setChatList(prev => Array.isArray(prev) ? [...prev, data] : [data]);
        };
    }, [socketConnected, sendMember, ws.current, roomId]);

    // 메시지 전송
    const onClickMsgSend = async () => {
        if (!socketConnected) {
            alert("채팅 접속 중 잠시 기다려")
            return;
        }
        //웹소켓 연결되어 있을 때 정보 보내기
        if (ws.current && ws.current.readyState === WebSocket.OPEN && socketConnected) {
            if (inputMsg.trim() !== "") {
                /*                ws.current.send(
                                    JSON.stringify({
                                        type: "TALK",
                                        roomId: roomId,
                                        sendMember: sendMember,
                                        msg: inputMsg,
                                        profile: profile,
                                        nickName: nickName,
                                        regDate: getKSTDate(),
                                    })
                                );*/
                const chatData = {
                    type: "TALK",
                    roomId: roomId,
                    memberId: memberId,
                    sendMember: sendMember,
                    msg: inputMsg,
                    profile: profile,
                    nickName: nickName,
                    regDate: getKSTDate(),
                };

                // 전송할 데이터 콘솔 출력
                console.log("전송할 채팅 데이터:", chatData);

                ws.current.send(JSON.stringify(chatData));

                setInputMsg("");
            } else {
                // 빈 값일 경우 아무 동작 없이 종료
                console.log("메시지가 비어있습니다.");
            }
        } else {
            alert("채팅 연결에 실패.");
        }
    };

    const textRef = useRef();
    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = "auto";
        textRef.current.style.height = textRef.current.scrollHeight + "px";
    }, []);

    // 화면 하단으로 자동 스크롤
    const ChatContainerRef = useRef(null);  // DOM 요소 추적
    useEffect(() => {
        if (ChatContainerRef.current) {
            ChatContainerRef.current.scrollTop = ChatContainerRef.current.scrollHeight;
        }
    }, [chatList]);

    const ExitChatRoom = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };
    return (
        <ChattingRoomBg darkMode={darkMode}>
            <ChattingTitle darkMode={darkMode}>
                <div>
                    <ProfileImg className="msg_page" src={roomImg} alt="Profile Img" />
                    {roomName}
                </div>
                <ChattingIcon
                    src={darkMode ? MSG_ICON_URL[1] : MSG_ICON_URL[0]}
                    alt="Back" onClick={onClickExit}
                />
            </ChattingTitle>
            <MessagesContainer ref={ChatContainerRef} darkMode={darkMode}>
                {chatList?.map((chat, index) => {
                    const currentDate = new Date(chat.regDate).toISOString().split("T")[0]; // YYYY-MM-DD 형식
                    const prevDate = index > 0 ? new Date(chatList[index - 1].regDate).toISOString().split("T")[0] : null;
                    const showDate = currentDate !== prevDate; // 이전 메시지와 날짜가 다르면 표시

                    return (
                        <React.Fragment key={index}>
                            {showDate && <DateSeparator darkMode={darkMode}>{formatDate(chat.regDate)}</DateSeparator>}
                            <MessageBox isSender={chat.sendMember === sendMember} darkMode={darkMode}>
                                <Sender isSender={chat.sendMember === sendMember} darkMode={darkMode}>
                                    {chat.sendMember}
                                </Sender>
                                <MsgTime isSender={chat.sendMember === sendMember} darkMode={darkMode}>
                                    <Message isSender={chat.sendMember === sendMember} darkMode={darkMode}>
                                        {chat.msg}
                                    </Message>
                                    <SentTime darkMode={darkMode}>
                                        {chat.regDate ? formatLocalDateTime(chat.regDate) : new Date().toLocaleString()}
                                    </SentTime>
                                </MsgTime>
                            </MessageBox>
                        </React.Fragment>
                    );
                })}
            </MessagesContainer>
            <MsgInputBox>
                <MsgInput
                    type="text"
                    ref={textRef}
                    placeholder="전송할 메시지를 입력하세요"
                    value={inputMsg}
                    onInput={handleResizeHeight}
                    onChange={onChangeMsg}
                    onKeyUp={onEnterKey}
                />
                <SendButton
                    src={"https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Fchaticon%2Fsend_color.png?alt=media"} alt="Send"
                    onClick={onClickMsgSend}
                    disabled={!inputMsg.trim()}
                />
            </MsgInputBox>
            {isOverlayOpen && (
                <OverlayContainer>
                    <OverlayContent>
                        <ExitMsg>정말 채팅방을 나가시겠습니까?</ExitMsg>
                        <BtnBox>
                            <button className="cancel" onClick={closeOverlay}>취소</button>
                            <button className="submit" onClick={onClickMsgClose}>확인</button>
                        </BtnBox>
                    </OverlayContent>
                </OverlayContainer>
            )}
        </ChattingRoomBg>
    );
};

export default MsgPage;