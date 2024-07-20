import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const checkIfAlreadyAnswered = async () => {
      try {
        const response = await axios.get('/api/check');
        if (response.status === 200) {
          setMessage('You have already answered the quiz.');
          setQuizStarted(false);
        } else {
          setQuizStarted(true);
        }
      } catch (error) {
        setQuizStarted(true);
      }
    };
    checkIfAlreadyAnswered();
  }, []);

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/submit', { answers });
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setMessage('Error submitting the quiz.');
    }
  };

  if (!quizStarted) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h5>
          <p className="card-text">{questions[currentQuestionIndex].question}</p>
          <div className="form-group">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={handleAnswerChange}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="primary" onClick={handleNext} disabled={!answers[currentQuestionIndex]}>
                Next
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={!answers[currentQuestionIndex]}>
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have successfully submitted the quiz!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Quiz;
