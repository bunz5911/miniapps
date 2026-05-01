import { useCallback, useMemo, useState } from 'react'
import {
  FLOATING_LEAD_COPY,
  LEAD_RECIPIENT_EMAIL,
} from '../constants/floatingLeadCopy.js'
import {
  WEB3FORMS_ENDPOINT,
  getWeb3FormsAccessKey,
} from '../constants/leadSubmit.js'

/**
 * FormSubmit AJAX 응답을 분류합니다.
 * 참고: localhost는 활성화 없이 성공 처리되는 경우가 있고,
 * 배포 도메인(pages.dev 등)은 이메일의 Activate 링크가 필요할 때가 많습니다.
 */
function classifyFormSubmitResponse(res, data) {
  const msg =
    typeof data?.message === 'string' ? data.message : ''

  /** 서비스별 메시지 문구 차이 허용 */
  const lc = msg.toLowerCase()

  const isSuccessExplicit =
    data?.success === true ||
    data?.success === 'true' ||
    msg === 'Email sent successfully!' ||
    msg === 'The form was submitted successfully.'

  if (res.ok && isSuccessExplicit) return 'success'

  if (
    res.ok &&
    (lc.includes('needs activation') || lc.includes('activate form'))
  ) {
    return 'needs_activation'
  }

  if (
    res.ok &&
    lc.includes('web server') &&
    lc.includes('html')
  ) {
    return 'referrer_blocked'
  }

  return 'error'
}

/**
 * Web3Forms로 전송 — 토큰 활성화 없이 정적 사이트에서 동작하기 쉬움.
 */
async function submitViaWeb3Forms(trimmed, explanationLocale, honeypot) {
  const accessKey = getWeb3FormsAccessKey()
  if (!accessKey) return { mode: 'skipped' }

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject:
        '[Soul Diary] PDF + 동화로 배우는 한국어 (4주 후) · 20% code',
      email: trimmed,
      replyto: trimmed,
      /** Web3 honeypot — 비어 있어야 전송 유효 */
      botcheck: honeypot,
      from_name: 'Soul Diary',
      message: [
        'PDF 리드 신청',
        `신청 이메일: ${trimmed}`,
        `해설 언어: ${explanationLocale ?? 'unknown'}`,
        '출처: Soul Diary 플로팅 폼',
      ].join('\n'),
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (data.success === true) return { mode: 'ok' }
  return {
    mode: 'failed',
    detail: typeof data.message === 'string' ? data.message : '',
  }
}

/**
 * 하단 고정 리드 폼 — 해설 언어에 맞는 문구로 PDF 신청 이메일을 수집합니다.
 * VITE_WEB3FORMS_ACCESS_KEY가 있으면 Web3Forms, 없으면 FormSubmit(AJAX)을 사용합니다.
 */
export function FloatingLeadForm({ explanationLocale }) {
  const copy = useMemo(() => {
    const key = explanationLocale && FLOATING_LEAD_COPY[explanationLocale]
      ? explanationLocale
      : 'en'
    return FLOATING_LEAD_COPY[key] ?? FLOATING_LEAD_COPY.en
  }, [explanationLocale])

  const [email, setEmail] = useState('')
  /** idle | sending | success | error | needs_activation | referrer_blocked */
  const [status, setStatus] = useState('idle')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (honeypot.trim() !== '') return

      const trimmed = email.trim()
      if (!trimmed) return

      setStatus('sending')

      try {
        const web3 = await submitViaWeb3Forms(
          trimmed,
          explanationLocale,
          honeypot.trim(),
        )

        if (web3.mode === 'ok') {
          setStatus('success')
          setEmail('')
          return
        }

        if (web3.mode === 'failed') {
          if (import.meta.env.DEV) {
            console.warn('[FloatingLead] Web3Forms:', web3.detail)
          }
          setStatus('error')
          return
        }

        /** FormSubmit 폴백 */
        const endpoint = `https://formsubmit.co/ajax/${LEAD_RECIPIENT_EMAIL}`

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: trimmed,
            _subject: '[Soul Diary] PDF + 동화로 배우는 한국어 (4주 후) · 20% code',
            _replyto: trimmed,
            _template: 'table',
            _captcha: 'false',
            source: 'Soul Diary floating lead',
            requested_locale: explanationLocale ?? 'unknown',
          }),
        })

        const rawText = await res.text()
        let data = {}
        try {
          data = rawText ? JSON.parse(rawText) : {}
        } catch {
          data = {}
        }

        const outcome = classifyFormSubmitResponse(res, data)

        if (import.meta.env.DEV && outcome !== 'success') {
          console.warn('[FloatingLead] FormSubmit', res.status, data)
        }

        if (outcome === 'success') {
          setStatus('success')
          setEmail('')
          return
        }

        if (outcome === 'needs_activation') {
          setStatus('needs_activation')
          return
        }

        if (outcome === 'referrer_blocked') {
          setStatus('referrer_blocked')
          return
        }

        throw new Error('FormSubmit rejected')
      } catch {
        setStatus('error')
      }
    },
    [email, honeypot, explanationLocale],
  )

  return (
    <aside
      className="floating-lead"
      aria-label={copy.ariaForm}
    >
      <p className="floating-lead-blurb">{copy.blurb}</p>

      {status === 'success' ? (
        <p className="floating-lead-feedback floating-lead-feedback--ok" role="status">
          {copy.success}
        </p>
      ) : (
        <form className="floating-lead-form" onSubmit={handleSubmit} noValidate>
          {/* 봇용 허니팟 — 비워 두어야 합니다 */}
          <label className="floating-lead-honeypot" aria-hidden="true">
            <span>Company</span>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(ev) => setHoneypot(ev.target.value)}
            />
          </label>

          <div className="floating-lead-row">
            <label className="floating-lead-email-wrap">
              <span className="visually-hidden">{copy.emailLabel}</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder={copy.placeholder}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                aria-label={copy.emailLabel}
                disabled={status === 'sending'}
              />
            </label>
            <button
              type="submit"
              className="floating-lead-send"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? copy.sending : copy.send}
            </button>
          </div>

          {status === 'error' ||
          status === 'needs_activation' ||
          status === 'referrer_blocked' ? (
            <p
              className={
                status === 'error'
                  ? 'floating-lead-feedback floating-lead-feedback--err'
                  : 'floating-lead-feedback floating-lead-feedback--warn'
              }
              role={status === 'error' ? 'alert' : 'status'}
            >
              {status === 'needs_activation'
                ? copy.needsActivation
                : status === 'referrer_blocked'
                  ? copy.referrerBlocked
                  : copy.error}
            </p>
          ) : null}
        </form>
      )}
    </aside>
  )
}
