import axios from "axios";
const KH_DOMAIN = "";
// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const ChattingApi = {

  // 채팅방 생성하기
  chatCreate: async (senderId, receiverId) => {
    const chat = { senderId, receiverId };
    const token = localStorage.getItem("accessToken");

    console.log("채팅방 생성 요청 : ", chat); // 서버로 보낼 데이터를 확인
    try {
      const response = await axios.post(KH_DOMAIN + '/chat/room', chat, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      });
      return response.data;
    } catch (error) {
      console.error("채팅방 생성 오류:", error.response ? error.response.data : error.message);
      throw new Error("채팅방을 생성할 수 없습니다.");
    }
    // return await axios.post(KH_DOMAIN + "/chat/new", chat);
  },

  // 참여중인 채팅방 목록 가져오기
  getMyChatRoom: async (memberId) => {
    const token = localStorage.getItem("accessToken");
    try {
      if (!memberId) {
        console.error("memberId가 undefined입니다.");
        return;
      }
      console.log("memberId 값 확인:", memberId);
      const response = await axios.get(KH_DOMAIN + `/chat/myRooms/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      });
      return response.data;
    } catch (error) {
      console.error("채팅방 조회 오류:", error.response ? error.response.data : error.message);
      throw new Error("채팅방을 찾을 수 없습니다.");
    }
  },

  // 채팅방 정보 가져오기
  chatDetail: async (roomId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(KH_DOMAIN + `/chat/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat room details:", error);
      throw error;
    }
  },

  // 해당 채팅방의 이전 채팅 내역 가져오기
  chatHistory: async (roomId) => {
    const token = localStorage.getItem("accessToken");

    console.log(roomId);
    return await axios.get(KH_DOMAIN + `/chat/message/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
      },
    });
  },

  // 토큰에서 닉네임 가져오기
  getNickName: async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(KH_DOMAIN + `/api/members/nickName`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
    });
    return response.data;
  },

  getNickNameByMemberId: async (id) => {
    const response = await axios.get(KH_DOMAIN + `/api/members/nickName/${id}`);
    console.log(response);
    return response;
  },

  getProfileByMemberId: async (id) => {
    const response = await axios.get(KH_DOMAIN + `/api/members/profileImg/${id}`);
    console.log(response);
    return response;
  },

  // 해당 채팅방의 마지막 채팅 내용 가져오기
  getLastMsgByRoomId: async (roomId) => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(KH_DOMAIN + `/chat/lastMessage/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
      },
    });
    console.log("마지막 채팅 내용 : {}", response.data);
    return response.data;
  },
}

export default ChattingApi;
