import styled from "styled-components";

export const LoginContainer = styled.div`
    padding: 3em 5em;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    background: #FAFAF8;
    color: #000;
    & .input_box {
        width: 100%;
        //margin-bottom: 1em;
    }
    & input {
        width: 100%;
        min-width: 350px;
        background: none;
        border: 1px solid #363636;
        border-radius: 5px;
        padding: 1em;
        font-size: 0.9em;
    }
    & label {
        display: block;
        margin-bottom: 0.5em;
        font-weight: bold;
    }
    & form {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1em;
    }
    & a.sign {
        color: #000;
        text-decoration: none;
        margin-bottom: 1em;
    }
`

export const ThirdLoginBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 2em;
    margin-top: 2em;
`

export const SubmitButton = styled.button`
    width: 100%;
    padding: 0.5em 1em;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    letter-spacing: 10px;
    font-size: 1.2em;
    &:hover {
    background-color: #555;
    }
`;