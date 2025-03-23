import React, { useState, useEffect } from "react";
import "../../design/Mypage/SkillList.css";
import SkillApi from "../../api/SkillApi";
import {AddSkillBox, SkillBox, SkillHeader, SkillIcon, SkillListContainer} from "../../design/Mypage/SkillListDesign";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";
import {EduHeader} from "../../design/Mypage/EducationListDesign"; // 스타일 적용

const SkillList = ({ mypageId }) => {
  const [skills, setSkills] = useState([]); // 기술 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [newSkill, setNewSkill] = useState(""); // 새로운 기술 입력 상태
  const [isAddingSkill, setIsAddingSkill] = useState(false); // 기술 추가 폼 보이기/숨기기 상태

  const SKILL_ICON_URL = [
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fclose%201.png?alt=media&",  // close
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fplus1_before%201.png?alt=media&", // add
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
  ]

  // 기술 목록 가져오는 함수
  const fetchSkills = async () => {
    try {
      const data = await SkillApi.getSkillByMypageId(mypageId); // 프로필 ID로 기술 목록 가져오기
      setSkills(data); // 상태 업데이트
    } catch (error) {
      console.error("기술 목록을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 새로운 기술 추가
  const addSkill = async () => {
    if (!newSkill) return; // 기술 이름이 없으면 추가하지 않음
    try {
      const skill = { skillName: newSkill };
      const addedSkill = await SkillApi.createSkill(mypageId, skill);
      setSkills([...skills, addedSkill]); // 추가된 기술을 목록에 추가
      setNewSkill(""); // 입력값 초기화
      setIsAddingSkill(false); // 기술 추가 폼 숨기기
    } catch (error) {
      console.error("기술 추가 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchSkills(); // 컴포넌트 마운트 시 기술 목록 가져오기
  }, [mypageId]);

  if (loading) {
    return <div className="loading">기술 목록 로딩 중...</div>; // 로딩 중 표시
  }

  return (
    <SkillListContainer>
      <EduHeader>
        <h3>SKILL</h3>
        {/* + 버튼 클릭 시 기술 추가 폼 토글 */}
        <ChattingIcon src={SKILL_ICON_URL[2]} onClick={() => setIsAddingSkill(!isAddingSkill)}/>
      </EduHeader>

      {/* 기술 추가 입력란 */}
      {isAddingSkill && (
        <AddSkillBox>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="내 스킬을 입력해 주세요"
          />
          <ChattingIcon src={SKILL_ICON_URL[1]} onClick={addSkill}/>
        </AddSkillBox>
      )}

      <SkillBox>
        {skills.map((skill) => (
          <SkillIcon key={skill.id}>
            {skill.skillName}
          </SkillIcon>
        ))}
      </SkillBox>
    </SkillListContainer>
  );
};

export default SkillList;
