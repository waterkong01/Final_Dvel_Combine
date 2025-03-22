import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EducationList from "./EducationList";
import CareerList from "./CareerList";
import SkillList from "./SkillList";
import { FaLink } from "react-icons/fa"; // URL 복사 아이콘 추가
import "../../design/Mypage/MypageDetail.css";
import MypageApi from "../../api/MypageApi";
import {Container} from "../../design/CommonDesign";
import {
  BioBox,
  HalfContainer,
  MypageContainer, ProfileImg, SkillBox,
  UserInfoBox
} from "../../design/Mypage/MypageDetailDesign";

const MypageDetail = () => {
  const { mypageId } = useParams();
  const [mypage, setMypage] = useState(null);
  const [member, setMember] = useState(null); // 회원 정보 상태 추가
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("education");
  const [isEditing, setIsEditing] = useState(false);
  const [editedMypageContent, setEditedMypageContent] = useState("");
  const navigate = useNavigate();

  const fetchMypageDetail = async () => {
    try {
      const data = await MypageApi.getMypageById(mypageId);
      setMypage(data);
      setEditedMypageContent(data.mypageContent);
    } catch (error) {
      console.error("프로필을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberInfo = async () => {
    try {
      const data = await MypageApi.getMemberById(mypageId); // 회원 정보 가져오기
      setMember(data);
    } catch (error) {
      console.error("회원 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchMypageDetail();
    fetchMemberInfo(); // 회원 정보도 함께 가져옴
  }, [mypageId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = () => {
    setIsEditing((prevState) => !prevState); // isEditing 상태를 토글
  };

  const handleSave = async () => {
    try {
      await MypageApi.updateProfile(mypageId, {
        mypageContent: editedMypageContent,
      });
      setMypage((prevMypage) => ({
        ...prevMypage,
        mypageContent: editedMypageContent,
      }));
      setIsEditing(false); // 저장 후 편집 모드 종료
    } catch (error) {
      console.error("프로필 수정 중 오류 발생:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // 취소 후 편집 모드 종료
    setEditedMypageContent(mypage.mypageContent); // 원래 상태로 돌아가기
  };

  const copyProfileUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("프로필 URL이 복사되었습니다!");
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!mypage || !member) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

  return (
    <Container className="center">
      <MypageContainer>
        {/* 프로필 상단 정보 (사진, 이름, 이메일, URL 복사) */}
        <HalfContainer>
          <UserInfoBox>
            <ProfileImg
                src={mypage.profileImage || "/default-profile.png"} // 기본 프로필 이미지 설정
                alt="Profile"
            />
            <div className="profile-right">
              <div className="profile-info">
                <h2>{member.name || "사용자 이름"}</h2> {/* 이름 렌더링 */}
                <p>{member.email || "이메일 미제공"}</p> {/* 이메일 렌더링 */}
                {/* 팔로워 / 팔로잉 정보 */}
                <div className="follow-info">
                  <span>팔로워 {mypage.followers || "NN"}</span>
                  <span>팔로잉 {mypage.following || "NN"}</span>
                </div>
              </div>
              {/* URL 복사 버튼 */}
              <button className="copy-url-btn" onClick={copyProfileUrl}>
                <FaLink />
              </button>
            </div>
          </UserInfoBox>

          {/* 프로필 내용 및 수정 버튼 컨테이너 */}
          <BioBox>
            {/* 수정 버튼 */}
            <div className="edit-buttons">
              <button className="edit-btn" onClick={handleEdit}>
                +
              </button>
            </div>

            {/* 프로필 내용 */}
            <div className="profile-content">
              {isEditing ? (
                  <textarea
                      value={editedMypageContent}
                      onChange={(e) => setEditedMypageContent(e.target.value)}
                      rows="4"
                      style={{ width: "100%" }}
                  />
              ) : (
                  <p>{mypage.mypageContent}</p> // 기본 출력
              )}
            </div>

            {/* 편집 모드일 때만 저장/취소 버튼 표시 */}
            {isEditing && (
                <div className="edit-buttons">
                  <button className="save-btn" onClick={handleSave}>
                    저장
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    취소
                  </button>
                </div>
            )}
          </BioBox>

          {/* Skill List */}
          <SkillBox>
            <SkillList mypageId={mypageId} />
          </SkillBox>
        </HalfContainer>
        <HalfContainer>
          {/* 탭 메뉴 */}
          <div className="tabs-container">
            <button
                className={`tab ${activeTab === "education" ? "active" : ""}`}
                onClick={() => handleTabChange("education")}
            >
              학력
            </button>
            <button
                className={`tab ${activeTab === "career" ? "active" : ""}`}
                onClick={() => handleTabChange("career")}
            >
              경력
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="tabs-content">
            {activeTab === "education" && <EducationList mypageId={mypageId} />}
            {activeTab === "career" && <CareerList mypageId={mypageId} />}
          </div>
        </HalfContainer>
      </MypageContainer>
    </Container>
  );
};

export default MypageDetail;
