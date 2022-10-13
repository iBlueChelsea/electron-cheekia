import React, { useState, useEffect, useContext } from "react";
import Game from "./Game";
import User from "../../../hooks/auth";
import images from "../../../assets/images/cards/images";
import configureStore from "../../../hooks/global-store";
import { useParams } from "react-router-dom";

const Lobby = () => {
  const user = useContext(User);
  const routerParams = useParams();
  const gameId = routerParams.id;

  const [player, setPlayer] = useState("");
  const opponent = player == "player1" ? "player2" : "player1";
  const [gameReady, setGameReady] = useState(false);

  const [playerDeckList, setPlayerDeckList] = useState([]);
  const [playerState, setPlayerState] = useState({
    name: "Waiting for player...",
    cover: "cardback",
    ready: false,
  });
  const [opponentState, setOpponentState] = useState({
    name: "Waiting for player...",
    cover: "cardback",
    hiddenCover: "cardback",
    ready: false,
    connected: false,
  });

  useEffect(() => {
    user.socket.emit("getUserRole", user.userID, gameId);

    user.socket.on("getUserRole", (data) => {
      setPlayer(data.userRole);
      setPlayerState((prevState) => ({
        ...prevState,
        name: data.userName,
      }));
      if (data.opponentName) {
        setOpponentState((prevState) => ({
          ...prevState,
          name: data.opponentName,
          connected: true,
        }));
      }
    });

    user.socket.on("getInitialState", (data) => {
      let parsedData = JSON.parse(data);
      let loadStore = parsedData.initialState;
      configureStore(loadStore);
      setPlayerDeckList(parsedData.userDeckList);
    });

    user.socket.on("setOpponentReady", () => {
      setOpponentState((prevState) => ({
        ...prevState,
        ready: !prevState.ready,
      }));
    });

    user.socket.on("playerJoined", (data) => {
      setOpponentState((prevState) => ({
        ...prevState,
        name: data,
        connected: true,
      }));
    });

    user.socket.on("opponentDeckSelected", (data) => {
      setOpponentState((prevState) => ({
        ...prevState,
        hiddenCover: data,
      }));
    });

    return () => {
      user.socket.off("getUserRole");
      user.socket.off("getInitialState");
      user.socket.off("setOpponentReady");
      user.socket.off("playerJoined");
      user.socket.off("opponentDeckSelected");
    };
  }, []);

  useEffect(() => {
    if (player) {
      user.socket.emit("getInitialState", gameId, user.userID, player);
    }
  }, [player]);

  useEffect(() => {
    if (playerState.ready && opponentState.ready) {
      setOpponentState((prevState) => ({
        ...prevState,
        cover: prevState.hiddenCover,
      }));
      setTimeout(() => {
        setGameReady(true);
      }, 5000);
    }
  }, [playerState.ready, opponentState.ready]);

  const selectDeck = (event) => {
    let selectedDeck = playerDeckList.find(
      (deck) => deck.id == event.target.value
    );
    setPlayerState((prevState) => ({
      ...prevState,
      cover: selectedDeck.cover,
    }));
    user.socket.emit("selectDeck", gameId, player, selectedDeck);
  };

  const setReady = () => {
    setPlayerState((prevState) => ({
      ...prevState,
      ready: !prevState.ready,
    }));
    user.socket.emit("setReady", gameId);
  };

  const deckList = playerDeckList.map((deck) => (
    <option key={deck.id} value={deck.id}>
      {deck.deck_name}
    </option>
  ));

  const deckSelector =
    playerState.cover == "cardback" && opponentState.connected ? (
      <div className="container col-6 rounded">
        <label htmlFor="deck">Select a deck:</label>
        <select
          className="form-control form-select"
          name="deck"
          onChange={selectDeck}
        >
          <option key="0" value="0">
            ---
          </option>
          {deckList}
        </select>
      </div>
    ) : null;

  const lobby = (
    <div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          className="col-6"
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="container col-6 rounded text-center"
            style={{
              padding: "10px",
            }}
          >
            <b>{playerState.name}</b>
          </div>
          <div
            className="container col-6 rounded bg-dark"
            style={{
              padding: "10px",
              minHeight: "540px",
            }}
          >
            <div
              className="col text-center"
              style={{
                padding: "20px",
              }}
            >
              <img src={images[playerState.cover]} alt="play" />
            </div>
          </div>
          <div
            className="container col-6 rounded text-center"
            style={{
              padding: "10px",
            }}
          >
            {playerState.ready ? (
              <button type="button" className="btn btn-success col-6">
                Ready
              </button>
            ) : (
              <button
                type="button"
                onClick={setReady}
                disabled={playerState.cover == "cardback"}
                className="btn btn-secondary col-6"
              >
                Ready
              </button>
            )}
          </div>
          {deckSelector}
        </div>
        <div
          className="col-6"
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="container col-6 rounded text-center"
            style={{
              padding: "10px",
            }}
          >
            <b>{opponentState.name}</b>
          </div>
          <div
            className="container col-6 rounded bg-dark"
            style={{
              padding: "10px",
              minHeight: "540px",
            }}
          >
            <div
              className="col text-center"
              style={{
                padding: "20px",
              }}
            >
              <img src={images[opponentState.cover]} alt="play" />
            </div>
          </div>
          <div
            className="container col-6 rounded text-center"
            style={{
              padding: "10px",
            }}
          >
            {opponentState.ready ? (
              <button disabled type="button" className="btn btn-success col-6">
                Ready
              </button>
            ) : (
              <button
                disabled
                type="button"
                className="btn btn-secondary col-6"
              >
                Ready
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const output = gameReady ? (
    <Game gameId={gameId} player={player} opponent={opponent} />
  ) : (
    lobby
  );
  return output;
};

export default Lobby;
