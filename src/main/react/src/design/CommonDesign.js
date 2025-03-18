import styled from "styled-components";

export const Container = styled.div`
    position: fixed;
    top: 80px;
    left: 80px;
    width: calc(100dvw - 80px);
    display: flex;
    height: calc(100dvh - 80px);
    &.center {
        align-items: center;
        justify-content: center;
    }
    &.mypage-container {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 20px;
        padding: 20px;
        min-height: 100vh;
    }
    &.font_color {
        color: #000;
    }
`