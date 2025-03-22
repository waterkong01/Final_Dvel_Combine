import axios from "axios";

// const PROFILE_API_URL = "http://localhost:8111/api/mypage";
const KH_DOMAIN = "";

// 프로필 관련 API(학력)
const EducationApi = {
  // 학력 추가
  createEducation: async (mypageId, educationData) => {
    try {
      const response = await axios.post(KH_DOMAIN + `/education/${mypageId}`, educationData);
      return response.data;
    } catch (error) {
      console.error("Error adding education", error);
      throw error;
    }
  },

  // 학력 목록 조회
  getEducationByMypageId: async (mypageId) => {
    try {
      const response = await axios.get(KH_DOMAIN + `/education/${mypageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching education", error);
      throw error;
    }
  },

  // 학력 수정
  updateEducation: async (mypageId, educationId, educationData) => {
    try {
      const response = await axios.put(KH_DOMAIN + `/education/${mypageId}/${educationId}`, educationData);
      return response.data;
    } catch (error) {
      console.error("Error updating education", error);
      throw error;
    }
  },

  // 학력 삭제
  deleteEducation: async (mypageId, educationId) => {
    try {
      await axios.delete(KH_DOMAIN + `/education/${mypageId}/${educationId}`);
    } catch (error) {
      console.error("Error deleting education", error);
      throw error;
    }
  },
};

export default EducationApi;
