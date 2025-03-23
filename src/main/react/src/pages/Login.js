// Login.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstanse";
import Common from "../utils/Common";
import { AuthContext } from "../api/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import GoogleLoginButton from "../component/GoogleLoginButton";
import NaverLoginButton from "../component/NaverLoginButton";
import KakaoLoginButton from "../component/KakaoLoginButton";
import styled from "styled-components";
// 🔹 Import useProfile to allow fetching updated profile data after login
import { useProfile } from "./ProfileContext";
import {Container} from "../design/CommonDesign";
import {color} from "chart.js/helpers";
import {LoginContainer, SubmitButton, ThirdLoginBox} from "../design/LoginDesign";
import GithubLoginButton from "../component/GithubLoginButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, loggedIn } = useContext(AuthContext);
  // 🔹 Get fetchProfileData from the profile context
  const { fetchProfileData } = useProfile();

  // 로그인 상태 확인후 자동 리디렉션
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/feed");
    }
  }, [isLoggedIn, navigate]);

  // 일반 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 로그인 요청
      const response = await AxiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      // JWT 디코딩하여 사용자 정보 추출
      const decodedToken = jwtDecode(accessToken);
      console.log("Decoded JWT:", decodedToken); // Debug log

      // 토큰을 localStorage에 저장
      Common.setAccessToken(accessToken);
      Common.setRefreshToken(refreshToken);

      // 디코딩된 사용자 정보를 localStorage에 저장
      const userData = {
        memberId: decodedToken.sub, // JWT의 'sub' 필드에서 memberId 가져오기
        email: decodedToken.email,
        name: decodedToken.name,
      };
      console.log("User data to be stored:", userData); // Debug log
      localStorage.setItem("keduMember", JSON.stringify(userData));

      // 로그인 상태 업데이트
      loggedIn();
      // 🔹 After successful login, refresh the profile data to update the context
      await fetchProfileData();
      navigate("/feed");
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다."); // 에러 메시지 처리
    }
  };

  // Google OAuth 로그인 처리
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const { email, name, sub: providerId } = decodedToken;
      const accessToken = credentialResponse.credential;
      Common.setAccessToken(accessToken);
      try {
        const response = await AxiosInstance.post("/api/auth/google", {
          email,
          name,
          provider: "google",
          providerId,
        });
        const { accessToken, refreshToken } = response.data;
        Common.setAccessToken(accessToken);
        Common.setRefreshToken(refreshToken);
        console.log(jwtDecode(accessToken));
        loggedIn();
        // 🔹 Also refresh the profile data after a successful Google login
        await fetchProfileData();
        navigate("/feed");
      } catch (err) {
        setError("OAuth 로그인 실패");
      }
    }
  };
  const handleGoogleLoginError = (error) => {
    setError("구글 로그인 오류: " + error.message);
  };

  return (
    <Container className="center">
      <LoginContainer>
        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="input_box">
            <label
              htmlFor="email"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="input_box">
            <label
              htmlFor="password"
            >
              PW
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && (
            <div
              style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
            >
              {error}
            </div>
          )}
          <a href="/signup" className="sign">
            회원가입
          </a>
          <SubmitButton type="submit">로그인</SubmitButton>
        </form>

        {/* 제3자 로그인 버튼들 */}
        <ThirdLoginBox>
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
          <NaverLoginButton />
          <KakaoLoginButton />
          <GithubLoginButton />
        </ThirdLoginBox>
      </LoginContainer>
    </Container>
  );
}

export default Login;
