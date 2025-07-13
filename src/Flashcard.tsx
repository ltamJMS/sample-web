import React from 'react';

interface FlashcardProps {
  term: string;
  definition: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ term, definition }) => {

  return (
    <div className="flashcard">
      <div className="flashcard-term">{term}</div>
      <div className="flashcard-definition">{definition}</div>
    </div>
  );
};

export default Flashcard;