import React from 'react';
import './App.css';
import FlashcardList from './FlashcardList';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quizlet Clone</h1>
      </header>
      <main>
        <FlashcardList />
      </main>
    </div>
  );
}

export default App;