import React from "react";
import { KAKAO_AUTH_URL } from "../utils/KakaoAuthConfig";
import OAuth2Button from "../styles/OAuth2Button";

const KakaoLoginButton = () => {
  return (
    <OAuth2Button
      href={KAKAO_AUTH_URL}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: "75px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Flogin%2F%E1%84%8F%E1%85%A1%E1%84%8F%E1%85%A1%E1%84%8B%E1%85%A9%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png?alt=media"
          alt="Kakao Login"
          style={{ height: "75px" }}
        />
      </div>
    </OAuth2Button>
  );
};

export default KakaoLoginButton;
