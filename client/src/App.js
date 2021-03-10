import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datetime/css/react-datetime.css";
import "react-intl-tel-input/dist/main.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Routing from "./Components/Routing/Routing";

function App() {
  return (
    <div className="wholeContainer">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Routing />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
