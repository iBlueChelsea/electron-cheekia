import React, {useState} from "react";

const User = React.createContext({
    userID: null,
    socket: null,
    connect: (conn) => {},
    login: (id) => {},
    logout: () => {},
});

export const Auth = (props) => {
    const [userID, setUserID] = useState(null);
    const [socket, setSocket] = useState(null);

    const connectToSocket = (conn) => {
        setSocket(conn);
    }

    const loginHandler = (id) => {
        setUserID(id);
    }

    const logoutHandler = () => {
        setUserID(null);
    }

    const UserDetails = {
        userID: userID,
        socket: socket,
        connect: connectToSocket,
        login: loginHandler,
        logout: logoutHandler,
    }

    return <User.Provider value={UserDetails}>{props.children}</User.Provider>
}

export default User;