import React, { useState, useEffect } from "react";
import "../../design/Mypage/EducationList.css";
import EducationApi from "../../api/EducationApi";

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
    <div className="education-list">
      {/* 교육 섹션 헤더 */}
      <div className="education-list-header">
        <h3 className="education-title">EDUCATION</h3>
        <button
          className="add-education-btn"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          <span className="add-education-icon">+</span>
        </button>
      </div>

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
            <div key={edu.id} className="education-item">
              <div className="education-header">
                <h3>{edu.schoolName}</h3>
                <p>{edu.degree}</p>
              </div>
              <div className="education-dates">
                <span className="start-date">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            </div>
          ))}
    </div>
  );
};

export default EducationList;
