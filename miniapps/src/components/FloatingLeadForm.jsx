import { useCallback, useMemo, useState } from 'react'
import {
  FLOATING_LEAD_COPY,
  LEAD_RECIPIENT_EMAIL,
} from '../constants/floatingLeadCopy.js'

/**
 * 하단 고정 리드 폼 — 해설 언어에 맞는 문구로 PDF 신청 이메일을 수집합니다.
 * FormSubmit.co AJAX로 수신함으로 전달합니다(최초 1회 서비스 측 확인이 필요할 수 있음).
 */
export function FloatingLeadForm({ explanationLocale }) {
  const copy = useMemo(() => {
    const key = explanationLocale && FLOATING_LEAD_COPY[explanationLocale]
      ? explanationLocale
      : 'en'
    return FLOATING_LEAD_COPY[key] ?? FLOATING_LEAD_COPY.en
  }, [explanationLocale])

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (honeypot.trim() !== '') return

      const trimmed = email.trim()
      if (!trimmed) return

      setStatus('sending')
      const endpoint = `https://formsubmit.co/ajax/${LEAD_RECIPIENT_EMAIL}`

      try {
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

        const data = await res.json().catch(() => ({}))
        const ok =
          res.ok &&
          (data.success === true ||
            data.success === 'true' ||
            data.message === 'Email sent successfully!')

        if (!ok) throw new Error('FormSubmit rejected')

        setStatus('success')
        setEmail('')
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

          {status === 'error' ? (
            <p className="floating-lead-feedback floating-lead-feedback--err" role="alert">
              {copy.error}
            </p>
          ) : null}
        </form>
      )}
    </aside>
  )
}
