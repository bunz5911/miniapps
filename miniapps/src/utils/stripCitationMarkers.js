/**
 * 카드 원고에 포함된 편집용 인용 표시(예: [cite: 2], [cite: 2, 4])를 제거합니다.
 * 사용자에게는 렌더 직전에 적용되어 화면에 나타나지 않습니다.
 * @param {string | undefined | null} input
 * @returns {string}
 */
export function stripCitationMarkers(input) {
  if (input == null) return ''
  const s = typeof input === 'string' ? input : String(input)
  return s.replace(/\s*\[cite\s*:[^\]]+\]/gi, '').trimEnd()
}
