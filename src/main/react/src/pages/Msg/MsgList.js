import React, {useContext, useEffect, useState} from "react";
import Common from "../../utils/Common";
import {ChatContext} from "../../api/context/ChatStore";
import {ChatListBg, ChatListBox, ChatName, ChatRoom, ChatUl} from "../../design/Msg/MsgListDesign";
import ChattingApi from "../../api/ChattingApi";
import {useNavigate} from "react-router-dom";
import {ProfileImg} from "../../design/Msg/MsgPageDesign";

const MsgList = ({darkMode, setSelectedPage }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const {setRoomId, roomNames, setRoomNames, roomImgs, setRoomImgs, roomMsg, setRoomMsg} = useContext(ChatContext);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 토큰에서 memberId를 가져오는 로직
        const fetchData = async () => {
            try {
                const response = await Common.getTokenByMemberId();
                const memberId = response.data; // 서버에서 반환한 memberId
                console.log("로그인 한 memberId:", memberId);
                setLoggedInUser(memberId);

                const rooms = await ChattingApi.getMyChatRoom(memberId);
                console.log("Fetched Chat Rooms for Member:", rooms);
                setChatRooms(rooms);

                const roomNamesMap = {};
                const roomImgsMap = {};
                const roomMsgMap = {};

                const chatInfoPromises = rooms.map(async (room) => {
                    const chatPartnerId = room.senderId === memberId ? room.receiverId : room.senderId;

                    return Promise.allSettled([
                        ChattingApi.getNickNameByMemberId(chatPartnerId),
                        ChattingApi.getProfileByMemberId(chatPartnerId),
                        ChattingApi.getLastMsgByRoomId(room.roomId)
                    ]).then(([nickNameRes, profileRes, msgRes]) => {
                        roomNamesMap[room.roomId] = (nickNameRes.status === "fulfilled" ? nickNameRes.value.data : "알 수 없음");
                        roomImgsMap[room.roomId] = (profileRes.status === "fulfilled" ? profileRes.value.data : "");

                        if (msgRes.status === "fulfilled" && msgRes.value) {
                            console.log(`Room ID: ${room.roomId} - Last Message:`, msgRes.value);
                            roomMsgMap[room.roomId] = msgRes.value.msg?.trim() || "메시지 없음";
                        } else {
                            console.warn(`Room ID: ${room.roomId} - No message data available.`);
                            roomMsgMap[room.roomId] = "메시지 없음";
                        }
                    });
                });
                await Promise.all(chatInfoPromises);

                setRoomNames((prev) => ({ ...prev, ...roomNamesMap }));
                setRoomImgs((prev) => ({ ...prev, ...roomImgsMap }));
                setRoomMsg((prev) => ({ ...prev, ...roomMsgMap }))

                setLoading(false); // 로딩 종료

            } catch (error) {
                console.error("Error fetching chat rooms or member ID:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []); // 한 번만 실행

    // 채팅방 이동
    const enterChatRoom = (roomId) => {
        console.log("Room ID:", roomId);
        navigate("/msg", {
            state: {selectedPage: "chatting", roomId: roomId}
        });
    };

    return (
        <ChatListBg darkMode={darkMode}>
            <ChatListBox>
                {loading ? (
                    <p>로딩 중...</p>
                ) : (
                    <ChatUl>
                        {chatRooms.map((room) => (
                            <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                                <ProfileImg src={roomImgs[room.roomId]} alt="Profile Img" />
                                <div className="info">
                                    <ChatName className="room_name">{roomNames[room.roomId] || "로딩 중..."}</ChatName>
                                    <ChatName className="last_msg">{roomMsg[room.roomId] || "메시지 없음"}</ChatName>
                                </div>
                            </ChatRoom>
                        ))}
                    </ChatUl>
                )}
            </ChatListBox>
        </ChatListBg>
    );
};
export default MsgList;