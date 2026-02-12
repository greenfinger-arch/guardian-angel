import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '../data/questions';

const Test = ({ onComplete }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userScores, setUserScores] = useState({ S: 0, M: 0, A: 0, F: 0 });

    const handleAnswer = (effects) => {
        const updatedScores = {
            S: userScores.S + (effects.S || 0),
            M: userScores.M + (effects.M || 0),
            A: userScores.A + (effects.A || 0),
            F: userScores.F + (effects.F || 0),
        };

        if (currentIdx + 1 < questions.length) {
            setUserScores(updatedScores);
            setCurrentIdx(currentIdx + 1);
        } else {
            onComplete(updatedScores);
        }
    };

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <Container>
            {/* 상단 프로그레스 바 영역 */}
            <ProgressWrapper>
                <div className="bar-bg">
                    <ProgressBar fill={progress} />
                </div>
                <span className="count-text">{currentIdx + 1} / {questions.length}</span>
            </ProgressWrapper>

            <AnimatePresence mode="wait">
                <QuestionBox
                    key={currentIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                >
                    <ImageFrame>
                        <img
                            src={process.env.PUBLIC_URL + currentQuestion.image}
                            alt="수호천사 테스트 상황"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/600x400?text=Exploring+the+Forest...";
                            }}
                        />
                    </ImageFrame>

                    <QuestionTitle>
                        {currentQuestion.question}
                    </QuestionTitle>

                    <AnswerGroup>
                        {currentQuestion.answers.map((answer, index) => (
                            <AnswerButton
                                key={index}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(answer.effects)}
                            >
                                <span className="bullet">✦</span>
                                {answer.text}
                            </AnswerButton>
                        ))}
                    </AnswerGroup>
                </QuestionBox>
            </AnimatePresence>
        </Container>
    );
};

export default Test;

// --- 🎨 스타일 컴포넌트 (정의 누락 없이 완벽 정돈) ---

const Container = styled.div`
  width: 100%;
  max-width: 450px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: transparent; /* App.jsx의 배경색을 따름 */
`;

const ProgressWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
  .bar-bg {
    width: 100%;
    height: 4px;
    background: #e8e2d0;
    border-radius: 10px;
    overflow: hidden; /* 게이지가 삐져나오지 않게 함 */
  }
  .count-text {
    display: block;
    text-align: right;
    font-size: 0.75rem;
    color: #8c7b6c;
    margin-top: 5px;
    font-family: 'Gowun Batang', serif;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.fill}%;
  background: #7aa896;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const QuestionBox = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageFrame = styled.div`
  width: 100%;
  height: 25vh; 
  max-height: 200px; 
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #e8e2d0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const QuestionTitle = styled.h2`
  font-family: 'Gowun Batang', serif;
  font-size: 1.15rem;
  color: #3e3a36;
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: center;
  word-break: keep-all;
  min-height: 3.2em; /* 질문이 두 줄이 되어도 레이아웃 유지 */
`;

const AnswerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const AnswerButton = styled(motion.button)`
  width: 100%;
  padding: 14px 18px; 
  background: #ffffff;
  border: 1px solid #e8e2d0;
  border-radius: 12px;
  font-family: 'Gowun Batang', serif;
  font-size: 0.95rem;
  color: #5d5750;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);

  .bullet {
    margin-right: 10px;
    color: #7aa896;
    font-size: 0.8rem;
  }

  &:hover {
    background-color: #fdfcf8;
    border-color: #7aa896;
  }
`;