// GoogleLoginButton.js
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import OAuth2Button from "../styles/OAuth2Button";

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <GoogleOAuthProvider clientId="711497532760-gt04q7avm9nqsr0ocmjrbnap2vnk8r4i.apps.googleusercontent.com">
            <div style={{ position: "relative", display: "inline-block" }}>
                {/* 커스텀 버튼 */}
                <button
                    onClick={() => document.getElementById("googleLoginBtn").click()}
                    style={{
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Flogin%2F%E1%84%80%E1%85%AE%E1%84%80%E1%85%B3%E1%86%AF%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9.png?alt=media"
                        alt="Google Logo"
                        style={{ width: "75px" }}
                    />
                </button>

                {/* 숨겨진 Google Login 버튼 */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "75px", height: "75px", opacity: 0 }}>
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        useOneTap
                        render={(renderProps) => (
                            <button
                                id="googleLoginBtn"
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            />
                        )}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
