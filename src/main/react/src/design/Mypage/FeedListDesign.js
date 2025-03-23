import styled from "styled-components";

export const FeedContainer = styled.div`
    font-size: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: flex-end;
`

export const FeedImg = styled.img`
    width: 50px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
`

export const FeedTop = styled.div`
    width: 100%;
    display: flex;
    gap: 1em;
`

export const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    & .created_at {
        color: #818181;
        font-size: 0.8em;
    }
`

export const FeedMid = styled.div`
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;  // 최대 2줄 표시
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
    word-break: break-word;
    & textarea {
        background: #FAFAF8;
        padding: 1em;
        border-radius: 10px;
        resize: none;
    }
    & textarea:focus { outline: none; }
`

export const FeedBottom = styled.div`
    display: flex;
    gap: 1em;
    & button {
        border: none;
        background: none;
        padding: 0.5em 1em;
        border-radius: 10px;
    }
    & button.save {
        background: #DBDBDB;
    }
`