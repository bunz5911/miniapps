import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { stripCitationMarkers } from '../utils/stripCitationMarkers.js'

const MS_LABEL = 14
const MS_BODY = 24
const MS_SRC = 20
const MS_INSIGHT = 24

function toGraphemes(s) {
  return [...(s ?? '')]
}

function typeSegment(graphemes, setText, ms, schedule, alive, caretKey, setCaretAt, onDone) {
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
  if (alive.current) setCaretAt(caretKey)
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

/**
 * animated가 false이거나 시스템 모션 감소 설정이면 본문을 즉시 표시합니다.
 * animated가 true일 때만 라벨→본문→출처→해설 순 타입라이터를 재생합니다.
 */
export function StoryTypingReveal({
  label,
  content,
  src,
  insightText,
  insightLang,
  fallbackNote,
  animated,
}) {
  const prefersReduced = usePrefersReducedMotion()
  const isStaticDisplay = !animated || prefersReduced

  /** 인용 표시는 타입라이터·정적 표시 공통으로 제거한 문자열을 씁니다. */
  const displayLabel = useMemo(() => stripCitationMarkers(label), [label])
  const displayBody = useMemo(() => stripCitationMarkers(content), [content])
  const displaySrc = useMemo(() => stripCitationMarkers(src), [src])
  const displayInsight = useMemo(() => stripCitationMarkers(insightText), [insightText])

  const staticParts = {
    labelT: displayLabel,
    bodyT: displayBody,
    srcT: displaySrc,
    insT: displayInsight,
  }

  const [animParts, setAnimParts] = useState(() => ({
    labelT: '',
    bodyT: '',
    srcT: '',
    insT: '',
  }))
  const [caretAt, setCaretAt] = useState(null)
  /** 애니메이션 카드만 사용 — 정적 카드는 isStaticDisplay로 즉시 완료로 간주 */
  const [animTypingDone, setAnimTypingDone] = useState(false)

  const parts = isStaticDisplay ? staticParts : animParts
  const effectiveCaret = isStaticDisplay ? null : caretAt
  const showFallbackNote = (isStaticDisplay || animTypingDone) && fallbackNote

  const alive = useRef(true)
  const timeoutIdsRef = useRef([])

  const schedule = (id) => {
    timeoutIdsRef.current.push(id)
  }

  useEffect(() => {
    if (isStaticDisplay) return

    alive.current = true
    for (const tid of timeoutIdsRef.current) window.clearTimeout(tid)
    timeoutIdsRef.current = []

    const kickoff = window.setTimeout(() => {
      if (!alive.current) return
      setAnimParts({ labelT: '', bodyT: '', srcT: '', insT: '' })
      setCaretAt(null)
      setAnimTypingDone(false)

      const sequenceEnd = () => {
        if (!alive.current) return
        setCaretAt(null)
        setAnimTypingDone(true)
      }

      const gL = toGraphemes(displayLabel)
      const gB = toGraphemes(displayBody)
      const gS = displaySrc ? toGraphemes(displaySrc) : []
      const gI = displayInsight ? toGraphemes(displayInsight) : []

      typeSegment(gL, (t) => setAnimParts((p) => ({ ...p, labelT: t })), MS_LABEL, schedule, alive, 'label', setCaretAt, () => {
        typeSegment(gB, (t) => setAnimParts((p) => ({ ...p, bodyT: t })), MS_BODY, schedule, alive, 'body', setCaretAt, () => {
          if (gS.length > 0) {
            typeSegment(gS, (t) => setAnimParts((p) => ({ ...p, srcT: t })), MS_SRC, schedule, alive, 'src', setCaretAt, () => {
              if (gI.length > 0) {
                typeSegment(gI, (t) => setAnimParts((p) => ({ ...p, insT: t })), MS_INSIGHT, schedule, alive, 'insight', setCaretAt, sequenceEnd)
              } else sequenceEnd()
            })
          } else if (gI.length > 0) {
            typeSegment(gI, (t) => setAnimParts((p) => ({ ...p, insT: t })), MS_INSIGHT, schedule, alive, 'insight', setCaretAt, sequenceEnd)
          } else sequenceEnd()
        })
      })
    }, 0)
    timeoutIdsRef.current.push(kickoff)

    return () => {
      alive.current = false
      for (const tid of timeoutIdsRef.current) window.clearTimeout(tid)
      timeoutIdsRef.current = []
    }
  }, [
    displayLabel,
    displayBody,
    displaySrc,
    displayInsight,
    isStaticDisplay,
  ])

  const hasSrc = String(displaySrc).length > 0
  const hasInsight = String(displayInsight).length > 0

  const showCaret = !isStaticDisplay

  return (
    <>
      <div
        className={`typing-line-wrap typing-label-row ${showCaret && effectiveCaret === 'label' ? 'typing-active' : ''}`}
      >
        <div className="label">{parts.labelT}</div>
        {showCaret ? <span className="typewriter-caret" aria-hidden="true" /> : null}
      </div>
      <div className="box">
        <div
          className={`typing-line-wrap typing-body ${showCaret && effectiveCaret === 'body' ? 'typing-active' : ''}`}
        >
          <p>
            {parts.bodyT}
            {showCaret ? <span className="typewriter-caret" aria-hidden="true" /> : null}
          </p>
        </div>
        {hasSrc && (
          <div
            className={`typing-line-wrap typing-src ${showCaret && effectiveCaret === 'src' ? 'typing-active' : ''}`}
          >
            <small>
              — {parts.srcT}
              {showCaret ? <span className="typewriter-caret" aria-hidden="true" /> : null}
            </small>
          </div>
        )}
        {hasInsight && (
          <aside
            className={`insight typing-line-wrap typing-ins ${showCaret && effectiveCaret === 'insight' ? 'typing-active' : ''}`}
            lang={insightLang ?? 'und'}
          >
            <span className="insight-tag">해설</span>
            <p>
              {parts.insT}
              {showCaret ? <span className="typewriter-caret insight-caret" aria-hidden="true" /> : null}
            </p>
          </aside>
        )}
        {showFallbackNote ? <p className="insight-note">{fallbackNote}</p> : null}
      </div>
    </>
  )
}
