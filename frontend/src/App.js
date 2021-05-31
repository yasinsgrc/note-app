import React from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./components/Login";
import Notes from "./components/Notes";
import { useHistory } from 'react-router-dom';

export default function App() {
  let history = useHistory();
  return (
    <Router history={history}>
        <Switch>
        <Route exact path="/">
            <Login />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/Notes" >
            <Notes/>
          </Route>
        </Switch>
    </Router>
  );
}

