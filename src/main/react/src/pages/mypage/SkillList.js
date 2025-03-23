import React, { useState, useEffect } from "react";
import "../../design/Mypage/SkillList.css";
import SkillApi from "../../api/SkillApi";
import {AddSkillBox, SkillBox, SkillHeader, SkillIcon, SkillListContainer} from "../../design/Mypage/SkillListDesign";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";
import {EduHeader} from "../../design/Mypage/EducationListDesign";
import {toast} from "react-toastify";
import Common from "../../utils/Common"; // 스타일 적용

const SkillList = ({ mypageId }) => {
  const [skills, setSkills] = useState([]); // 기술 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [newSkill, setNewSkill] = useState(""); // 새로운 기술 입력 상태
  const [isAddingSkill, setIsAddingSkill] = useState(false); // 기술 추가 폼 보이기/숨기기 상태
  const [isEditing, setIsEditing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const SKILL_ICON_URL = [
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fclose%201.png?alt=media&",  // close
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fplus1_before%201.png?alt=media&", // add
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
  ]

  // 기술 목록 가져오는 함수
  const fetchSkills = async () => {
    try {
      const data = await SkillApi.getSkillByMypageId(mypageId); // 프로필 ID로 기술 목록 가져오기
      setSkills(data);
      console.log("mypageId:", typeof mypageId);
    } catch (error) {
      console.error("기술 목록을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const response = await Common.getTokenByMemberId();
        const memberId = response.data;
        setLoggedInUser(memberId);
        console.log("로그인한 memberId:", typeof memberId);
      } catch (e) {
        console.error("로그인한 사용자 정보를 가져오는 중 오류 발생:", e);
      }
    };
    fetchUserInfo();
    fetchSkills();
  }, [mypageId]);

  // 새로운 기술 추가
  const addSkill = async () => {
    if (!newSkill) return;
    try {
      const skill = { skillName: newSkill };
      const addedSkill = await SkillApi.createSkill(mypageId, skill);
      setSkills([...skills, addedSkill]);
      setNewSkill("");
      setIsAddingSkill(false);
    } catch (error) {
      console.error("스킬 추가 중 오류 발생:", error);
    }
  };

  const deleteSkill = async (skillId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    console.log("삭제할 skill의 mypageId:", mypageId, "삭제할 skillId:", skillId);

    try {
      await SkillApi.deleteSkill(mypageId, skillId);
      setSkills(skills.filter((skill) => skill.id !== skillId));
      toast.success("스킬이 삭제되었습니다.");
    } catch (error) {
      console.error("스킬 삭제 중 오류 발생:", error);
      toast.error("스킬 삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return <div className="loading">기술 목록 로딩 중...</div>; // 로딩 중 표시
  }

  const isOwner = loggedInUser === Number(mypageId);

  return (
    <SkillListContainer>
      <EduHeader>
        <h3>SKILL</h3>
        {isOwner && (
            <ChattingIcon src={SKILL_ICON_URL[2]} onClick={() => setIsEditing(!isEditing)}/>
        )}
      </EduHeader>

      {/* 기술 추가 입력란 */}
      {isOwner && isAddingSkill && (
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
            {isOwner && isEditing && (
                <img
                    src={SKILL_ICON_URL[0]}
                    alt="delete"
                    onClick={() => deleteSkill(skill.skillId)}
                />
            )}
          </SkillIcon>
        ))}
      </SkillBox>
    </SkillListContainer>
  );
};

export default SkillList;
