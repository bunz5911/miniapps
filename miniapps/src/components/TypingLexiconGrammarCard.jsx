import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { pickLocalizedInsight } from '../utils/pickLocalizedInsight.js'
import { stripCitationMarkers } from '../utils/stripCitationMarkers.js'
import { EXPLAIN_LANG_LABEL_KO } from '../constants/languageLabels.js'

const MS_LABEL = 14
const MS_BLOCK = 22
const MS_LOC = 22

function toGraphemes(s) {
  return [...(s ?? '')]
}

function typeSegment(graphemes, setText, ms, schedule, alive, onDone) {
  if (!graphemes.length) {
    schedule(
      window.setTimeout(() => {
        if (!alive.current) return
        onDone?.()
      }, 0),
    )
    return
  }

  let i = 0
  const step = () => {
    if (!alive.current) return
    i += 1
    setText(graphemes.slice(0, i).join(''))
    if (i >= graphemes.length) {
      schedule(
        window.setTimeout(() => {
          if (!alive.current) return
          onDone?.()
        }, 40),
      )
      return
    }
    schedule(window.setTimeout(step, ms))
  }
  schedule(window.setTimeout(step, ms))
}

function buildSegmentList(label, entries, preferredLocale) {
  const labelClean = stripCitationMarkers(label)
  const segs = [{ kind: 'label', text: labelClean, ms: MS_LABEL }]
  for (const e of entries) {
    const koBlob = `${e.lemma} [${e.pos}]\n${e.senseKo}\n예) ${e.exampleKo}`
    segs.push({ kind: 'ko', text: koBlob, ms: MS_BLOCK })
    const picked = pickLocalizedInsight(e.localeNotes, preferredLocale)
    if (picked?.text) {
      segs.push({
        kind: 'locale',
        text: picked.text,
        ms: MS_LOC,
        usedLocale: picked.usedLocale,
        wantedLocale: preferredLocale,
      })
    }
  }
  return segs
}

/**
 * 단어·문법 카드: 한국어 블록과 접속 언어 해설을 순서대로 타이핑합니다.
 */
export function TypingLexiconGrammarCard({
  label,
  entries,
  preferredLocale,
  animated,
}) {
  const prefersReduced = usePrefersReducedMotion()
  const isStaticDisplay = !animated || prefersReduced

  const segments = useMemo(
    () => buildSegmentList(label, entries, preferredLocale),
    [label, entries, preferredLocale],
  )

  /** 정적 카드는 effect 없이 즉시 보여 줄 세그먼트 스냅샷 */
  const staticSnapshot = useMemo(
    () => segments.map((s) => ({ ...s })),
    [segments],
  )

  const [committedAnim, setCommittedAnim] = useState([])
  const [draft, setDraft] = useState('')
  const [draftKind, setDraftKind] = useState(null)
  /** 진행 중인 해설 줄의 실제 표시 언어(BCP47) — draft 구간에서 lang 속성에 사용 */
  const [draftAsideLang, setDraftAsideLang] = useState(null)

  /** 타입라이터가 끝난 뒤에만 하단 안내(폴백) 표시 — 정적 카드는 항상 완료로 간주 */
  const [animTypingDone, setAnimTypingDone] = useState(false)

  const alive = useRef(true)
  const timeoutIdsRef = useRef([])

  const schedule = (id) => {
    timeoutIdsRef.current.push(id)
  }

  const anyLocaleFallback = entries.some((e) => {
    const p = pickLocalizedInsight(e.localeNotes, preferredLocale)
    return p && p.usedLocale !== preferredLocale
  })

  const fallbackNote = anyLocaleFallback
    ? `${EXPLAIN_LANG_LABEL_KO[preferredLocale] ?? preferredLocale} 해설이 없는 항목은 영어 등으로 대체되어 표시될 수 있습니다.`
    : null

  const visibleCommitted = isStaticDisplay ? staticSnapshot : committedAnim
  const showFallbackNote = (isStaticDisplay || animTypingDone) && fallbackNote

  useEffect(() => {
    if (isStaticDisplay) return

    alive.current = true
    for (const tid of timeoutIdsRef.current) window.clearTimeout(tid)
    timeoutIdsRef.current = []

    const segs = segments
    let idx = 0

    const runNext = () => {
      if (!alive.current || idx >= segs.length) {
        setDraft('')
        setDraftKind(null)
        setDraftAsideLang(null)
        setAnimTypingDone(true)
        return
      }
      const seg = segs[idx]
      setDraftKind(seg.kind)
      setDraftAsideLang(seg.kind === 'locale' ? (seg.usedLocale ?? 'und') : null)
      idx += 1
      typeSegment(
        toGraphemes(seg.text),
        setDraft,
        seg.ms ?? MS_BLOCK,
        schedule,
        alive,
        () => {
          if (!alive.current) return
          setCommittedAnim((c) => [...c, seg])
          setDraft('')
          setDraftKind(null)
          setDraftAsideLang(null)
          runNext()
        },
      )
    }

    const kickoff = window.setTimeout(() => {
      if (!alive.current) return
      setCommittedAnim([])
      setDraft('')
      setDraftKind(null)
      setDraftAsideLang(null)
      setAnimTypingDone(false)
      runNext()
    }, 0)
    timeoutIdsRef.current.push(kickoff)

    return () => {
      alive.current = false
      for (const tid of timeoutIdsRef.current) window.clearTimeout(tid)
      timeoutIdsRef.current = []
    }
  }, [segments, isStaticDisplay])

  const showCaret = !isStaticDisplay && draftKind !== null

  return (
    <>
      <div className="box lex-box">
        <div className="lex-stack">
          {visibleCommitted.map((seg, i) => (
            <SegmentBlock key={i} seg={seg} />
          ))}
          {draftKind !== null ? (
            <div
              className={`typing-line-wrap lex-draft-wrap ${showCaret ? 'typing-active' : ''} lex-draft-kind-${draftKind ?? 'unknown'}`}
            >
              {draftKind === 'label' ? (
                <div className="typing-line-wrap typing-label-row">
                  <div className="label">{draft}</div>
                  {showCaret ? <span className="typewriter-caret" aria-hidden="true" /> : null}
                </div>
              ) : draftKind === 'locale' ? (
                <aside className="lex-locale-aside lex-locale-draft" lang={draftAsideLang ?? 'und'}>
                  <span className="lex-locale-tag">해설</span>
                  <p>
                    {draft}
                    {showCaret ? <span className="typewriter-caret insight-caret" aria-hidden="true" /> : null}
                  </p>
                </aside>
              ) : (
                <div className={`typing-line-wrap lex-ko-wrap ${showCaret ? 'typing-active' : ''}`}>
                  <pre className="lex-ko-pre">{draft}</pre>
                  {showCaret ? <span className="typewriter-caret lex-ko-caret" aria-hidden="true" /> : null}
                </div>
              )}
            </div>
          ) : null}
        </div>
        {showFallbackNote ? <p className="insight-note">{fallbackNote}</p> : null}
      </div>
    </>
  )
}

function SegmentBlock({ seg }) {
  if (seg.kind === 'label') {
    return (
      <div className="typing-line-wrap typing-label-row">
        <div className="label">{seg.text}</div>
      </div>
    )
  }
  if (seg.kind === 'ko') {
    return (
      <div className="lex-ko-block">
        <pre className="lex-ko-pre">{seg.text}</pre>
      </div>
    )
  }
  return (
    <aside className="lex-locale-aside" lang={seg.usedLocale ?? 'und'}>
      <span className="lex-locale-tag">해설</span>
      <p>{seg.text}</p>
      {seg.usedLocale && seg.wantedLocale && seg.usedLocale !== seg.wantedLocale ? (
        <p className="lex-item-fallback">
          ({EXPLAIN_LANG_LABEL_KO[seg.wantedLocale] ?? seg.wantedLocale} →{' '}
          {EXPLAIN_LANG_LABEL_KO[seg.usedLocale] ?? seg.usedLocale})
        </p>
      ) : null}
    </aside>
  )
}
