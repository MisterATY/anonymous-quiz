import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const checkIfAlreadyAnswered = async () => {
      try {
        const response = await axios.get("/api/check");
        if (response.data.ok) {
          setQuizStarted(true);
        } else {
          setMessage("Siz avval ishtirok etgansiz");
          setQuizStarted(false);
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
      await axios.post("/api/submit", { answers });
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setMessage("Error submitting the quiz.");
    }
  };

  if (!quizStarted) {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "95vh" }}
      >
        <header className="bg-success text-white p-3 py-1 text-center opacity-50">
          <h4 style={{ fontWeight: "bold" }}>
            Asosiy turdagi oziq-ovqat mahsulotlari iste’moli bo‘yicha
            so‘rovnoma.
          </h4>
        </header>
        <div className="container mt-5" style={{ flex: 1, overflow: "auto" }}>
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        </div>

        <footer className="bg-dark text-white text-center p-3 mt-5">
          <p>
            &copy; Powered by{" "}
            <span style={{ fontWeight: "bold", color: "silver" }}>
              IIC Club.
            </span>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "95vh" }}
    >
      <header className="bg-success text-white p-3 py-1 text-center opacity-50">
        <h4 style={{ fontWeight: "bold" }}>
          Asosiy turdagi oziq-ovqat mahsulotlari iste’moli bo‘yicha so‘rovnoma.
        </h4>
      </header>
      <p style={{ fontStyle: "italic", fontSize: '.8em', padding: '.5em', textIndent: '1em' }}>
        Izox. So‘rovnoma natijalari asosida axolining asosiy oziq-ovqat
        mahsulotlariga bo‘lgan talab shakllantiriladi. Shu sababli imkon qadar
        aniq javob belgilashingizni iltimos qilamiz.
      </p>
      <div className="container" style={{ flex: 1, overflow: "auto" }}>
        <div className="card">
          <div className="card-body">
            <p className="card-text">
              {currentQuestionIndex + 1}/{questions.length}.&nbsp;{" "}
              <span className="card-title" style={{ fontWeight: "bold" }}>
                {questions[currentQuestionIndex].question}
              </span>
            </p>
            <hr />
            <div className="form-group">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div className="form-check" key={index} style={{ marginBottom: '.5em' }}>
                  <label className="form-check-label">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={handleAnswerChange}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Avvalgi
              </Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!answers[currentQuestionIndex]}
                >
                  Keyingi
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={!answers[currentQuestionIndex]}
                >
                  Tugatish
                </Button>
              )}
            </div>
          </div>
        </div>
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          onExited={() => setQuizStarted(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>Muvaffaqiyatli ishtirok etdingiz</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <footer className="bg-dark text-white text-center p-3 mt-5">
        <p>
          &copy; Powered by{" "}
          <span style={{ fontWeight: "bold", color: "silver" }}>IIC Club.</span>
        </p>
      </footer>
    </div>
  );
};

export default Quiz;
