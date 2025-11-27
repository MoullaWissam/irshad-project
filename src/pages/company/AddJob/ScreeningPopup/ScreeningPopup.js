import React, { useEffect, useState } from "react";
import "./ScreeningPopup.css";

import Toast from "./Toast";
import DurationSlider from "./DurationSlider";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

export default function ScreeningPopup({
  onClose,
  onSave,
  initialQuestions = [],
  initialDuration = 6,
}) {
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(initialDuration);

  const [form, setForm] = useState({
    question: "",
    correct: "",
    wrong1: "",
    wrong2: "",
    wrong3: "",
  });

  const [editingIndex, setEditingIndex] = useState(-1);
  const [toast, setToast] = useState({ type: "", text: "" });

  const [errors, setErrors] = useState({});

  // تحميل البيانات الأولية
  useEffect(() => {
    setQuestions(initialQuestions);
    setDuration(initialDuration);
  }, [initialQuestions, initialDuration]);

  // إخفاء التوست تلقائيًا بعد 3 ثواني
  useEffect(() => {
    if (toast.text) {
      const t = setTimeout(() => setToast({ type: "", text: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // دالة التحقق من صحة المدخلات
  const validateForm = () => {
    let e = {};

    if (!form.question.trim()) e.question = "Question is required.";
    if (!form.correct.trim()) e.correct = "Correct answer is required.";

    const wrongs = [form.wrong1, form.wrong2, form.wrong3].map((w) => w.trim());
    if (!wrongs.some((w) => w.length > 0))
      e.wrong = "At least one wrong answer is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // إضافة سؤال جديد
  const handleAdd = () => {
    if (!validateForm()) {
      setToast({
        type: "error",
        text: "⚠️ Please fix the highlighted errors.",
      });
      return;
    }

    const formatted = {
      question: form.question.trim(),
      answers: [
        { text: form.correct.trim(), isCorrect: true },
        ...[form.wrong1, form.wrong2, form.wrong3]
          .map((w) => w.trim())
          .filter((t) => t.length > 0)
          .map((t) => ({ text: t, isCorrect: false })),
      ],
    };

    setQuestions((prev) => [...prev, formatted]);

    setForm({ question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" });
    setEditingIndex(-1);
    setErrors({});
    setToast({ type: "success", text: "✅ Question added successfully!" });
  };

  // بدء التعديل
  const handleStartEdit = (index) => {
    const q = questions[index];
    if (!q) return;

    const correctItem = q.answers.find((a) => a.isCorrect) || { text: "" };
    const wrongItems = q.answers.filter((a) => !a.isCorrect).map((a) => a.text);

    setForm({
      question: q.question,
      correct: correctItem.text || "",
      wrong1: wrongItems[0] || "",
      wrong2: wrongItems[1] || "",
      wrong3: wrongItems[2] || "",
    });

    setEditingIndex(index);
    setErrors({});
  };

  // تحديث سؤال
  const handleUpdate = () => {
    if (!validateForm()) {
      setToast({
        type: "error",
        text: "⚠️ Please fix the highlighted errors.",
      });
      return;
    }

    const updated = {
      question: form.question.trim(),
      answers: [
        { text: form.correct.trim(), isCorrect: true },
        ...[form.wrong1, form.wrong2, form.wrong3]
          .map((w) => w.trim())
          .filter((t) => t.length > 0)
          .map((t) => ({ text: t, isCorrect: false })),
      ],
    };

    const copy = [...questions];
    copy[editingIndex] = updated;

    setQuestions(copy);
    setForm({ question: "", correct: "", wrong1: "", wrong2: "", wrong3: "" });
    setEditingIndex(-1);
    setErrors({});
    setToast({ type: "success", text: "✅ Question updated successfully!" });
  };

  // حذف سؤال
  const handleDelete = (index) => {
    const copy = questions.filter((_, i) => i !== index);
    setQuestions(copy);

    if (editingIndex === index) {
      setForm({
        question: "",
        correct: "",
        wrong1: "",
        wrong2: "",
        wrong3: "",
      });
      setEditingIndex(-1);
    }

    setToast({ type: "success", text: "🗑️ Question deleted." });
  };

  // حفظ الاختبار
  const handleSaveTest = () => {
    if (questions.length === 0) {
      setToast({
        type: "error",
        text: "⚠️ Add at least one question before saving.",
      });
      return;
    }
    onSave({ questions, duration });
    setToast({ type: "success", text: "✅ Test saved!" });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2 style={{ marginTop: 0 }}>Screening Questions</h2>

        <Toast toast={toast} />

        <DurationSlider duration={duration} setDuration={setDuration} />

        <QuestionList
          questions={questions}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
        />

        <QuestionForm
          form={form}
          setForm={setForm}
          editingIndex={editingIndex}
          errors={errors}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancel={() => {
            setEditingIndex(-1);
            setForm({
              question: "",
              correct: "",
              wrong1: "",
              wrong2: "",
              wrong3: "",
            });
            setErrors({});
          }}
        />

        <div style={{ marginTop: 14 }}>
          <button className="save-btn" onClick={handleSaveTest}>
            Save Test & Close
          </button>
        </div>
      </div>
    </div>
  );
}
