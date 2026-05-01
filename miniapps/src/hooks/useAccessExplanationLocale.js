import { useEffect, useState } from 'react'
import { countryToExplanationLocale } from '../utils/countryToExplanationLocale'

const SUPPORTED = new Set(['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'pt'])

/** 화면 검수용 URL 예: ?explainLocale=ja&simulateCountry=JP 또는 ?explain=ja */
const PREVIEW_COUNTRY_LABEL_KO = {
  JP: '일본(Japan)',
  KR: '한국(Korea)',
  US: '미국(United States)',
  CN: '중국(China)',
}

/**
 * 접속 추정(IP) 또는 브라우저 설정으로 표시 언어를 정합니다.
 * 해설 문자열 데이터가 없는 언어 코드는 안전하게 영어 계열(en)로 맞춥니다.
 */
function normalizeLang(code) {
  if (!code || typeof code !== 'string') return 'en'
  const base = code.split('-')[0].toLowerCase()
  if (SUPPORTED.has(base)) return base
  return 'en'
}

function browserPreferredLang() {
  if (typeof navigator === 'undefined') return 'en'
  const list = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
  for (const raw of list) {
    const n = normalizeLang(raw)
    if (n) return n
  }
  return 'en'
}

/**
 * 화면 검수용 URL 쿼리를 읽습니다. 없으면 null.
 *
 * @returns {{ explanationLocale: string, countryCode: string | null, countryName: string | null, source: 'url-preview' } | null}
 */
export function readExplanationLocalePreviewFromUrl() {
  if (typeof window === 'undefined') return null
  const q = new URLSearchParams(window.location.search)
  const raw = q.get('explainLocale') ?? q.get('explain')
  if (!raw?.trim()) return null

  const explanationLocale = normalizeLang(raw.trim())
  let cc = q.get('simulateCountry')?.trim()?.toUpperCase()
  if (!cc) {
    const guess = { ja: 'JP', ko: 'KR', zh: 'CN', en: 'US', es: 'ES', fr: 'FR', de: 'DE', pt: 'BR' }
    cc = guess[explanationLocale] ?? null
  }

  const known = PREVIEW_COUNTRY_LABEL_KO[cc]
  const countryName = known ?? (cc || null)

  return {
    explanationLocale,
    countryCode: cc || null,
    /** 미리보기 줄에 쓸 한글 표기, 없으면 코드만 */
    countryName,
    source: 'url-preview',
  }
}

/**
 * @returns {{ explanationLocale: string, countryCode: string | null, countryName: string | null, source: 'ip' | 'browser' | 'browser-fallback' | 'url-preview', isLoading: boolean }}
 */
export function useAccessExplanationLocale() {
  const preview = typeof window !== 'undefined' ? readExplanationLocalePreviewFromUrl() : null

  const [state, setState] = useState(() =>
    preview
      ? {
          explanationLocale: preview.explanationLocale,
          countryCode: preview.countryCode,
          countryName: preview.countryName,
          source: preview.source,
          isLoading: false,
        }
      : {
          explanationLocale: normalizeLang(browserPreferredLang()),
          countryCode: null,
          countryName: null,
          source: 'browser',
          isLoading: true,
        },
  )

  useEffect(() => {
    /* URL 미리보기 모드는 초기 상태로 고정되어 있으며 여기서 IP 조회하지 않음 */
    if (readExplanationLocalePreviewFromUrl()) return

    const ac = new AbortController()
    const t = setTimeout(() => ac.abort(), 8000)

    ;(async () => {
      const fromBrowser = normalizeLang(browserPreferredLang())
      let handled = false
      try {
        const res = await fetch('https://ipapi.co/json/', {
          signal: ac.signal,
        })
        if (!res.ok) throw new Error('geo http')
        const data = await res.json()
        const cc = data.country_code
        const name = data.country_name
        if (cc && typeof cc === 'string') {
          const fromCountry = countryToExplanationLocale(cc)
          setState({
            explanationLocale: normalizeLang(fromCountry),
            countryCode: cc,
            countryName: typeof name === 'string' ? name : null,
            source: 'ip',
            isLoading: false,
          })
          handled = true
        }
      } catch {
        /* IP 확인 실패 시 브라우저 언어 사용 */
      }
      clearTimeout(t)
      if (!handled) {
        setState({
          explanationLocale: fromBrowser,
          countryCode: null,
          countryName: null,
          source: 'browser-fallback',
          isLoading: false,
        })
      }
    })()

    return () => {
      clearTimeout(t)
      ac.abort()
    }
  }, [])

  return state
}
