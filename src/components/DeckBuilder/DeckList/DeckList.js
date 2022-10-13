import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DeckListItem from "./DeckListItem/DeckListItem";
import User from "../../../hooks/auth";

const DeckList = (props) => {
  const [decksState, setDecksState] = useState([]);
  const user = useContext(User);

  useEffect(() => {
    axios
      .post("http://localhost:3001/get-decks", {
        user: user.userID,
      })
      .then((res) => {
        setDecksState(res.data);
      })
      .catch((error) => {
        console.log("Network Error", error.message);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const decks = decksState.map((deck) => (
    <DeckListItem key={deck.id} data={deck} click={props.click} />
  ));
  decks.push(
    <DeckListItem
      key="0"
      data={{ id: 0, deck_name: "Add new", cover: 0, cards: [], cost: 0.0 }}
      click={props.click}
    />
  );
  return decks;
};

export default DeckList;
