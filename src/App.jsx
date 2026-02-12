import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import SeasonSelect from './components/SeasonSelect';
import Test from './components/Test';
import Result from './components/Result';

// --- 1. 애니메이션 정의 ---

const grain = keyframes`
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  30% { transform: translate(-2%, 1%); }
  50% { transform: translate(1%, -2%); }
  70% { transform: translate(2%, 1%); }
  90% { transform: translate(-1%, 2%); }
`;

const ambientGlow = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; scale: 1; }
  50% { opacity: 0.6; scale: 1.2; }
`;

// --- 2. 전역 스타일 ---

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Gowun Batang', 'Nanum Myeongjo', serif;
    color: #4a453f;
    background-color: #fdfaf1;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  .fa-share-alt { margin-right: 8px; }
`;

const STEPS = {
  HOME: 'HOME',
  SEASON: 'SEASON',
  TEST: 'TEST',
  RESULT: 'RESULT'
};

function App() {
  const [step, setStep] = useState(STEPS.HOME);
  const [season, setSeason] = useState('');
  const [scores, setScores] = useState({ S: 0, M: 0, A: 0, F: 0 });

  // 오디오 객체 관리
  const [bgm] = useState(new Audio(`${process.env.PUBLIC_URL}/sounds/bgm.mp3`));
  const [isMuted, setIsMuted] = useState(false);

  // 통합된 시작 핸들러
  const handleStart = () => {
    bgm.loop = true;
    bgm.volume = 0.4;
    bgm.play().catch(e => console.log("오디오 재생 실패:", e));
    setStep(STEPS.SEASON);
  };

  const toggleMute = () => {
    bgm.muted = !bgm.muted;
    setIsMuted(!isMuted);
  };

  const handleSeasonSelect = (selectedSeason) => {
    setSeason(selectedSeason);
    setStep(STEPS.TEST);
  };

  const handleTestComplete = (finalScores) => {
    setScores(finalScores);
    setStep(STEPS.RESULT);
  };

  const handleRestart = () => {
    setStep(STEPS.HOME);
    setSeason('');
    setScores({ S: 0, M: 0, A: 0, F: 0 });
    // 다시 시작할 때 음악을 처음부터 재생하고 싶다면 아래 코드 추가
    // bgm.currentTime = 0;
  };

  return (
    <>
      <GlobalStyle />
      <GrainOverlay />
      <AmbientLight />

      {step !== STEPS.HOME && (
        <MuteButton onClick={toggleMute}>
          <i className={isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
        </MuteButton>
      )}

      <AppContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.7 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {step === STEPS.HOME && (
              <HomeWrapper>
                <Particle className="p1" />
                <Particle className="p2" />
                <Particle className="p3" />
                <HeroSection>
                  <Badge
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Ghibli Inspired
                  </Badge>
                  <MainTitleText>나의 수호천사</MainTitleText>
                  <SubtitleText>
                    포근한 수채화 속에서 당신을 기다리는<br />
                    인연의 목소리를 들어보세요.
                  </SubtitleText>
                  <StartButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                  >
                    여정 시작하기
                  </StartButton>
                </HeroSection>
              </HomeWrapper>
            )}

            {step === STEPS.SEASON && <SeasonSelect onSelect={handleSeasonSelect} />}
            {step === STEPS.TEST && <Test onComplete={handleTestComplete} />}
            {step === STEPS.RESULT && (
              <Result season={season} scores={scores} onRestart={handleRestart} />
            )}
          </motion.div>
        </AnimatePresence>
      </AppContainer>
    </>
  );
}

// --- 3. 스타일 컴포넌트 ---

const GrainOverlay = styled.div`
  position: fixed;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
  opacity: 0.04;
  animation: ${grain} 0.6s steps(1) infinite;
  pointer-events: none;
  z-index: 1000;
`;

const AmbientLight = styled.div`
  position: fixed;
  top: -10%; right: -10%;
  width: 60vw; height: 60vw;
  background: radial-gradient(circle, #e2efea 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: -1;
  animation: ${ambientGlow} 10s infinite ease-in-out;
  pointer-events: none;
`;

const AppContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
`;

const HomeWrapper = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
`;

const HeroSection = styled.div`
  background: rgba(255, 255, 255, 0.4);
  padding: 50px 20px;
  border-radius: 30px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
`;

const Badge = styled(motion.span)`
  display: inline-block;
  background: #7aa896;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MainTitleText = styled.h1`
  font-family: 'Gowun Batang', serif;
  font-size: 2.8rem;
  color: #4a453f;
  margin: 0 0 20px 0;
  font-weight: 700;
  line-height: 1.2;
  animation: ${float} 4s ease-in-out infinite;
`;

const SubtitleText = styled.p`
  font-family: 'Gowun Batang', serif;
  font-size: 1.1rem;
  color: #8c7b6c;
  line-height: 1.6;
  margin-bottom: 40px;
`;

const StartButton = styled(motion.button)`
  padding: 18px 60px;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #7aa896;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
`;

const Particle = styled.div`
  position: absolute;
  background: #cbdad5;
  border-radius: 50%;
  filter: blur(3px);
  animation: ${sparkle} 4s infinite ease-in-out;
  
  &.p1 { width: 40px; height: 40px; top: -5%; left: 0%; }
  &.p2 { width: 60px; height: 60px; bottom: -5%; right: 0%; animation-delay: 1s; }
  &.p3 { width: 30px; height: 30px; top: 30%; right: -5%; animation-delay: 2s; }
`;

const MuteButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1100;
  color: #7aa896;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

export default App;