# 사진공모전 작품 제출 시스템

서울특별시사회복지사협회 창립 40주년 기념 사진공모전 온라인 접수 시스템

## 구조

```
photo-contest/
├── vercel.json            # Vercel 배포 설정
├── public/
│   └── index.html         # 프론트엔드 (Vercel 서빙)
├── backend/
│   └── Code.gs            # 백엔드 (Google Apps Script)
├── docs/
│   └── PRD.md             # 요구사항 문서
└── .antigravity/
    └── rules.md           # Antigravity 에이전트 규칙
```

## 배포 방법

### 1단계: 백엔드 (Google Apps Script)

1. [script.google.com](https://script.google.com) → 새 프로젝트
2. `backend/Code.gs` 내용 붙여넣기
3. **배포** → **새 배포** → **웹 앱**
   - 실행 계정: **나**
   - 액세스: **모든 사용자**
4. 배포된 웹앱 URL 복사

### 2단계: 프론트엔드 (GitHub → Vercel)

1. `public/index.html`의 `API_URL` 상수에 웹앱 URL 붙여넣기:
   ```js
   const API_URL = "https://script.google.com/macros/s/여기에_실제URL/exec";
   ```
2. GitHub에 push
3. [vercel.com](https://vercel.com) → **Add New Project** → GitHub 리포 연결
   - Framework Preset: **Other**
   - Root Directory: `.` (기본값)
4. **Deploy** — 이후 `main` push 시 자동 배포

### 3단계: 확인

- Vercel 배포 URL 접속 → 폼 정상 표시
- 테스트 제출 → 스프레드시트 행 추가 + Drive 파일 생성 확인

## 환경 정보

| 항목 | 값 |
|------|-----|
| 스프레드시트 | `1qwDww9cKxzHBdyK-q4HSBRauCGpYekXSc8S1X9PZrMs` |
| 드라이브 폴더 | `1xtYb91H-D380bKUgKNntt16XXilUcP8V` |
| 시트 탭 | `접수` |
