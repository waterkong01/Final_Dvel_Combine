import styled from "styled-components";

export const SkillListContainer = styled.div`
    margin-top: 2em;
    font-size: 1.3em;
    font-weight: bold;
`

export const SkillHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1em;
`

export const AddSkillBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    & input {
        padding: 10px;
        font-size: 1.1rem;
        width: 250px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fff;
        color: #333;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    }
    & input:focus {outline: none;}
    & button {
        padding: 10px 18px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
`

export const SkillBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.5em;
    width: 100%;
    font-size: 1.3em;
    font-weight: bold;
    margin-top: 1em;
`

export const SkillIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 90px;
    height: 45px;
    border-radius: 40px;
    background-color: #DBDBDB;
    color: #000;
    font-size: 1rem;
    font-weight: normal;
    text-align: center;
    text-transform: capitalize;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    border: none;
    padding: 0 15px;
    & img {
        margin-left: 1em;
        width: 15px;
        cursor: pointer;
    }
`