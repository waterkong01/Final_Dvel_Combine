import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MypageApi from "../../api/MypageApi"; // Link를 사용해 상세보기 링크 만들기

const ProfileList = () => {
  const [mypage, setMypage] = useState([]); // 프로필 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 프로필 목록 가져오는 함수
  const fetchProfiles = async () => {
    try {
      const data = await MypageApi.getAllProfiles(); // 모든 프로필 가져오기
      setMypage(data); // 프로필 목록 상태 업데이트
    } catch (error) {
      console.error("프로필 목록을 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchProfiles(); // 페이지 로드 시 프로필 목록 가져오기
  }, []);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중 표시
  }

  return (
    <div className="mypage-list-container">
      <h1>프로필 목록</h1>

      {/* 프로필 목록이 있을 때 */}
      <div className="mypage-items">
        {mypage.map((mypage) => (
          <div key={mypage.mypageId} className="mypage-item">
            <h2>{mypage.mypageContent}</h2>
            <p>
              {mypage.skillList.length} 스킬, {mypage.careerList.length} 경력
            </p>
            <Link to={`/mypages/${mypage.mypageId}`}>상세보기</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileList;
