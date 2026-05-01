/**
 * Web3Forms 우선 전송 설정.
 * 빌드 시 번들에 들어가므로 Cloudflare Pages에서는 Environment variables에
 * 동일 이름으로 설정해야 합니다(Vite는 빌드 타임에 치환).
 */

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

export function getWeb3FormsAccessKey() {
  const raw = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
  const key = typeof raw === 'string' ? raw.trim() : ''
  return key !== '' ? key : null
}
