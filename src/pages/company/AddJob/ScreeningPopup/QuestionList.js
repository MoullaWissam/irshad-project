import React from "react";

export default function QuestionList({ questions, onEdit, onDelete }) {
  if (questions.length === 0) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      {questions.map((q, idx) => (
        <div key={idx} className="question-block">
          <div className="question-header">
            <h4 style={{ margin: 0 }}>Q{idx + 1}</h4>
            <div>
              <button className="edit-btn" onClick={() => onEdit(idx)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => onDelete(idx)}>
                Delete
              </button>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 600 }}>{q.question}</div>
            <ul style={{ paddingLeft: 18, marginTop: 8 }}>
              {q.answers.map((a, i) => (
                <li key={i} style={{ color: a.isCorrect ? "#33d47c" : "#fff" }}>
                  {a.text} {a.isCorrect ? "(Correct)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
