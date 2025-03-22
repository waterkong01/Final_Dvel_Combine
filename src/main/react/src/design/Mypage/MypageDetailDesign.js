import styled from "styled-components";

export const MypageContainer = styled.div`
    //background-color: palegoldenrod;
    overflow: scroll;
    height: 100%;
    padding: 3em;
    display: flex;
    flex-direction: column;
    gap: 3em;
    width: 70%;
`

export const HalfContainer = styled.div`
    background: #FAFAF8;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    padding: 3em;
`

export const UserInfoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 3em;
    position: relative;
`

export const ProfileImg = styled.img`
    width: 100px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    border: 1px solid #000;
`

export const BioBox = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px; /* 항목들 간의 간격을 넓힘 */
    position: relative;
    max-width: 900px; /* 좌우 폭을 좀 더 넓게 설정 */
    width: 100%;
`

export const SkillBox = styled.div`
    margin-top: 30px;
    padding: 20px;
    font-size: 20px;
`