import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import User from "../../hooks/auth";

const Login = () => {
  const history = useHistory();
  const user = useContext(User);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const inputHandler = (event) => {
    const newLoginData = { ...loginData };
    newLoginData[event.target.id] = event.target.value;
    setLoginData(newLoginData);
  };

  const loginHandler = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/login", {
        username: loginData.username,
        password: loginData.password,
      })
      .then((response) => {
        user.login(response.data.userID);
        history.replace("/main");
      });
  };

  return (
    <form onSubmit={loginHandler}>
      <input type="text" id="username" onChange={inputHandler} />
      <input type="password" id="password" onChange={inputHandler} />
      <button>Login</button>
    </form>
  );
};

export default Login;
