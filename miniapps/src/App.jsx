import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, Disc, Hand, Brush, Flower2 } from 'lucide-react';
import { STEP_INSIGHTS } from './data/stepInsights.js';
import { LEXICON_PACKS } from './data/lexiconData.js';
import { pickLocalizedInsight } from './utils/pickLocalizedInsight.js';
import { useAccessExplanationLocale } from './hooks/useAccessExplanationLocale.js';
import { EXPLAIN_LANG_LABEL_KO } from './constants/languageLabels.js';
import { StoryTypingReveal } from './components/StoryTypingReveal.jsx';
import { TypingLexiconGrammarCard } from './components/TypingLexiconGrammarCard.jsx';
import { FloatingLeadForm } from './components/FloatingLeadForm.jsx';

const STORY_DATA = {
  bamboo: {
    id: 'bamboo', title: '대나무의 비밀', icon: <TreePine />, color: '#2D5A27',
    heroSrc: '/story-images/bamboo.png',
    steps: [
      { type: 'episode', label: '1. 에피소드', content: '남들은 앞서가는데 나만 제자리인 것 같아 불안한 날입니다.' },
      { type: 'expression', label: '2. 마음 표현', content: '"나만 너무 느린 것 같아 불안해요."' },
      { type: 'wisdom', label: '3. 동화의 지혜', content: '"겉으로 보이진 않지만 나는 매일매일 땅속 깊숙이 뿌리를 내리고 있어."', src: '대나무의 비밀 中' },
      { type: 'recommend', label: '4. 추천 문장', content: '지금은 발밑에 있지만, 나는 열심히 자라고 있어요.' },
      { type: 'vocab', label: '5. 단어', pack: 'bamboo-vocab' },
      { type: 'grammar', label: '6. 문법', pack: 'bamboo-grammar' },
      { type: 'culture', label: '7. 한국 문화', content: '한국의 "빨리빨리"와 "대기만성" 문화' }
    ]
  },
  wheel: { 
    id: 'wheel', title: '자동차의 비밀', icon: <Disc />, color: '#34495E',
    heroSrc: '/story-images/wheel.png',
    steps: [
      { type: 'episode', label: '1. 에피소드', content: '친구와 의견이 맞지 않아 화가 난 상황입니다.' },
      { type: 'expression', label: '2. 마음 표현', content: '"진짜 속상해요. 앞바퀴가 원망스러워요."' },
      { type: 'wisdom', label: '3. 동화의 지혜', content: '"우린 함께 달리는 것을 좋아하잖아! 다음에도 너랑 함께 달릴 수 있도록 도와줘."', src: '자동차 바퀴의 비밀 中' },
      { type: 'recommend', label: '4. 추천 문장', content: '혼자 달리는 것보다 함께 달리는 것이 훨씬 즐거워요.' },
      { type: 'vocab', label: '5. 단어', pack: 'wheel-vocab' },
      { type: 'grammar', label: '6. 문법', pack: 'wheel-grammar' },
      { type: 'culture', label: '7. 한국 문화', content: '공동체 의식과 "우리" 문화' }
    ]
  },
  gloves: {
    id: 'gloves', title: '반코팅 장갑의 비밀', icon: <Hand />, color: '#E74C3C',
    heroSrc: '/story-images/gloves.png',
    steps: [
      { type: 'episode', label: '1. 에피소드', content: '꿈은 크지만 지금 하는 일이 초라해 보이는 날입니다.' },
      { type: 'wisdom', label: '3. 동화의 지혜', content: '"다른 애들이 하는 말 때문에 우리의 꿈을 잃지는 말자!"', src: '반코팅 장갑의 비밀 中' },
      { type: 'recommend', label: '4. 추천 문장', content: '정성을 다해 내일로 가는 문을 만들고 있어요.' },
      { type: 'vocab', label: '5. 단어', pack: 'gloves-vocab' },
      { type: 'grammar', label: '6. 문법', pack: 'gloves-grammar' },
      { type: 'culture', label: '7. 한국 문화', content: '진정성을 소중히 하는 장인 정신' },
      { type: 'finish', label: '완료', content: '꿈을 향한 정성을 응원합니다!' }
    ]
  },
  broom: {
    id: 'broom', title: '야구장 빗자루의 비밀', icon: <Brush />, color: '#8E44AD',
    heroSrc: '/story-images/broom.png',
    steps: [
      { type: 'episode', label: '1. 에피소드', content: '실력이 부족한 것 같아 적당히 타협하고 싶은 날입니다.' },
      { type: 'wisdom', label: '3. 동화의 지혜', content: '"충분한 것으로는 부족해, 난 홈런을 치고 싶은 거야!"', src: '야구장 빗자루의 비밀 中' },
      { type: 'recommend', label: '4. 추천 문장', content: '충분한 것에 안주하지 않고, 더 연습하기로 했어요.' },
      { type: 'vocab', label: '5. 단어', pack: 'broom-vocab' },
      { type: 'grammar', label: '6. 문법', pack: 'broom-grammar' },
      { type: 'culture', label: '7. 한국 문화', content: '끝날 때까지 끝난 게 아닌 열정' }
    ]
  },
  bee: {
    id: 'bee', title: '꿀벌의 비밀', icon: <Flower2 />, color: '#F1C40F',
    heroSrc: '/story-images/bee.png',
    steps: [
      { type: 'episode', label: '1. 에피소드', content: '같은 상황에서 친구와 기억이 달라 답답한 날입니다.' },
      { type: 'wisdom', label: '3. 동화의 지혜', content: '"장미 꽃밭을 다녀온 거야, 아니면 가시밭을 다녀온 거야? 이상한걸!"', src: '꿀벌의 비밀 中' },
      { type: 'recommend', label: '4. 추천 문장', content: '우리는 서로 다른 것을 보았을 뿐, 둘 다 틀린 게 아니었어요.' },
      { type: 'vocab', label: '5. 단어', pack: 'bee-vocab' },
      { type: 'grammar', label: '6. 문법', pack: 'bee-grammar' },
      { type: 'culture', label: '7. 한국 문화', content: '입장을 바꿔 생각하는 역지사지' }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('bamboo');
  const [visibleSteps, setVisibleSteps] = useState(1);
  const localeInfo = useAccessExplanationLocale();

  const steps = STORY_DATA[activeTab].steps;
  const maxSteps = steps.length;

  const handleTabChange = (id) => {
    setActiveTab(id);
    setVisibleSteps(1);
    window.scrollTo(0,0);
  };

  /** 다음 카드까지 펼침 — 스토리마다 카드 개수가 달라 maxSteps 반영 */
  const nextStep = () => {
    setVisibleSteps((v) => (v < maxSteps ? v + 1 : v));
  };

  const explainLabel =
    EXPLAIN_LANG_LABEL_KO[localeInfo.explanationLocale] ?? localeInfo.explanationLocale;

  const localeStatusLine = localeInfo.isLoading
    ? '접속 지역을 확인하는 중입니다…'
    : localeInfo.source === 'url-preview'
      ? `해설 언어: ${explainLabel} · URL 미리보기 (${localeInfo.countryName ?? localeInfo.countryCode ?? 'simulate'})`
    : localeInfo.source === 'ip'
      ? `해설 언어: ${explainLabel} · 추정 지역 ${localeInfo.countryName ?? localeInfo.countryCode}`
      : `해설 언어: ${explainLabel} · IP 미확인(브라우저 언어 기준)`;

  return (
    <div className="container">
      <header className="header">
        <h1>SOUL DIARY</h1>
        <p className="locale-line" aria-live="polite">{localeStatusLine}</p>
        <nav className="tabs" aria-label="동화 선택">
          <div className="tabs-scroll">
            {Object.values(STORY_DATA).map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => handleTabChange(tab.id)}
                style={{ '--c': tab.color }}
              >
                <div className="icon">{tab.icon}</div>
                <span className="tabs-label">{tab.title}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* 탭(스토리)별 대표 일러스트 — 네비와 본문 카드(에피소드) 사이 */}
      <section className="story-hero" aria-label={`${STORY_DATA[activeTab].title} 대표 이미지`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="story-hero-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <img
              src={STORY_DATA[activeTab].heroSrc}
              alt=""
              className="story-hero-img"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </AnimatePresence>
        <p className="story-hero-caption">{STORY_DATA[activeTab].title}</p>
      </section>

      <main className="content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {steps.slice(0, visibleSteps).map((s, i) => {
              const insightKey = `${activeTab}-${i}`;
              const insights = s.pack ? undefined : STEP_INSIGHTS[insightKey];
              const picked =
                insights && pickLocalizedInsight(insights, localeInfo.explanationLocale);
              const lexEntries =
                typeof s.pack === 'string'
                  ? (LEXICON_PACKS[s.pack] ?? [])
                  : [];
              const useLexiconCard =
                Boolean(s.pack) && Array.isArray(lexEntries) && lexEntries.length > 0;

              const isLatestReveal = i === visibleSteps - 1;
              const fallbackNote =
                picked && picked.usedLocale !== localeInfo.explanationLocale
                  ? `${EXPLAIN_LANG_LABEL_KO[localeInfo.explanationLocale] ?? localeInfo.explanationLocale} 해설이 없어 ${EXPLAIN_LANG_LABEL_KO[picked.usedLocale] ?? picked.usedLocale}로 표시합니다.`
                  : null;
              return (
              <div key={i} className={`card ${s.type}`}>
                {useLexiconCard ? (
                  <TypingLexiconGrammarCard
                    label={s.label}
                    entries={lexEntries}
                    preferredLocale={localeInfo.explanationLocale}
                    animated={isLatestReveal}
                  />
                ) : s.pack ? (
                  <p className="insight-note">
                    이 단어·문법 카드 데이터를 찾을 수 없습니다. 패키지 키를 확인해 주세요.
                  </p>
                ) : (
                  <StoryTypingReveal
                    animated={isLatestReveal}
                    label={s.label}
                    content={s.content}
                    src={s.src}
                    insightText={picked?.text}
                    insightLang={picked?.usedLocale}
                    fallbackNote={fallbackNote}
                  />
                )}
                {isLatestReveal && i < steps.length - 1 &&
                 <button type="button" className="btn" onClick={nextStep}>Next Step</button>}
              </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingLeadForm explanationLocale={localeInfo.explanationLocale} />
    </div>
  );
}
