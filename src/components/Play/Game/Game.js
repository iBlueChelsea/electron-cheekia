import React, { useState, useEffect, useContext } from "react";
import Board from "./Board/Board";
import Hand from "./Hand/Hand";
import Wheel from "./Wheel/Wheel";
import Infobox from "../UI/Infobox/Infobox";
import MulliganModal from "../UI/MulliganModal/MulliganModal";
import ChooseModal from "../UI/ChooseModal/ChooseModal";
import Card from "./Hand/Card/Card";
import EndGameButton from "../UI/EndGameButton/EndGameButton";
import { useStore } from "../../../hooks/store";
import User from "../../../hooks/auth";
import images_ui from "../../../assets/images/ui/images_ui";

const Game = React.memo((props) => {
  const [state, dispatch] = useStore();
  const user = useContext(User);

  //console.log("STATE_UPDATE", state);

  useEffect(() => {
    user.socket.on("updateGameState", (data) => {
      dispatch("SET_DATA", JSON.parse(data));
    });

    user.socket.on("getDeck", (cards) => {
      const payload = { player: props.player, cards: JSON.parse(cards) };
      dispatch("SHUFFLE_DECK", payload);
    });

    user.socket.on("updateStateData", (action, stateData) => {
      //console.log("onUpdateStateData", action);
      dispatch("SET_STATE_DATA", JSON.parse(stateData));
    });

    user.socket.on("updateStatePlayer", (action, player, statePlayer) => {
      //console.log("onUpdateStatePlayer", action);
      const payload = { player: player, statePlayer: JSON.parse(statePlayer) };
      dispatch("SET_STATE_PLAYER", payload);
    });

    user.socket.on(
      "updateStatePlayerAndData",
      (action, player, statePlayer, stateData) => {
        //console.log("onUpdateStatePlayerAndData", action);
        const payload = {
          player: player,
          statePlayer: JSON.parse(statePlayer),
          stateData: JSON.parse(stateData),
          action: action,
        };
        dispatch("SET_STATE_PLAYER_AND_DATA", payload);
      }
    );

    return () => {
      user.socket.off("updateGameState");
      user.socket.off("getDeck");
      user.socket.off("updateStateData");
      user.socket.off("updateStatePlayer");
      user.socket.off("updateStatePlayerAndData");
    };
  }, []);

  useEffect(() => {
    if (!state.data[props.player].shuffled) {
      user.socket.emit("getDeck", props.gameId, props.player);
    }
  }, []);

  useEffect(() => {
    if (
      !state.data[props.player].mulligan &&
      !state.data[props.opponent].mulligan &&
      props.player === "player1"
    ) {
      const payload = { player: props.player };
      dispatch("START_GAME", payload);
    }
  }, [state.data.player1.mulligan, state.data.player2.mulligan]);

  useEffect(() => {
    //console.log("onDispatch", state.dispatchAction);
    switch (state.dispatchAction) {
      case "START_GAME":
      case "END_GAME":
        user.socket.emit(
          "saveStateData",
          state.dispatchAction,
          props.gameId,
          JSON.stringify({ status: state.data.status, board: state.data.board })
        );
        break;
      case "SHUFFLE_DECK":
      case "CONFIRM_MULLIGAN":
      case "PLUS_FAERIA":
        user.socket.emit(
          "saveStatePlayer",
          state.dispatchAction,
          props.gameId,
          props.player,
          JSON.stringify(state.data[props.player])
        );
        break;
      case "BUILD_TILE":
      case "DRAW_CARD":
      case "SELECT_EVENT":
      case "PROCESS_EVENT_OCCUPANT":
      case "PROCESS_EVENT_TILE":
      case "PROCESS_GIFT_OCCUPANT":
      case "CHOOSE_CARD":
      case "SUMMON_CREATURE":
      case "MOVE_OCCUPANT":
      case "ATTACK_OCCUPANT":
      case "ATTACK_GOD":
        user.socket.emit(
          "saveStatePlayerAndData",
          state.dispatchAction,
          props.gameId,
          props.player,
          JSON.stringify(state.data[props.player]),
          JSON.stringify({ status: state.data.status, board: state.data.board })
        );
        break;
      case "END_TURN":
        user.socket.emit(
          "saveStatePlayerAndData",
          state.dispatchAction,
          props.gameId,
          props.opponent,
          JSON.stringify(state.data[props.opponent]),
          JSON.stringify({ status: state.data.status, board: state.data.board })
        );
        break;
      default:
    }
  }, [state.dispatchAction]);

  if (!(state.data.player1.shuffled && state.data.player2.shuffled)) {
    return "Waiting for game to load...";
  }

  const mulligan = state.data[props.player].mulligan ? (
    <MulliganModal
      player={props.player}
      opponent={props.opponent}
      id={props.gameId}
    />
  ) : null;

  const choose =
    state.data.status.current === props.player &&
    state.currentAction === "event_choose_occupant" ? (
      <ChooseModal
        user={props.player}
        opponent={props.opponent}
        id={props.gameId}
      />
    ) : null;

  const highlighted_card = state.highlightedOccupant ? (
    <Card
      id={props.gameId}
      index={0}
      data={state.cardLibrary[state.highlightedOccupant]}
      classname="card-highlight"
      width="240px"
      height="326px"
      user={props.player}
      opponent={props.opponent}
      owner={props.player}
    />
  ) : null;

  const endgamebutton =
    state.data.status.current === props.player ? (
      <EndGameButton opponent={props.opponent} />
    ) : null;

  const output = state.data.status.finished ? (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ textAlign: "center" }}>
        WINNER: {state.data[state.data.status.winner].name}
      </h1>
      <img src={images_ui.cheekWinner} width="50%"></img>
    </div>
  ) : (
    <div style={{ display: "flex", height: "100vh" }}>
      {mulligan}
      {choose}
      <div
        style={{
          width: "20vw",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Infobox
          align="flex-start"
          data={state.data[props.opponent]}
          tiles={state.data.board.tiles}
          player={props.opponent}
        />
        <Infobox
          align="flex-end"
          data={state.data[props.player]}
          tiles={state.data.board.tiles}
          player={props.player}
        />
      </div>
      <div
        style={{
          width: "60vw",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Hand
          data={state.data[props.opponent]}
          owner={props.opponent}
          height="36px"
          align="flex-start"
          user={props.player}
          opponent={props.opponent}
        />
        <Board
          data={state.data.board}
          user={props.player}
          opponent={props.opponent}
        />
        <Hand
          data={state.data[props.player]}
          owner={props.player}
          height="166px"
          align="flex-end"
          user={props.player}
          opponent={props.opponent}
        />
      </div>
      <div
        style={{
          width: "20vw",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "10vh" }}>{endgamebutton}</div>
        <div style={{ height: "40vh" }}>{highlighted_card}</div>
        <div style={{ height: "50vh" }}>
          <Wheel
            data={state.data.status}
            user={props.player}
            opponent={props.opponent}
            id={props.gameId}
          />
        </div>
      </div>
    </div>
  );

  return output;
});

export default Game;
