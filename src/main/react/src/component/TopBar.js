import styled from "styled-components";
import React, {useContext, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {setLoginModalOpen, setModalOpen, setSignupModalOpen} from "../api/context/ModalReducer";
import {useNavigate} from "react-router-dom";
import BeforeLoginModal from "../pages/auth/BeforeLoginModal";
import AfterLoginModal from "../pages/auth/AfterLoginModal";
import { AuthContext } from "../api/context/AuthContext";

const TopBarContainer = styled.div`
    width: 100%;
    //max-width: 1920px;
    height: 80px;
    padding: 0 1vw;
    background: ${({ darkMode }) => (darkMode ? "#000" : "#F0F0F0")};
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
`

const LogoImg = styled.img`
    width: 65px;
    aspect-ratio: 1 / 1;
`

const Right = styled.div`
    display: flex;
    align-items: center;
    gap: 3rem;
`

const BgChangeBtn = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
`

export const ToggleImg = styled.img`
    width: 30px;
    aspect-ratio: 1 / 1;
`

const MenuImg = styled.img`
    width: 45px;
`

const TopBar = ({darkMode, setDarkMode}) => {
    const navigate = useNavigate();
    const [activeIcon, setActiveIcon] = useState(null);
    const isModalOpen = useSelector((state) => state.modal.isModalOpen);
    const dispatch = useDispatch();

    const TOPBAR_ICON_URL = [
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fclose%201.png?alt=media",    // close1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fclose%202.png?alt=media",    // close2
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fmenu_dark.png?alt=media",    // menu_dark
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fmenu_light.png?alt=media",   // menu_light
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fmoon.png?alt=media",         // moon_dark
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fmoon_colored_white.png?alt=media",   // moon_light
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fsun_colored.png?alt=media",  // sun_dark
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2Fsun_white.png?alt=media",    // sun_light
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2F글씨%20(검정).png?alt=media",
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Ftopbar%2F%E1%84%80%E1%85%B3%E1%86%AF%E1%84%8A%E1%85%B5%20(%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%90%E1%85%B3%E1%84%80%E1%85%B3%E1%84%85%E1%85%A6%E1%84%8B%E1%85%B5).png?alt=media"
    ]

    // AuthContext에서 로그인 상태 가져오기
    const { isLoggedIn, loggedIn, logout } = useContext(AuthContext);


    const toggleDarkMode = () => {
        if (!darkMode) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    };
    const toggleLightMode = () => {
        if (darkMode) {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    };
    const handleIconClick = (icon) => {
        if (activeIcon === icon) {
            setActiveIcon(null);
        } else {
            setActiveIcon(icon);
        }
    };

    const handleImageClick = () => {
        dispatch(setModalOpen(!isModalOpen)); // 모달 열기
    };

    const closeModal = () => {
        dispatch(setModalOpen(false));
        setActiveIcon(null);
    };

    return (
        <TopBarContainer darkMode={darkMode}>
            <LogoImg
                src={darkMode ? TOPBAR_ICON_URL[9] : TOPBAR_ICON_URL[8]}
                onClick={() => navigate("/")}
            />
            <Right>
                <BgChangeBtn>
                    <ToggleImg
                        src={darkMode ? TOPBAR_ICON_URL[7] : TOPBAR_ICON_URL[6]}
                        onClick={darkMode ? toggleLightMode : null}
                    />
                    <ToggleImg
                        src={darkMode ? TOPBAR_ICON_URL[5] : TOPBAR_ICON_URL[4]}
                        onClick={!darkMode ? toggleDarkMode : null}
                    />
                </BgChangeBtn>
                <MenuImg
                    src={darkMode ? (activeIcon === "menu" ? TOPBAR_ICON_URL[1] : TOPBAR_ICON_URL[3]) : (activeIcon === "menu" ? TOPBAR_ICON_URL[0] : TOPBAR_ICON_URL[2])}
                    onClick={() => {
                        handleIconClick("menu")
                        handleImageClick()
                    }}
                />
{/*                <BeforeLoginModal
                    darkMode={darkMode}
                    isOpen={isModalOpen}
                    closeModal={() => dispatch(setModalOpen(false))}
                />*/}
                {isLoggedIn ? (
                    <AfterLoginModal
                        darkMode={darkMode}
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                    />
                ) : (
                    <BeforeLoginModal
                        darkMode={darkMode}
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                    />
                )}
            </Right>
        </TopBarContainer>
    );
}

export default TopBar;