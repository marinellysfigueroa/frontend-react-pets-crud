import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/pets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets', error);
    }
  };

  const addPet = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/pets', { name, type });
      setPets([...pets, response.data]);
      setName('');
      setType('');
    } catch (error) {
      console.error('Error adding pet', error);
    }
  };

  const deletePet = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/pets/${id}`);
      setPets(pets.filter(pet => pet._id !== id));
    } catch (error) {
      console.error('Error deleting pet', error);
    }
  };

  const startEditPet = (pet) => {
    setEditId(pet._id);
    setEditName(pet.name);
    setEditType(pet.type);
  };

  const cancelEditPet = () => {
    setEditId(null);
    setEditName('');
    setEditType('');
  };

  const updatePet = async () => {
    try {
      await axios.put(`http://localhost:4000/api/pets/${editId}`, { name: editName, type: editType });
      cancelEditPet();
      fetchPets();
    } catch (error) {
      console.error('Error updating pet', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pet Management</h1>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <button onClick={addPet}>Add Pet</button>
        </div>
        <ul>
          {pets.map(pet => (
            <li key={pet._id}>
              {editId === pet._id ? (
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                  />
                  <button onClick={updatePet}>Update</button>
                  <button onClick={cancelEditPet}>Cancel</button>
                </div>
              ) : (
                <div>
                  {pet.name} ({pet.type})
                  <button onClick={() => startEditPet(pet)}>Edit</button>
                  <button onClick={() => deletePet(pet._id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
