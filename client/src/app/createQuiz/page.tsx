'use client'
import React from 'react'

const Page = () => {
  return (
    <div>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Create New Quiz</h2>
        </div>
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="quiz-title">Quiz Title</label>
              <input id="quiz-title" placeholder="Enter quiz title" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions</h3>
                <button>Add Question</button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="question-1">Question 1</label>
                  <input id="question-1" placeholder="Enter question text" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="answer-1-a">Answer A</label>
                  <input id="answer-1-a" placeholder="Enter answer option" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="answer-1-b">Answer B</label>
                  <input id="answer-1-b" placeholder="Enter answer option" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="answer-1-c">Answer C</label>
                  <input id="answer-1-c" placeholder="Enter answer option" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="answer-1-d">Answer D</label>
                  <input id="answer-1-d" placeholder="Enter answer option" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="correct-answer-1">Correct Answer</label>
                  <select id="correct-answer-1">
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit">Save Quiz</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page
