import styled from "styled-components";

export const ChatListBg = styled.div`
    width: 600px;
    //height: 100%;
    //background-color: palegoldenrod;
    border-right: ${({ darkMode }) => (darkMode ? "2px solid #FAFAF8" : "2px solid #181818")};
    padding: 2em;
    @media (max-width: 1200px) {
        width: 168px;
        padding: 1em;
    }
`;

export const ChatListBox = styled.div`
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 15px;
    overflow-y: auto;
    height: 100%;
    background: #FAFAF8;
    &::-webkit-scrollbar {
        width: 16px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #dbdbdb;
        border-radius: 15px;
        border: 5px solid #fafaf8;
    }
    &::-webkit-scrollbar-track {
        background: #fafaf8;
        border-radius: 15px;
        //box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.3);
        //outline: 5px solid #fafaf8;
    }
`
export const ChatUl = styled.ul`
    list-style-type: none;
    padding: 0;
`;

export const ChatRoom = styled.li`
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    overflow: hidden;
    & > .info { width: 100%; }
`;

export const ChatName = styled.p`
    font-size: 1em;
    margin-bottom: 0;
    margin-left: 1.5rem;
    color: #444;
    &.room_name {
        font-size: 1.2em;
        font-weight: bold;
    }
    &.last_msg {
        width: calc(100% - 100px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
    }
    @media (max-width: 1200px) {
        display: none;
    }
`;