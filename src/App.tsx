import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Flavanoids from "./components/Flavanoids/Flavanoids";
import Gamma from "./components/Gamma/Gamma";
function App() {
  return (
    <>
      <Flavanoids />
      <Gamma />
    </>
  );
}

export default App;
