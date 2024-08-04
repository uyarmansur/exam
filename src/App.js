import React from "react";
import Exam from "./Question/Exam";

const App = () => {
  return (
    <div className="App" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <header className="App-header">
        <h1>Quiz App</h1>
      </header>
      <Exam />
    </div>
  );
};

export default App;
