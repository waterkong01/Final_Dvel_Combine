import styled from "styled-components";

export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const OverlayContent = styled.div`
    width: 80%;
    /* height: 50%; */
    background-color: white;
    border-radius: 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    padding: 40px 20px;
`;
export const BtnBox = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    button {
        width: 60px;
        height: 35px;
        border-radius: 10px;
        border: none;
        background-color: #FFF;
    }
    .cancel { border: 2px solid #E0CEFF; }
    .cancel:hover { background-color: #E0CEFF; }
    .submit { border: 2px solid #6154D4; }
    .submit:hover { background-color: #6154D4; color: #FFF; }
`;

export const SelectBg = styled.div`
    width: calc(100% - 680px);
    height: 100%;
    @media (max-width: 1200px) {
        min-width: calc(100% - 248px);
    }
`

export const ChattingRoomBg = styled.div`
    width: 100%;
    //min-width: calc(100% - 680px);
    height: 100%;
    //background: #FFF;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
/*    @media (max-width: 1200px) {
        min-width: calc(100% - 200px);
    }*/
`
export const ChattingTitle = styled.div`
    width: 100%;
    /* font-size: 18px; */
    font-size: 1.15em;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const ProfileImg = styled.img`
    width: 75px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    &.msg_page {
        margin-right: 1.5rem;
    }
`
export const ChattingIcon = styled.img`
    width: 25px;
`
export const SendButton = styled.img`
    width: 25px;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
`


export const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    //height: calc(100% - 165px);
    width: 100%;
    height: calc(100% - 148px);
    overflow-y: auto;
    transition: height 0.2s ease;
    padding: 10px;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8fe4;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px;
    }
`;

export const MessageBox = styled.div`
    align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`

export const MsgTime = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 10px 0;
    flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
`

export const Message = styled.div`
    word-break: break-all;  // 영문 넘침 방지
    padding: 10px;
    max-width: 70%;
    border-radius: 20px;
    background-color: ${(props) =>
            props.darkMode
                    ? props.isSender
                            ? "#E0E0E0" // 다크 모드, 보낸 메시지
                            : "#1C1C1C" // 다크 모드, 받은 메시지
                    : props.isSender
                            ? "#363636" // 라이트 모드, 보낸 메시지
                            : "#E0E0E0" // 라이트 모드, 받은 메시지
    };
    border: ${(props) =>
            props.darkMode
                    ? props.isSender
                            ? "#E0E0E0" // 다크 모드, 보낸 메시지
                            : "#1C1C1C" // 다크 모드, 받은 메시지
                    : props.isSender
                            ? "#363636" // 라이트 모드, 보낸 메시지
                            : "#E0E0E0" // 라이트 모드, 받은 메시지
    };
    color: ${(props) =>
            props.darkMode
                    ? props.isSender
                            ? "#1C1C1C" // 다크 모드, 보낸 메시지
                            : "#E0E0E0" // 다크 모드, 받은 메시지
                    : props.isSender
                            ? "#E0E0E0" // 라이트 모드, 보낸 메시지
                            : "#363636" // 라이트 모드, 받은 메시지
    };
`;

export const Sender = styled.div`
    display: ${(props) => (props.isSender ? "none" : "block")};
`

export const SentTime = styled.div`

`

export const MsgInput = styled.textarea`
    padding: 5px 10px;
    width: 90%;
    box-sizing: border-box;
    outline-style: none;
    border: none;
    background: none;
    font-size: 1em;
    resize: none;
    max-height: 100px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8fe4;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px;
    }
    &::placeholder {
        text-align: center;
    }
`;

export const MsgInputBox = styled.div`
    width: 100%;
    padding: 10px;
    //margin-bottom: 2vw;
    border-radius: 10px;
    background-color: #FAFAF8;
    display: flex;
    justify-content: space-between;
    margin: 13px 0;
    box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.5);
`
export const ExitMsg = styled.p`
    font-size: 1.1em;
    text-align: center;
`

export const DateSeparator = styled.div`
    text-align: center;
    color: #888;
    font-size: 12px;
    margin: 15px 0;
    font-weight: bold;
`;
export const ChattingBottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;
export const ChatInput = styled.textarea`
    flex: 1;
    padding: 10px;
    resize: none;
`;

export const ChatButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;