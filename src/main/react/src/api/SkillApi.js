import axios from "axios";

// const PROFILE_API_URL = "http://localhost:8111/api/mypage";
const KH_DOMAIN = "";

// 프로필 관련 API(기술)
const SkillApi = {
  // 기술 추가
  createSkill: async (mypageId, skill) => {
    try {
      const response = await axios.post(KH_DOMAIN + `/skill/${mypageId}`, skill);
      return response.data;
    } catch (error) {
      console.error("Error creating skill", error);
      throw error;
    }
  },
  // 기술 조회
  getSkillByMypageId: async (mypageId) => {
    try {
      const response = await axios.get(KH_DOMAIN + `/skill/${mypageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching skills", error);
      throw error;
    }
  },

  // 기술 수정
  updateSkill: async (mypageId, skillId, skill) => {
    try {
      const response = await axios.put(KH_DOMAIN + `/skill/${mypageId}/${skillId}`, skill);
      return response.data;
    } catch (error) {
      console.error("Error updating skill", error);
      throw error;
    }
  },

  // 기술 삭제
  deleteSkill: async (mypageId, skillId) => {
    try {
      await axios.delete(KH_DOMAIN + `/skill/${mypageId}/${skillId}`);
    } catch (error) {
      console.error("Error deleting skill", error);
      throw error;
    }
  },
};

export default SkillApi;