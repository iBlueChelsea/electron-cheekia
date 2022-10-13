import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import User from "../../hooks/auth";

const Play = () => {
  const [games, updateGames] = useState([]);
  const history = useHistory();
  const user = useContext(User);

  useEffect(() => {
    user.socket.emit("initGames");
    user.socket.on("updateGames", (data) => {
      updateGames(JSON.parse(data));
    });
    user.socket.on("redirectToGame", (id) => {
      history.replace(`/game/${id}`);
    });
    return () => {
      user.socket.off("updateGames");
      user.socket.off("redirectToGame");
    };
  }, []);

  const backHandler = () => {
    history.replace("/main");
  };

  const joinGameHandler = (event) => {
    user.socket.emit("joinGame", user.userID, event.target.value);
    history.replace(`/game/${event.target.value}`);
  };

  const newGameHandler = () => {
    user.socket.emit("newGame", user.userID);
  };

  const gameList = games.map((game) => {
    return (
      <li key={game["id"]} className="list-group-item list-group-item-light">
        Game: {game["player1"]} vs {game["player2"] ? game["player2"] : "---"}
        <button
          className="btn btn-outline-dark btn-sm"
          value={game["id"]}
          onClick={joinGameHandler}
        >
          Join Game
        </button>
      </li>
    );
  });

  return (
    <div>
      <div className="container col-8 rounded bg-dark text-light">
        <button
          className="btn btn-outline-info"
          name="newgame"
          onClick={newGameHandler}
        >
          Create new game
        </button>
        <ul id="list" className="list-group">
          {gameList}
        </ul>
      </div>
      <div className="container col-1 rounded bg-dark text-light">
        <div className="col text-center">
          <button
            className="btn btn-lg btn-danger"
            name="back"
            onClick={backHandler}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Play;
