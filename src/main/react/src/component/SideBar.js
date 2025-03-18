import React, {useContext} from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {ToggleImg} from "./TopBar";
import {ChatContext} from "../api/context/ChatStore";

const SideBarContainer = styled.div`
    width: 80px;
    height: 100%;
    padding: 0 1vw;
    background: ${({ darkMode }) => (darkMode ? "#000" : "#F0F0F0")};
    display: flex;
    gap: 3rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
`

const ToggleImgBig = styled.img`
    width: 40px;
    aspect-ratio: 1 / 1;
`

const SideBar = ({darkMode, setDarkMode}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeIcon, setActiveIcon] = useState(null);
    const { setSelectedPage } = useContext(ChatContext);

    const SIDEBAR_ICON_URL = [
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fhome_before-1.png?alt=media",   // home_before-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fhome_before.png?alt=media",   // home_before
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fhome_after-1.png?alt=media",   // home_after-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fhome_after.png?alt=media",   // home_after

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fsearch.png?alt=media",   // search
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fsearch_white.png?alt=media",   // search_white
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fsearch-1.png?alt=media",   // search-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fsearch_white%201.png?alt=media",   // search_white 1

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fnews.png?alt=media",   // news
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fnews-1.png?alt=media",   // news-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fnews%201.png?alt=media",   // news 1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fnews_white%201.png?alt=media",   // news_white 1

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fadd_thin.png?alt=media",   // add_thin
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fadd_thin_white.png?alt=media",   // add_thin_white
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fplus3%201.png?alt=media",   // plus3 1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fplus3_gray%201.png?alt=media",   // plus3_gray 1

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Flike_before-1.png?alt=media",   // like_before-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Flike_before.png?alt=media",   // like_before
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Flike_after-1.png?alt=media",   // like_after-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Flike_after.png?alt=media",   // like_after

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_before-1.png?alt=media",   // message_before-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_before.png?alt=media",   // message_before
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_after-1.png?alt=media",   // message_after-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_after.png?alt=media",   // message_after

        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fuser_before-1.png?alt=media",   // user_before-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fuser_before.png?alt=media",   // user_before
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fuser_after-1.png?alt=media",   // user_after-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fuser_after.png?alt=media",   // user_after
    ]

    useEffect(() => {
        // 현재 경로를 기준으로 activeIcon 설정
        const pathToIcon = {
            "/home": "home",
            "/search": "search",
            "/news": "news",
            "/add": "add",
            "/alarm": "alarm",
            "/msg": "msg",
            "/user": "user",
        };
        setActiveIcon(pathToIcon[location.pathname]);
    }, [location.pathname]);

    const handleIconClick = (icon, path) => {
        if (activeIcon !== icon) {
            setActiveIcon(icon);
            navigate(path);

            if (icon === "msg") {
                setSelectedPage("defaultPage");
                localStorage.setItem("selectedPage", "defaultPage");
            }
        }
    };

    return (
        <SideBarContainer darkMode={darkMode}>
            <ToggleImg
                src={darkMode ? (activeIcon === "home" ? SIDEBAR_ICON_URL[3] : SIDEBAR_ICON_URL[1]) : (activeIcon === "home" ? SIDEBAR_ICON_URL[2] : SIDEBAR_ICON_URL[0])}
                onClick={() => handleIconClick("home", "/home")}
            />
            <ToggleImg
                src={darkMode ? (activeIcon === "search" ? SIDEBAR_ICON_URL[7] : SIDEBAR_ICON_URL[5]) : (activeIcon === "search" ? SIDEBAR_ICON_URL[6] : SIDEBAR_ICON_URL[4])}
                onClick={() => handleIconClick("search", "/search")}
            />
            <ToggleImg
                src={darkMode ? (activeIcon === "news" ? SIDEBAR_ICON_URL[11] : SIDEBAR_ICON_URL[9]) : (activeIcon === "news" ? SIDEBAR_ICON_URL[10] : SIDEBAR_ICON_URL[8])}
                onClick={() => handleIconClick("news", "/news")}
            />
            <ToggleImgBig
                src={darkMode ? (activeIcon === "add" ? SIDEBAR_ICON_URL[15] : SIDEBAR_ICON_URL[13]) : (activeIcon === "add" ? SIDEBAR_ICON_URL[14] : SIDEBAR_ICON_URL[12])}
                onClick={() => handleIconClick("add", "/add")}
            />
            <ToggleImg
                src={darkMode ? (activeIcon === "alarm" ? SIDEBAR_ICON_URL[19] : SIDEBAR_ICON_URL[17]) : (activeIcon === "alarm" ? SIDEBAR_ICON_URL[18] : SIDEBAR_ICON_URL[16])}
                onClick={() => handleIconClick("alarm", "/alarm")}
            />
            <ToggleImg
                src={darkMode ? (activeIcon === "msg" ? SIDEBAR_ICON_URL[23] : SIDEBAR_ICON_URL[21]) : (activeIcon === "msg" ? SIDEBAR_ICON_URL[22] : SIDEBAR_ICON_URL[20])}
                onClick={() => handleIconClick("msg", "/msg")}
            />
            <ToggleImg
                src={darkMode ? (activeIcon === "user" ? SIDEBAR_ICON_URL[26] : SIDEBAR_ICON_URL[24]) : (activeIcon === "user" ? SIDEBAR_ICON_URL[27] : SIDEBAR_ICON_URL[25])}
                onClick={() => handleIconClick("user", "/user")}
            />
        </SideBarContainer>
    );
}

export default SideBar;