import axios from "axios";

const KH_DOMAIN = "";

// 프로필 관련 API(프로필)
const MypageApi = {
  // 특정 회원 정보 조회 (이름, 이메일 등)
  getMemberById: async (memberId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(KH_DOMAIN + `/api/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      });
      return response.data; // 회원 정보 반환
    } catch (error) {
      console.error("Error fetching member by ID", error);
      throw error;
    }
  },

  // 프로필 추가
  createProfile: async (profileData) => {
    try {
      const response = await axios.post(KH_DOMAIN + `/api/mypage`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile", error);
      throw error;
    }
  },

  // 프로필 조회
  getAllProfiles: async () => {
    try {
      const response = await axios.get(KH_DOMAIN + `/api/mypage`); // 전체 프로필 목록을 불러오는 API
      return response.data;
    } catch (error) {
      console.error("Error fetching profile list", error);
      throw error;
    }
  },

  // 특정 회원 프로필 조회
  getMypageById: async (mypageId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(KH_DOMAIN + `/api/mypage/${mypageId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile by ID", error);
      throw error;
    }
  },

  // 프로필 수정
  updateProfile: async (mypageId, updatedData) => {
    try {
      const response = await axios.put(KH_DOMAIN + `/api/mypage/${mypageId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile", error);
      throw error;
    }
  },

  // 프로필 삭제
  deleteProfile: async (mypageId) => {
    try {
      const response = await axios.delete(KH_DOMAIN + `/api/mypage/${mypageId}`);
      if (response.status === 204) {
        console.log("게시글 삭제 성공:", mypageId);
        return { message: "게시글 삭제 성공" };
      } else {
        console.error("게시글 삭제 실패: 상태 코드", response.status);
        throw new Error("게시글 삭제 실패");
      }
    } catch (error) {
      console.error("Error deleting post", error);
      throw error;
    }
  },
};

export default MypageApi;
