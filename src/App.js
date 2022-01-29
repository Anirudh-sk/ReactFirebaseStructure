import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import { GlobalStateContextProvider } from "./context/GlobalStateContext";
import Navigation from "./pages/Navigation";

function App() {
  return (
    <BrowserRouter>
      <GlobalStateContextProvider>
        <Switch>
          <Route path="/tool" component={Navigation} />
          <Route path="/" exact component={() => <Redirect to="/tool" />} />
        </Switch>
      </GlobalStateContextProvider>
    </BrowserRouter>
  );
}

export default App;
