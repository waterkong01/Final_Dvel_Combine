import {CenterIcon, CircleBox, MsgDefaultContainer} from "../../design/Msg/MsgSelectDesign";

const MsgDefault = ({darkMode}) => {
    const DEFAULT_ICON_URL = [
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_after-1.png?alt=media",   // message_after-1
        "https://firebasestorage.googleapis.com/v0/b/d-vel-b334f.firebasestorage.app/o/firebase%2Fsidebar%2Fmessage_after.png?alt=media",   // message_after
    ]
    return (
        <MsgDefaultContainer>
            {/*클릭 시 팔로우 리스트*/}
            <CircleBox darkMode={darkMode}>
                <CenterIcon
                    src={darkMode ? DEFAULT_ICON_URL[1] : DEFAULT_ICON_URL[0]}
                />
            </CircleBox>
            <span>새로운 채팅을 시작해보세요</span>
        </MsgDefaultContainer>
    );
}
export default MsgDefault;