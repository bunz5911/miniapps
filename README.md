# Miniapps

이 저장소는 소규모 웹 앱을 `miniapps/` 아래에 두는 구조입니다.

## 포함된 앱

| 경로 | 설명 |
|------|------|
| [miniapps/](miniapps/) | **Soul Diary** — React + Vite (한국어 학습 콘텐츠) |

## 로컬 개발

```bash
cd miniapps
npm install
npm run dev
```

## 배포 (Cloudflare Pages)

1. GitHub에 이 저장소를 연결합니다.
2. **Root directory**: `miniapps`
3. **Build command**: `npm ci && npm run build`
4. **Build output directory**: `dist`
5. 환경 변수: `NODE_VERSION=20` 권장.

자세한 빌드 정보는 [miniapps/README.md](miniapps/README.md)를 참고하세요.
