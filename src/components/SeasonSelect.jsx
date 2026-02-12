import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SeasonSelect = ({ onSelect }) => {
    // 계절별 데이터 (이름, 색상, 감성 문구)
    const seasons = [
        { id: 'Spring', name: '봄', color: '#eef7f2', label: '꽃피는 시작' },
        { id: 'Summer', name: '여름', color: '#fff9e6', label: '푸른 생명력' },
        { id: 'Autumn', name: '가을', color: '#fdf2e9', label: '익어가는 마음' },
        { id: 'Winter', name: '겨울', color: '#f0f4f8', label: '하얀 기다림' }
    ];

    return (
        <Container
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
        >
            <Title>당신이 태어난<br />계절의 온기를 알려주세요</Title>
            <Description>그 계절의 기운이 당신의 수호천사를 결정합니다.</Description>

            <Grid>
                {seasons.map((s) => (
                    <SeasonCard
                        key={s.id}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(s.id)}
                        $bg={s.color}
                    >
                        <span className="name">{s.name}</span>
                        <span className="label">{s.label}</span>
                    </SeasonCard>
                ))}
            </Grid>
        </Container>
    );
};

export default SeasonSelect;

// --- 스타일 컴포넌트 ---
const Container = styled(motion.div)`
  text-align: center;
  padding: 20px;
`;

const Title = styled.h2`
  color: #5a5a5a;
  line-height: 1.5;
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 1.6rem;
`;

const Description = styled.p`
  color: #a0a0a0;
  font-size: 0.9rem;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
  max-width: 400px;
`;

const SeasonCard = styled(motion.div)`
  background: ${props => props.$bg};
  padding: 45px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0,0,0,0.02);
  
  .name {
    font-size: 1.6rem;
    font-weight: bold;
    color: #4a4a4a;
    margin-bottom: 8px;
  }
  
  .label {
    font-size: 0.8rem;
    color: #888;
  }
`;