import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Auth } from "./hooks/auth";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Auth>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth>,
  document.getElementById("root")
);
