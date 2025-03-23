import styled from "styled-components";

export const MypageContainer = styled.div`
    overflow: scroll;
    height: 100%;
    padding: 3em;
    display: flex;
    flex-direction: column;
    gap: 3em;
    width: 70%;
    color: #000;
`

export const HalfContainer = styled.div`
    background: #FAFAF8;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 3em;
    &.bottom {
        padding: 0;
    }
`

export const UserInfoBox = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;
`

export const ProfileImg = styled.img`
    width: 100px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
`

export const HalfBox = styled.div`
    display: flex;
    align-items: center;
    gap: 2em;
    & span {
        font-size: 1.2em;
        font-weight: bold;
    }
`

export const BioBox = styled.div`
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 900px; /* 좌우 폭을 좀 더 넓게 설정 */
    width: 100%;
    align-items: flex-end;
    //font-size: 1.2em;
`

export const BioContent = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1em;
    & textarea {
        padding: 1em;
        border-radius: 12px;
        border: 1px solid #ccc;
        min-height: 150px;
        background: #FAFAF8;
        resize: none;
        transition: border-color 0.3s ease;
    }
    & textarea:focus {outline: none;}
`

export const TabBox = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    border-radius: 10px 10px 0 0;
`

export const Tab = styled.button`
    &.tab {
        flex: 1; /* 각 탭이 동일한 크기로 늘어나도록 설정 */
        padding: 1em 0; /* 상하 패딩만 적용하여 탭 크기를 맞춤 */
        font-size: 1.1rem;
        cursor: pointer;
        border: none;
        background: #DBDBDB;
        text-align: center; /* 텍스트를 가운데 정렬 */
        transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
    }
    &.left {border-radius: 10px 0 0 0;}
    &.right {border-radius: 0 10px 0 0;}
    &.tab.active {
        background-color: #FAFAF8;
        color: #000;
    }
`

export const TabsContent = styled.div`
    padding: 1em 3em;
    border-radius: 0 0 10px 10px; /* 아래쪽 모서리만 둥글게 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`