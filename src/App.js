import { useEffect, useContext } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import DeckBuilder from "./components/DeckBuilder/DeckBuilder";
import Play from "./components/Play/Play";
import Lobby from "./components/Play/Game/Lobby";
import User from "../src/hooks/auth";
import io from "socket.io-client";

const App = () => {
  const user = useContext(User);
  const location = useLocation();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    user.connect(socket);
    return () => socket.close(); // eslint-disable-next-line
  }, []);

  if (user.userID) {
    return (
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/main">
          <Main />
        </Route>
        <Route path="/deckbuilder">
          <DeckBuilder />
        </Route>
        <Route path="/play">
          <Play />
        </Route>
        <Route path="/game/:id">
          <Lobby />
        </Route>
      </Switch>
    );
  } else {
    if (location.pathname == "/login") {
      return <Login />;
    } else {
      return <Redirect to="/login" />;
    }
  }
};

export default App;
