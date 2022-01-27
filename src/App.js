import { useEffect, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import DeckBuilder from "./components/DeckBuilder/DeckBuilder";
import Play from "./components/Play/Play";
import Game from "./components/Play/Game/Game";
import User from "../src/hooks/auth";
import io from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const user = useContext(User);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    user.connect(socket);
    return () => socket.close(); // eslint-disable-next-line
  }, []);

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
        <Game />
      </Route>
    </Switch>
  );
};

export default App;
