/**
 * 작성된 해설 문구 객체에서 사용자 언어에 맞는 텍스트를 고릅니다.
 * @param {Record<string, string>|undefined|null} insights
 * @param {string} preferred language code (예: 'pt', 'en', 'zh')
 */
export function pickLocalizedInsight(insights, preferred) {
  if (!insights || typeof insights !== 'object') return null
  const cand = []

  const p = preferred && String(preferred).toLowerCase()
  if (p) {
    cand.push(p)
    const short = p.split('-')[0]
    if (short && short !== p) cand.push(short)
  }

  cand.push('en', 'ko')

  const tried = new Set()
  for (const code of cand) {
    if (!code || tried.has(code)) continue
    tried.add(code)
    const text = insights[code]
    if (typeof text === 'string' && text.trim()) return { text: text.trim(), usedLocale: code }
  }
  return null
}
