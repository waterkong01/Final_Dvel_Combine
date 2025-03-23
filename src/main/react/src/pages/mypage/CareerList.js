import React, { useState, useEffect } from "react";
import "../../design/Mypage/CareerList.css";
import CareerApi from "../../api/CareerApi";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";
import {EduDate, EduHeader, EduInfo, EduItem} from "../../design/Mypage/EducationListDesign";
import Common from "../../utils/Common";

const CareerList = ({ mypageId }) => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [newCareer, setNewCareer] = useState({
    companyName: "",
    jobName: "",
    startDate: "",
    endDate: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // 경력 추가 폼 보이기/숨기기 상태

  const CAREER_ICON_URL = [
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fclose%201.png?alt=media&",  // close
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fplus1_before%201.png?alt=media&", // add
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
  ]

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

    const fetchCareers = async () => {
      try {
        const data = await CareerApi.getCareerByMypageId(mypageId);
        setCareers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
    if (mypageId) {
      fetchCareers();
    }
  }, [mypageId]);

  const handleAddCareer = async () => {
    try {
      const newCareerData = await CareerApi.createCareer(
        mypageId,
        newCareer
      );
      setCareers([...careers, newCareerData]);
      setNewCareer({
        companyName: "",
        jobName: "",
        startDate: "",
        endDate: "",
      }); // 초기화
      setIsFormVisible(false); // 폼 숨기기
    } catch (error) {
      console.error("경력 추가 오류", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCareer((prevCareer) => ({
      ...prevCareer,
      [name]: value,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching careers</div>;

  const isOwner = loggedInUser === Number(mypageId);

  return (
    <div>
      {/* 경력 섹션 헤더 */}
      <EduHeader>
        <h3>CAREER</h3>
        {isOwner && (
            <ChattingIcon src={CAREER_ICON_URL[1]} onClick={() => setIsFormVisible(!isFormVisible)}/>
        )}
      </EduHeader>

      {/* 경력 추가 폼 */}
      {isFormVisible && (
        <div className="add-career-form">
          <h4>경력 추가</h4>
          <input
            type="text"
            name="companyName"
            value={newCareer.companyName}
            onChange={handleInputChange}
            placeholder="회사명"
          />
          <input
            type="text"
            name="jobName"
            value={newCareer.jobName}
            onChange={handleInputChange}
            placeholder="직무명"
          />
          <input
            type="date"
            name="startDate"
            value={newCareer.startDate}
            onChange={handleInputChange}
            placeholder="시작일"
          />
          <input
            type="date"
            name="endDate"
            value={newCareer.endDate}
            onChange={handleInputChange}
            placeholder="종료일"
          />
          <button onClick={handleAddCareer}>경력 추가</button>
        </div>
      )}

      {/* 경력 목록 */}
      {careers.length === 0
        ? ""
        : careers.map((career) => (
            <EduItem key={career.id}>
              <EduInfo>
                <span>{career.companyName}</span>
                <span>-</span>
                <span>{career.jobName}</span>
              </EduInfo>
              <EduDate>
                <span className="start-date">
                  {career.startDate} - {career.endDate}
                </span>
              </EduDate>
            </EduItem>
          ))}
    </div>
  );
};

export default CareerList;
