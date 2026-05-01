Soul Diary (React + Vite). 상위 저장소 안의 `miniapps` 앱입니다.

## 개발

```bash
npm install
npm run dev
```

## 빌드·검사

```bash
npm run lint
npm run build
```

## Cloudflare Pages

- **Root directory**(상위 Pages 프로젝트): `miniapps`
- **Output**: `dist`
- **플로팅 이메일 폼(권장)**: FormSubmit은 배포 도메인마다 활성화·토큰이 필요해 깨지기 쉽습니다.
  [Web3Forms](https://web3forms.com/)에서 폼을 만들고 받은 Access Key를
  빌드 환경 변수 **`VITE_WEB3FORMS_ACCESS_KEY`** 로 넣으면 `FormSubmit` 대신 해당 API가 사용됩니다.
  로컬은 `miniapps/.env`(Git 제외). 템플릿은 [.env.example](.env.example) 참고.
  수신 메일 주소는 Web3Forms 설정에서 지정합니다.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
