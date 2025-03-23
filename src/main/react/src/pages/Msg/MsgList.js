import React, {useContext, useEffect, useState} from "react";
import Common from "../../utils/Common";
import {ChatContext} from "../../api/context/ChatStore";
import {ChatListBg, ChatListBox, ChatName, ChatRoom, ChatUl} from "../../design/Msg/MsgListDesign";
import ChattingApi from "../../api/ChattingApi";
import {useNavigate} from "react-router-dom";
import {ProfileImg} from "../../design/Msg/MsgPageDesign";
import imgLogo2 from "../../images/DeveloperMark.jpg";
import {getDownloadURL, getStorage, ref} from "firebase/storage";

const MsgList = ({darkMode, setSelectedPage }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const {setRoomId, roomNames, setRoomNames, roomImgs, setRoomImgs, roomMsg, setRoomMsg} = useContext(ChatContext);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const storage = getStorage();
    const [roomImg, setRoomImg] = useState("");

    useEffect(() => {
        // 로컬 스토리지에서 데이터 불러오기 (새로고침 시 유지)
        const savedChatRooms = JSON.parse(localStorage.getItem("chatRooms")) || [];
        const savedRoomImgs = JSON.parse(localStorage.getItem("roomImgs")) || {};

        if (savedChatRooms.length > 0) {
            setChatRooms(savedChatRooms);
            setRoomImgs(savedRoomImgs);
            setLoading(false);
        }

        // 서버에서 최신 데이터 가져오기
        const fetchData = async () => {
            try {
                const response = await Common.getTokenByMemberId();
                const memberId = response.data;
                setLoggedInUser(memberId);

                const rooms = await ChattingApi.getMyChatRoom(memberId);
                if (rooms.length === 0) {
                    setChatRooms([]);
                    setLoading(false);
                    return;
                }

                let tempRoomImgs = {...savedRoomImgs};

                const updatedRooms = await Promise.all(rooms.map(async (room) => {
                    const chatPartnerId = room.senderId === memberId ? room.receiverId : room.senderId;

                    const [nickNameRes, profileRes, msgRes] = await Promise.allSettled([
                        ChattingApi.getNickNameByMemberId(chatPartnerId),
                        ChattingApi.getProfileByMemberId(chatPartnerId),
                        ChattingApi.getLastMsgByRoomId(room.roomId)
                    ]);

                    const roomId = room.roomId;
                    const name = nickNameRes.status === "fulfilled" ? nickNameRes.value.data : "알 수 없음";
                    let img = profileRes.status === "fulfilled" ? profileRes.value.data : "";

                    try {
                        const storageRef = ref(storage, `profile_images/${chatPartnerId}`);
                        const url = await getDownloadURL(storageRef);
                        tempRoomImgs[roomId] = url;  // 객체에 저장
                    } catch (error) {
                        console.error("프로필 이미지 로드 실패:", error);
                        tempRoomImgs[roomId] = imgLogo2; // 기본 이미지 사용
                    }

                    return {
                        ...room,
                        name,
                        lastMsg: msgRes.status === "fulfilled" && msgRes.value ? msgRes.value.msg?.trim() || "메시지 없음" : "메시지 없음"
                    };
                }));
                setRoomImgs(tempRoomImgs);  // roomImgs 상태 한 번에 업데이트
                setChatRooms(updatedRooms);

                localStorage.setItem("roomImgs", JSON.stringify(tempRoomImgs));
                localStorage.setItem("chatRooms", JSON.stringify(updatedRooms));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching chat rooms or member ID:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                        {chatRooms.length === 0 ? (
                            <p>참여 중인 채팅방이 없습니다.</p>
                        ) : (
                            chatRooms.map((room) => (
                                <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                                    <ProfileImg src={roomImgs[room.roomId] || imgLogo2} alt="Profile Img" />
                                    <div className="info">
                                        <ChatName className="room_name">{room.name || "로딩 중..."}</ChatName>
                                        <ChatName className="last_msg">{room.lastMsg || "메시지 없음"}</ChatName>
                                    </div>
                                </ChatRoom>
                            ))
                        )}
                    </ChatUl>
                )}
            </ChatListBox>
        </ChatListBg>
    );
};
export default MsgList;