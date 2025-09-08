import React, { useEffect, useState } from 'react';
import './FlashcardList.css';

// Interface cho câu hỏi trắc nghiệm
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

const FlashcardList: React.FC = () => {
  const [flashcards, setFlashcards] = useState<QuizQuestion[]>([]);
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });
  const [prompt, setPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  // Gọi API sinh câu hỏi bằng AI
  const handleGenerateAI = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập chủ đề!');
      return;
    }
    setLoadingAI(true);
    try {
      const response = await fetch('http://localhost:3000/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.question) {
        // Sau khi sinh câu hỏi, reload danh sách
        const res = await fetch('http://localhost:3000/api/test');
        const flashData: QuizQuestion[] = await res.json();
        setFlashcards(flashData);
        setPrompt('');
        alert('Đã sinh câu hỏi và lưu vào DB!');
      } else {
        alert('Không thể sinh câu hỏi.');
      }
    } catch (err) {
      alert('Lỗi AI hoặc kết nối server!');
    }
    setLoadingAI(false);
  };

  // Gọi API để lấy dữ liệu câu hỏi
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test');
        const data: QuizQuestion[] = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx?: number) => {
    if (typeof idx === 'number') {
      const newOptions = [...form.options];
      newOptions[idx] = e.target.value;
      setForm({ ...form, options: newOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || form.options.some(opt => !opt) || !form.answer) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      await fetch('http://localhost:3000/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ question: '', options: ['', '', '', ''], answer: '' });
      // Reload flashcards
      const response = await fetch('http://localhost:3000/api/test');
      const data: QuizQuestion[] = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  return (
    <div className="flashcard-list">
      <form className="flashcard-form" onSubmit={handleSubmit}>
        <h2>Thêm câu hỏi mới</h2>
        <input
          className="input-modern"
          type="text"
          name="question"
          placeholder="Nhập câu hỏi"
          value={form.question}
          onChange={handleChange}
        />
        <div className="options-row">
          {form.options.map((opt, idx) => (
            <input
              className="input-modern"
              key={idx}
              type="text"
              placeholder={`Đáp án ${idx + 1}`}
              value={opt}
              onChange={e => handleChange(e, idx)}
            />
          ))}
        </div>
        <input
          className="input-modern"
          type="text"
          name="answer"
          placeholder="Đáp án đúng"
          value={form.answer}
          onChange={handleChange}
        />
        <button className="btn-modern" type="submit">Tạo câu hỏi</button>
      </form>
      <div className="flashcard-form" style={{ marginBottom: 32, marginTop: 0 }}>
        <h2>Sinh câu hỏi bằng AI</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="input-modern"
            type="text"
            placeholder="Nhập chủ đề câu hỏi muốn sinh..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            className="btn-modern"
            type="button"
            onClick={handleGenerateAI}
            disabled={loadingAI}
            style={{ minWidth: 160 }}
          >
            {loadingAI ? 'Đang sinh...' : 'Generate question by AI'}
          </button>
        </div>
      </div>
      <div className="flashcard-grid">
        {flashcards?.map((flashcard, index) => (
          <div key={index} className="flashcard-card">
            <h3 className="flashcard-question">{flashcard.question}</h3>
            <ul className="flashcard-options">
              {flashcard?.options?.map((option, optIndex) => (
                <li key={optIndex}>
                  <label className="option-label">
                    <input type="radio" name={`question-${index}`} />
                    <span>{option}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;