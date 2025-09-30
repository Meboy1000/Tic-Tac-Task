// src/MyApp.jsx
import React, { useState } from "react";
import Table from "./Table";
import Form from "./Form";



function MyApp() {
  const [characters, setCharacters] = useState([]);

function removeCharacter(index) {
  const updated = characters.filter((character, i)=> {
    return i !== index;
  });
  setCharacters(updated);
}

function updateList(person) {
  setCharacters([...characters, person]);
}

return (
  <div className="container">
    <Table characterData={characters} 
      removeCharacter={removeCharacter}
    
    /> 
    <Form handleSubmit = {updateList} />
  </div>
);
}

export default MyApp;