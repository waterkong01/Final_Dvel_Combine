import React, { useState, useEffect } from "react";
import "../../design/Mypage/EducationList.css";
import EducationApi from "../../api/EducationApi";
import {EduContainer, EduDate, EduHeader, EduInfo, EduItem} from "../../design/Mypage/EducationListDesign";
import {ChattingIcon} from "../../design/Msg/MsgPageDesign";

const EducationList = ({ mypageId }) => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEducation, setNewEducation] = useState({
    schoolName: "",
    degree: "",
    startDate: "",
    endDate: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // 교육 추가 폼 보이기/숨기기 상태

  const EDU_ICON_URL = [
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fclose%201.png?alt=media&",  // close
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fplus1_before%201.png?alt=media&", // add
    "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fprofile%2Fedit-text%201.png?alt=media&",  // edit
  ]

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await EducationApi.getEducationByMypageId(
          mypageId
        );
        setEducation(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (mypageId) {
      fetchEducation();
    }
  }, [mypageId]);

  const handleAddEducation = async () => {
    try {
      const newEducationData = await EducationApi.createEducation(
        mypageId,
        newEducation
      );
      setEducation([...education, newEducationData]);
      setNewEducation({
        schoolName: "",
        degree: "",
        startDate: "",
        endDate: "",
      }); // 초기화
      setIsFormVisible(false); // 폼 숨기기
    } catch (error) {
      console.error("교육 추가 오류", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prevEducation) => ({
      ...prevEducation,
      [name]: value,
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching education</div>;

  return (
    <EduContainer>
      {/* 교육 섹션 헤더 */}
      <EduHeader>
        <h3>EDUCATION</h3>
        <ChattingIcon src={EDU_ICON_URL[1]} onClick={() => setIsFormVisible(!isFormVisible)}/>
      </EduHeader>

      {/* 교육 추가 폼 */}
      {isFormVisible && (
        <div className="add-education-form">
          <h4>교육 추가</h4>
          <input
            type="text"
            name="schoolName"
            value={newEducation.schoolName}
            onChange={handleInputChange}
            placeholder="학교명"
          />
          <input
            type="text"
            name="degree"
            value={newEducation.degree}
            onChange={handleInputChange}
            placeholder="학위명"
          />
          <input
            type="date"
            name="startDate"
            value={newEducation.startDate}
            onChange={handleInputChange}
            placeholder="시작일"
          />
          <input
            type="date"
            name="endDate"
            value={newEducation.endDate}
            onChange={handleInputChange}
            placeholder="종료일"
          />
          <button onClick={handleAddEducation}>교육 추가</button>
        </div>
      )}

      {/* 교육 목록 */}
      {education.length === 0
        ? ""
        : education.map((edu) => (
            <EduItem key={edu.id}>
              <EduInfo>
                <span>{edu.schoolName}</span>
                <span>-</span>
                <span>{edu.degree}</span>
              </EduInfo>
              <EduDate>
                <span>
                  {edu.startDate} - {edu.endDate}
                </span>
              </EduDate>
            </EduItem>
          ))}
    </EduContainer>
  );
};

export default EducationList;
