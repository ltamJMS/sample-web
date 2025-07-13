import React, { useEffect, useState } from 'react';

// Interface cho câu hỏi trắc nghiệm
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

const FlashcardList: React.FC = () => {
  const [flashcards, setFlashcards] = useState<QuizQuestion[]>([]); // state để lưu trữ danh sách câu hỏi

  // Gọi API để lấy dữ liệu câu hỏi
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/questions');
        const data: QuizQuestion[] = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  return (
    <div className="flashcard-list">
      {flashcards.map((flashcard, index) => (
        <div key={index} className="flashcard">
          <h3>{flashcard.question}</h3>
          <div>
            {flashcard.options.map((option, optIndex) => (
              <li key={optIndex}>
                <label>
                  <input type="radio" name={`question-${index}`} />
                  {option}
                </label>
              </li>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;