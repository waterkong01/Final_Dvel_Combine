import React from "react";
import { NAVER_AUTH_URL } from "../utils/NaverAuthConfig";
import OAuth2Button from "../styles/OAuth2Button";

const NaverLoginButton = () => {
  const handleLoginClick = () => {
    const state = Math.random().toString(36).substr(2, 15);
    const url = NAVER_AUTH_URL(state);
    window.location.href = url;
  };

  return (
    <OAuth2Button
      onClick={handleLoginClick}
    >
      <div
        style={{
          height: "75px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Flogin%2F%E1%84%82%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%87%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png?alt=media"
          alt="Naver Login"
          style={{ height: "75px" }}
        />
      </div>
    </OAuth2Button>
  );
};

export default NaverLoginButton;
