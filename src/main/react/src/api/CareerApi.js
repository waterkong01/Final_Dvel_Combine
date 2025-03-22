import axios from "axios";

// const PROFILE_API_URL = "http://localhost:8111/api/mypage";
const KH_DOMAIN = "";

// 프로필 관련 API(경력)
const CareerApi = {
  // 경력 추가
  createCareer: async (mypageId, careerData) => {
    try {
      const response = await axios.post(KH_DOMAIN + `/career/${mypageId}`, careerData);
      return response.data;
    } catch (error) {
      console.error("Error creating career", error);
      throw error;
    }
  },

  // 경력 목록 조회
  getCareerByMypageId: async (mypageId) => {
    try {
      const response = await axios.get(KH_DOMAIN + `/career/${mypageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching career", error);
      throw error;
    }
  },

  // 경력 수정
  updateCareer: async (mypageId, careerId, careerData) => {
    try {
      const response = await axios.put(
        KH_DOMAIN + `/career/${mypageId}/${careerId}`, careerData);
      return response.data;
    } catch (error) {
      console.error("Error updating career", error);
      throw error;
    }
  },

  // 경력 삭제
  deleteCareer: async (mypageId, careerId) => {
    try {
      await axios.delete(KH_DOMAIN + `/career/${mypageId}/${careerId}`);
    } catch (error) {
      console.error("Error deleting career", error);
      throw error;
    }
  },
};

export default CareerApi;
