import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { angels } from '../data/angels';

const Result = ({ season, scores, onRestart }) => {
  const [shareMessage, setShareMessage] = useState('');

  // 1. 매칭 로직 (정교화된 버전)
  const matchedAngel = useMemo(() => {
    const { S, M, A, F } = scores;
    const userStats = [
      { type: 'S', val: S },
      { type: 'M', val: M },
      { type: 'A', val: A },
      { type: 'F', val: F }
    ].sort((a, b) => b.val - a.val);

    const top1 = userStats[0];
    const top2 = userStats[1];

    const scoredList = angels.map(angel => {
      let matchPoint = 0;
      const angelType = angel.type.toUpperCase();

      if (angelType === top1.type) matchPoint += 10;
      if (top2.val > 0 && angelType === top2.type) matchPoint += 3;
      if (angel.season === season) matchPoint += 5;

      if (angel.rank === 'Rare' && angelType === top1.type) {
        matchPoint += top1.val >= 7 ? 2 : -2;
      }

      matchPoint += Math.random();
      return { ...angel, matchPoint };
    });

    return scoredList.sort((a, b) => b.matchPoint - a.matchPoint)[0];
  }, [season, scores]);

  // 2. 공유하기 기능 (Web Share API 및 클립보드)
  const handleShare = async () => {
    const shareData = {
      title: `나의 수호천사는 [${matchedAngel.name}] 입니다.`,
      text: `지브리풍 수호천사 테스트 결과: ${matchedAngel.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        setShareMessage('링크가 복사되었습니다!');
        setTimeout(() => setShareMessage(''), 2000);
      }
    } catch (err) {
      console.log('공유 실패:', err);
    }
  };

  if (!matchedAngel) return <LoadingText>인연의 실을 찾는 중입니다...</LoadingText>;

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HeaderSection>
        <SeasonBadge>{season} Guardian</SeasonBadge>
        <MainTitle>당신의 곁을 지키는 수호천사</MainTitle>
      </HeaderSection>

      <AngelCard
        $rank={matchedAngel.rank}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="image-frame">
          <img
            src={process.env.PUBLIC_URL + matchedAngel.image}
            alt={matchedAngel.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=Searching+Angel...";
            }}
          />
        </div>
        <div className="info-section">
          <span className="rank-tag">{matchedAngel.rank} Spirit</span>
          <h3 className="name">{matchedAngel.name}</h3>
          <p className="description">"{matchedAngel.description}"</p>
        </div>
      </AngelCard>

      <MessageSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="advice-box">
          <h4>📜 천사의 조언</h4>
          <p>{matchedAngel.advice}</p>
        </div>

        <ButtonGroup>
          <ShareButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
          >
            <i className="fas fa-share-alt"></i> 결과 공유하기
          </ShareButton>

          <RestartButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
          >
            새로운 인연 맺기
          </RestartButton>
        </ButtonGroup>

        <AnimatePresence>
          {shareMessage && (
            <ToastMessage
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {shareMessage}
            </ToastMessage>
          )}
        </AnimatePresence>
      </MessageSection>
    </Container>
  );
};

export default Result;

// --- 🎨 Styled Components ---

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 80px; /* 하단 여백 충분히 */
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  /* 핵심: 배경색을 제거하거나 아주 투명하게 설정 */
  background: transparent;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 35px;
`;

const SeasonBadge = styled.span`
  background: rgba(122, 168, 150, 0.15);
  color: #5c8b7a;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  border: 1px solid rgba(122, 168, 150, 0.2);
`;

const MainTitle = styled.h2`
  font-family: 'Gowun Batang', serif;
  color: #3e3a36;
  margin-top: 18px;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
`;

const AngelCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0,0,0,0.06);
  border: 1px solid rgba(232, 226, 208, 0.6);
  position: relative;

  .image-frame {
    width: 100%;
    aspect-ratio: 4 / 4.5; /* 세로가 약간 긴 포토카드 비율 */
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info-section {
    padding: 35px 25px;
    text-align: center;

    .rank-tag {
      font-size: 0.75rem;
      letter-spacing: 2px;
      font-weight: 800;
      color: ${props => props.$rank === 'Rare' ? '#b89241' : '#8c867c'};
      background: ${props => props.$rank === 'Rare' ? '#fff9e6' : '#f0efeb'};
      padding: 4px 12px;
      border-radius: 50px;
    }

    .name {
      font-family: 'Gowun Batang', serif;
      font-size: 1.8rem;
      color: #2e2b28;
      margin: 18px 0 12px;
    }

    .description {
      font-family: 'Gowun Batang', serif;
      font-size: 1.05rem;
      color: #5d5750;
      line-height: 1.7;
      word-break: keep-all;
    }
  }
`;

const MessageSection = styled(motion.div)`
  width: 100%;
  margin-top: 25px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 35px;
`;

const ShareButton = styled(motion.button)`
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: 1.5px solid #7aa896;
  background: #ffffff;
  color: #7aa896;
  font-family: 'Gowun Batang', serif;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i { margin-right: 10px; }
`;

const RestartButton = styled(motion.button)`
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: #4a453f;
  color: #fdfaf1;
  font-family: 'Gowun Batang', serif;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
`;

const ToastMessage = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  font-size: 0.9rem;
  z-index: 100;
`;

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #7aa896;
  font-family: 'Gowun Batang', serif;
`;