import {createContext, use, useState} from "react";
export const ChatContext = createContext(null);

export const ChatStoreProvider = ({children}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [selectedPage, setSelectedPage] = useState("defaultPage");
    // const [selectedPage, setSelectedPage] = useState("chatting");
    const [roomId, setRoomId] = useState(null);
    const [roomNames, setRoomNames] = useState({});
    const [roomImgs, setRoomImgs] = useState({});
    const [roomMsg, setRoomMsg] = useState({});
    return (
        <ChatContext.Provider value={{selectedPage, setSelectedPage, roomId, setRoomId, roomNames, setRoomNames, roomImgs, setRoomImgs, roomMsg, setRoomMsg}}>
        {/*<ChatContext.Provider value={{roomId, setRoomId}}>*/}
            {children}
        </ChatContext.Provider>
    );
};