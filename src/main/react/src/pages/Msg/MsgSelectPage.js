import {useContext} from "react";
import {ChatContext} from "../../api/context/ChatStore";
import {SelectBg} from "../../design/Msg/MsgPageDesign";
import MsgDefault from "./MsgDefault";
import MsgPage from "./MsgPage";

const MsgSelectPage = ({darkMode}) => {
    const {selectedPage, setSelectedPage, roomId} = useContext(ChatContext);

    const renderSelectedPage = ({darkMode}) => {
        switch (selectedPage) {
            case "defaultPage":
                return <MsgDefault darkMode={darkMode} setSelectedPage={setSelectedPage}/>;
            case "chatting":
                return <MsgPage darkMode={darkMode} setSelectedPage={setSelectedPage} roomId={roomId}/>;
            default:
                return null;
        }
    };

    return (
        <SelectBg>{renderSelectedPage({darkMode})}</SelectBg>
    );
};
export default MsgSelectPage;