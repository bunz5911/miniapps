/**
 * 접속 추정 국가(ISO 3166-1 alpha-2) → 해설 우선 표시 언어 코드.
 * 데이터에 해당 언어가 없으면 pickLocalizedInsight 가 영어·한국어 등으로 폴백합니다.
 */

export const COUNTRY_PRIMARY_LANG = Object.freeze({
  KR: 'ko',
  KP: 'ko',
  JP: 'ja',
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',
  SG: 'en',
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',
  ZA: 'en',
  IN: 'en',
  NG: 'en',
  KE: 'en',
  PH: 'en',
  MY: 'en',
  TH: 'th',
  VN: 'vi',
  ID: 'id',
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',
  PR: 'es',
  BR: 'pt',
  PT: 'pt',
  FR: 'fr',
  BE: 'fr',
  CH: 'de',
  AT: 'de',
  DE: 'de',
  LU: 'de',
  IT: 'it',
  NL: 'nl',
  PL: 'pl',
  RU: 'ru',
  UA: 'uk',
  TR: 'tr',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  IL: 'he',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
  IS: 'is',
})

/**
 * @param {string|null|undefined} countryCode ISO 3166-1 alpha-2
 */
export function countryToExplanationLocale(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') return 'en'
  const code = countryCode.trim().toUpperCase()
  return COUNTRY_PRIMARY_LANG[code] ?? 'en'
}
