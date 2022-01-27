import { React, useContext} from "react";
import { useHistory } from "react-router-dom";
import images_menu from "../../assets/images/menu/images_menu";
import User from "../../hooks/auth";

const Main = () => {
  const user = useContext(User);
  const history = useHistory();

  const navigateHandler = (event) => {
    history.replace(`/${event.target.alt}`);
  };

  const logoutHandler = () => {
    user.logout();
    history.replace("/login");
  }

  return (
    <div>
      <div className="container col-4 rounded bg-dark text-light">
        <div className="col text-center">
          <button
            className="btn btn-link"
            name="play"
            value="play"
            onClick={navigateHandler}
          >
            <img src={images_menu["BUTTON_PLAY"]} alt="play" />
          </button>
          <p className="text-center font-weight-bold text-danger">fak</p>
          <label htmlFor="deck">Select a deck:</label>
          <select className="form-control" name="deck"></select>
        </div>
      </div>
      <div className="container col-4 rounded bg-dark text-light">
        <div className="col text-center">
          <button
            className="btn btn-link"
            name="deckbuilder"
            value="deckbuilder"
            onClick={navigateHandler}
          >
            <img src={images_menu["BUTTON_DECKBUILDER"]} alt="deckbuilder" />
          </button>
        </div>
      </div>
      <div className="container col-1 rounded bg-dark text-light">
        <div className="col text-center">
          <button className="btn btn-lg btn-danger" name="logout" onClick={logoutHandler}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
