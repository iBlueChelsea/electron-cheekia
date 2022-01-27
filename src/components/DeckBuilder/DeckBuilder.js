import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Deck from "./Deck/Deck";
import DeckList from "./DeckList/DeckList";

const DeckBuilder = () => {
  const [isListView, setIsListView] = useState(true);
  const [deck, setDeck] = useState({});

  const history = useHistory();

  const backHandler = () => {
    history.replace("/main");
  };

  const onClickHandler = (event) => {
    setDeck(JSON.parse(event.target.attributes.data.value));
    setIsListView(false);
  };

  const returnHandler = () => {
    setDeck({});
    setIsListView(true);
  };

  const display = isListView ? (
    <React.Fragment>
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "100vh",
          width: "100vw",
          justifyContent: "space-evenly",
          overflow: "scroll",
        }}
      >
        <DeckList click={onClickHandler} />
      </div>
    </React.Fragment>
  ) : (
    <Deck data={deck} click={returnHandler} />
  );

  return display;
};

export default DeckBuilder;
