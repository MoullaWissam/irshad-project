import React from "react";

export default function QuestionForm({
  form,
  setForm,
  editingIndex,
  errors,
  onAdd,
  onUpdate,
  onCancel,
}) {
  return (
    <div className="question-block" style={{ background: "#27407c" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0 }}>
          {editingIndex >= 0 ? "Edit Question" : "New Question"}
        </h4>
        {editingIndex >= 0 && (
          <small style={{ color: "#ffeb99" }}>
            Editing Q{editingIndex + 1}
          </small>
        )}
      </div>

      {/* QUESTION */}
      <label>Question</label>
      <input
        type="text"
        value={form.question}
        className={errors.question ? "input-error" : ""}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
      />
      {errors.question && (
        <small className="error-msg">{errors.question}</small>
      )}

      {/* CORRECT ANSWER */}
      <label style={{ marginTop: 8 }}>Correct Answer</label>
      <input
        type="text"
        value={form.correct}
        className={errors.correct ? "input-error" : ""}
        onChange={(e) => setForm({ ...form, correct: e.target.value })}
      />
      {errors.correct && <small className="error-msg">{errors.correct}</small>}

      {/* WRONG ANSWERS */}
      <label style={{ marginTop: 8 }}>Wrong Answers (at least one)</label>

      <input
        type="text"
        value={form.wrong1}
        onChange={(e) => setForm({ ...form, wrong1: e.target.value })}
      />
      <input
        type="text"
        value={form.wrong2}
        onChange={(e) => setForm({ ...form, wrong2: e.target.value })}
      />
      <input
        type="text"
        value={form.wrong3}
        onChange={(e) => setForm({ ...form, wrong3: e.target.value })}
      />

      {errors.wrong && <small className="error-msg">{errors.wrong}</small>}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {editingIndex >= 0 ? (
          <>
            <button className="add-btn" onClick={onUpdate}>
              Update Question
            </button>
            <button className="delete-btn" onClick={onCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="add-btn" onClick={onAdd}>
            + Add Question
          </button>
        )}
      </div>
    </div>
  );
}
