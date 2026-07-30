'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What should you do if your dog starts mounting (humping) another dog?",
    options: [
      "Let them work it out, it's natural dominance.",
      "Laugh and take a video.",
      "Immediately redirect your dog's attention and calmly remove them.",
      "Yell at the other owner."
    ],
    correctAnswerIndex: 2,
    explanation: "Mounting can quickly escalate into a fight. Even if it's just over-excitement, the polite and safe thing to do is redirect your dog and give them a timeout to calm down."
  },
  {
    id: 2,
    question: "Should you bring your dog's favorite squeaky toy or ball to the park?",
    options: [
      "Yes, so they have something to play with.",
      "Only if they are good at sharing.",
      "No, toys can trigger resource guarding and fights.",
      "Yes, to distract other dogs."
    ],
    correctAnswerIndex: 2,
    explanation: "Bringing high-value toys or treats to a busy dog park is a recipe for disaster. It can trigger severe resource guarding and fights among dogs who don't know each other."
  },
  {
    id: 3,
    question: "Your puppy is 12 weeks old and has had two rounds of shots. Can they go to the dog park?",
    options: [
      "Yes, they need socialization early.",
      "Only if they stay in the small dog area.",
      "No, wait until they are fully vaccinated (around 16-18 weeks).",
      "Yes, if they are carried."
    ],
    correctAnswerIndex: 2,
    explanation: "Puppies are highly susceptible to Parvovirus and other diseases before their vaccination series is fully complete and has taken effect (usually 2 weeks after their 16-week shots)."
  },
  {
    id: 4,
    question: "When entering the dog park through the double gates, you should:",
    options: [
      "Open both gates quickly to run in.",
      "Wait until the first gate is closed before opening the second.",
      "Let other dogs into the staging area to greet your dog.",
      "Leave the leash on while playing inside."
    ],
    correctAnswerIndex: 1,
    explanation: "The double-gate system (sally port) is designed to prevent escapes. Never have both gates open at the same time, and never enter if the staging area is already occupied."
  },
  {
    id: 5,
    question: "While at the park, your primary focus should be on:",
    options: [
      "Catching up on emails on your phone.",
      "Chatting with other dog owners.",
      "Actively watching your dog's body language.",
      "Reading a book."
    ],
    correctAnswerIndex: 2,
    explanation: "Dog parks are not a time to check out. You must actively supervise your dog at all times to intercept bullying, read body language, and clean up their poop immediately."
  }
];

export default function DogParkEtiquetteQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quizQuestions[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const passed = score >= 4;
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 text-center max-w-2xl mx-auto">
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${passed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30'}`}>
          <i className={`bi ${passed ? 'bi-award-fill' : 'bi-x-circle-fill'} text-white text-5xl`}></i>
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
          {passed ? 'Certified Good Human!' : 'Needs a Little Training!'}
        </h2>
        <p className="text-xl text-slate-600 font-medium mb-6">
          You scored {score} out of {quizQuestions.length}
        </p>

        <p className="text-slate-600 mb-8 leading-relaxed">
          {passed 
            ? "Amazing job! You clearly understand canine body language, safety, and respect for others. You are exactly the type of owner every dog park needs."
            : "Dog parks can be chaotic, and it's easy to misunderstand etiquette. Review the explanations and try again to become a dog park pro!"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <i className="bi bi-arrow-counterclockwise mr-2"></i>
            Retake Quiz
          </button>
          {passed && (
            <Link
              href="/parks"
              className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-600/30"
            >
              <i className="bi bi-geo-alt-fill mr-2"></i>
              Find a Park Near You
            </Link>
          )}
        </div>

        {passed && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Share Your Certificate</p>
            <div className="flex justify-center gap-3">
              <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="bi bi-facebook"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="bi bi-twitter-x"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="bi bi-linkedin"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const q = quizQuestions[currentQuestion];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-3xl mx-auto">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </span>
        <div className="flex gap-1">
          {quizQuestions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i === currentQuestion ? 'bg-indigo-500' : i < currentQuestion ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="p-8 md:p-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">
          {q.question}
        </h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let btnClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white text-slate-700";
            
            if (showExplanation) {
              if (i === q.correctAnswerIndex) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
              } else if (i === selectedAnswer) {
                btnClass = "border-rose-300 bg-rose-50 text-rose-900";
              } else {
                btnClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
              }
            } else if (selectedAnswer === i) {
              btnClass = "border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswerSelect(i)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between group ${btnClass}`}
              >
                <span>{opt}</span>
                {showExplanation && i === q.correctAnswerIndex && (
                  <i className="bi bi-check-circle-fill text-emerald-500 text-xl shrink-0 ml-3"></i>
                )}
                {showExplanation && i === selectedAnswer && i !== q.correctAnswerIndex && (
                  <i className="bi bi-x-circle-fill text-rose-500 text-xl shrink-0 ml-3"></i>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 animate-fade-in">
            <div className={`p-5 rounded-xl border ${selectedAnswer === q.correctAnswerIndex ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className="flex items-start gap-3">
                <i className={`bi mt-0.5 text-lg ${selectedAnswer === q.correctAnswerIndex ? 'bi-check-circle-fill text-emerald-600' : 'bi-info-circle-fill text-rose-600'}`}></i>
                <div>
                  <h4 className={`font-bold mb-1 ${selectedAnswer === q.correctAnswerIndex ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {selectedAnswer === q.correctAnswerIndex ? 'Correct!' : 'Not quite.'}
                  </h4>
                  <p className={selectedAnswer === q.correctAnswerIndex ? 'text-emerald-800' : 'text-rose-800'}>
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={nextQuestion}
                className="px-8 py-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-2 ml-auto"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See My Results'}
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
