import MsgList from "./MsgList";
import {Container} from "../../design/Msg/MsgMainDesign";
import MsgSelectPage from "./MsgSelectPage";
import {useLocation} from "react-router-dom";
import {ChatContext} from "../../api/context/ChatStore";
import {useContext, useEffect} from "react";

const MsgMain = ({darkMode}) => {
    const location = useLocation();
    const { selectedPage, setSelectedPage, setRoomId } = useContext(ChatContext);

    useEffect(() => {
        const storedPage = localStorage.getItem("selectedPage") || "defaultPage";
        const storedRoomId = localStorage.getItem("roomId");

        setSelectedPage(storedPage);
        if (storedRoomId) setRoomId(storedRoomId);
    }, [setSelectedPage, setRoomId]);

    useEffect(() => {
        if (location.state?.selectedPage) {
            setSelectedPage(location.state.selectedPage);
            localStorage.setItem("selectedPage", location.state.selectedPage);
        }
        if (location.state?.roomId) {
            setRoomId(location.state.roomId);
            localStorage.setItem("roomId", location.state.roomId);
        }
    }, [location.state, setSelectedPage, setRoomId]);

    return (
        <Container darkMode={darkMode}>
            <MsgList darkMode={darkMode}/>
            <MsgSelectPage darkMode={darkMode}/>
        </Container>
    );
};

export default MsgMain;