import styled from "styled-components";

export const MsgDefaultContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 30px;
    font-size: 1.2em;
`

export const CircleBox = styled.div`
    width: 150px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: ${({ darkMode }) => (darkMode ? "#181818" : "#dbdbdb")};
    display: flex;
    align-items: center;
    justify-content: center;
`

export const CenterIcon = styled.img`
    width: 90px;
    aspect-ratio: 1 / 1;
`