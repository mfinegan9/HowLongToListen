//postgres

import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import UserDashboard from "./UserDashboard";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;