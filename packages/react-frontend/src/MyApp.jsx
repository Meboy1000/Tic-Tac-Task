// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";




function MyApp() {
  const [characters, setCharacters] = useState([]);


function fetchUsers() {
    return fetch("http://localhost:8000/users");
}

useEffect(() => {
    fetchUsers()
        .then(res => res.json())
        .then(json => setCharacters(json["users_list"]))
        .catch(error => console.log(error));
}, []);

function postUser(person) {
  return fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });
}


function updateList(person) { 
  postUser(person)
    .then(() => setCharacters([...characters, person]))
    .catch((error) => {
      console.log(error);
    });
}



function removeCharacter(index) {
  const updated = characters.filter((character, i)=> {
    return i !== index;
  });
  setCharacters(updated);
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