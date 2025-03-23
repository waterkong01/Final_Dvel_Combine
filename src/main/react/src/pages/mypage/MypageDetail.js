import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import EducationList from "./EducationList";
import CareerList from "./CareerList";
import SkillList from "./SkillList";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../design/Mypage/MypageDetail.css";
import MypageApi from "../../api/MypageApi";
import {Container} from "../../design/CommonDesign";
import {
  BioBox, BioContent, HalfBox,
  HalfContainer, IconBox,
  MypageContainer, ProfileImg, SkillBox, Tab, TabBox, TabsContent,
  UserInfoBox
} from "../../design/Mypage/MypageDetailDesign";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";
import imgLogo2 from "../../images/DeveloperMark.jpg";
import {SkillHeader} from "../../design/Mypage/SkillListDesign";
import {EduHeader} from "../../design/Mypage/EducationListDesign";
import FeedList from "./FeedList";

const MypageDetail = () => {
  const { mypageId } = useParams();
  const [mypage, setMypage] = useState(null);
  const [member, setMember] = useState(null); // 회원 정보 상태 추가
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("eduandcareer");
  const [isEditing, setIsEditing] = useState(false);
  const [editedMypageContent, setEditedMypageContent] = useState("");
  const [profileImg, setProfileImg] = useState(imgLogo2);
  const storage = getStorage();

  const USERINFO_ICON_URL = [
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fplus1_before%201.png?alt=media&", // add
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fsettings.png?alt=media&", // setting
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fshare%202.png?alt=media&" // share
  ]

  // Mypage 정보 가져오기
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

  // Member 정보 가져오기
  const fetchMemberInfo = async () => {
    try {
      const data = await MypageApi.getMemberById(mypageId); // 회원 정보 가져오기
      setMember(data);
    } catch (error) {
      console.error("회원 정보를 가져오는 중 오류 발생:", error);
    }
  };

  // 프로필 이미지 가져오기
  const fetchProfileImage = async (memberId) => {
    if (!memberId) return;
    try {
      const storageRef = ref(storage, `profile_images/${memberId}`);
      const url = await getDownloadURL(storageRef);
      setProfileImg(url);
    } catch (error) {
      console.error("프로필 이미지 로드 실패:", error);
      setProfileImg(imgLogo2); // 실패 시 기본 이미지 사용
    }
  };

  useEffect(() => {
    fetchMypageDetail();
    fetchMemberInfo(); // 회원 정보도 함께 가져옴
  }, [mypageId]);

  useEffect(() => {
    if (member?.memberId) {
      fetchProfileImage(member.memberId);
    }
  }, [member]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!mypage || !member) {
    return <div className="loading">프로필을 찾을 수 없습니다.</div>;
  }

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
            <HalfBox>
              <ProfileImg src={profileImg} alt="Profile"/>
              <span>{member.nickName || "사용자 이름"}</span>
            </HalfBox>
            <HalfBox>
              <ChattingIcon src={USERINFO_ICON_URL[3]} onClick={copyProfileUrl}/>
              <ChattingIcon src={USERINFO_ICON_URL[2]}/>
            </HalfBox>
          </UserInfoBox>

          {/* 프로필 내용 및 수정 버튼 컨테이너 */}
          <BioBox>
            <EduHeader>
              <h3>SELF-INTRODUCTION</h3>
              {/* + 버튼 클릭 시 기술 추가 폼 토글 */}
              <ChattingIcon src={USERINFO_ICON_URL[0]} onClick={handleEdit}/>
            </EduHeader>
            {/* 프로필 내용 */}
            <BioContent>
              {isEditing ? (
                  <textarea
                      value={editedMypageContent}
                      onChange={(e) => setEditedMypageContent(e.target.value)}
                      rows="4"
                      style={{ width: "100%" }}
                  />
              ) : (
                  <span>{mypage.mypageContent}</span> // 기본 출력
              )}
            </BioContent>

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
          <SkillList mypageId={mypageId} />
        </HalfContainer>
        <HalfContainer className="bottom">
          {/* 탭 메뉴 */}
          <TabBox>
            <Tab
                className={`tab left ${activeTab === "eduandcareer" ? "active" : ""}`}
                onClick={() => handleTabChange("eduandcareer")}
            >
              학력 및 경력
            </Tab>
            <Tab
                className={`tab right ${activeTab === "feed" ? "active" : ""}`}
                onClick={() => handleTabChange("feed")}
            >
              게시물
            </Tab>
          </TabBox>

          {/* 탭 콘텐츠 */}
          <TabsContent>
            {activeTab === "eduandcareer" && (
                <>
                  <EducationList mypageId={mypageId} />
                  <CareerList mypageId={mypageId} />
                </>
            )}
            {activeTab === "feed" && <FeedList mypageId={mypageId} />}
          </TabsContent>
        </HalfContainer>
      </MypageContainer>
    </Container>
  );
};

export default MypageDetail;
