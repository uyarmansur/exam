import React, { useState, useEffect } from "react";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerable, setIsAnswerable] = useState(false);
  const [timer, setTimer] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        const processedQuestions = data.slice(0, 10).map((post) => ({
          question: post.title,
          choices: parseChoices(post.body),
          correctAnswer: parseChoices(post.body)[0], // Simplified
        }));
        setQuestions(processedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, isAnswerable]);

  useEffect(() => {
    if (currentQuestionIndex >= currentQuestionIndex.length - 1) {
      setQuizFinished(true);
    } else {
      setIsAnswerable(false);
      setTimer(30);
      const timerId = setTimeout(() => setIsAnswerable(true), 10000);
      return () => clearTimeout(timerId);
    }
  }, [currentQuestionIndex]);

  const parseChoices = (body) => {
    return body.split("\n").filter((line) => line.trim() !== "");
  };

  const handleAnswerClick = (choice) => {
    if (isAnswerable) {
      setSelectedAnswer(choice);
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [timer]);

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => [...prev, selectedAnswer]);
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (quizFinished) {
    return (
      <div>
        <h2>Quiz Results</h2>
        <table border="1">
          <thead>
            <tr>
              <th>{currentQuestionIndex - 1} Question</th>
              <th>Your Answer</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={index}>
                <td>{q.question}</td>
                <td>{answers[index] || "No answer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const question = questions[currentQuestionIndex];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>
        {currentQuestionIndex + 1}.{" "}
        {question.question.charAt(0).toUpperCase() + question.question.slice(1)}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxWidth: 300,
        }}
      >
        {question.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(choice)}
            disabled={!isAnswerable}
            style={{
              cursor: "pointer",
              backgroundColor: "blue",
              padding: "8px 10px",
              color: "white",
              borderRadius: "5px",
              border: "none",
            }}
          >
            {choice.charAt(0).toUpperCase() + choice.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <p>Time left: {timer}</p>
        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          style={{
            cursor: "pointer",
            backgroundColor: "grey",
            padding: "8px 10px",
            color: "white",
            borderRadius: "5px",
            border: "none",
          }}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default Exam;
