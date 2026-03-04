# Antigravity Agent Rules — 사진공모전 프로젝트

## 프로젝트 개요
서울특별시사회복지사협회 창립 40주년 기념 사진공모전 온라인 접수 시스템.
프론트엔드(정적 HTML)와 백엔드(Google Apps Script)로 구성.

## 아키텍처 규칙

### 배포
- **프론트엔드**: GitHub → Vercel 자동 배포 (`public/` 디렉토리 서빙)
- **백엔드**: Google Apps Script Web App (별도 배포, `backend/Code.gs`)
- Vercel 설정: `vercel.json` (outputDirectory: "public")
- `main` 브랜치 push 시 Vercel 자동 재배포

### 백엔드 (`backend/Code.gs`)
- Google Apps Script Web App (doPost)
- 스프레드시트 ID: `1qwDww9cKxzHBdyK-q4HSBRauCGpYekXSc8S1X9PZrMs` (시트 탭: "접수")
- 드라이브 폴더 ID: `1xtYb91H-D380bKUgKNntt16XXilUcP8V`
- JSON 요청/응답, CORS 우회를 위해 Content-Type은 `text/plain;charset=utf-8`
- 접수번호 형식: `SASW-{YYYYMMDD}-{6자리랜덤}`
- Apps Script 런타임은 V8, ES6+ 문법 사용 가능하나 `var` 선호 (호환성)

### 프론트엔드 (`public/index.html`)
- 단일 HTML 파일 (CSS + JS 인라인)
- 외부 의존성 없음 (Vanilla JS only)
- API 엔드포인트는 `API_URL` 상수 하나로 관리
- 3단계 UX: 입력 → 확인 → 완료
- 반응형: 760px 기준 모바일/데스크톱 전환

## 코딩 컨벤션
- 한국어 UI 텍스트, 영어 변수/함수명
- CSS 커스텀 프로퍼티(`:root`) 기반 테마
- DOM 직접 조작 (프레임워크 사용 금지)
- 파일 업로드: Base64 인코딩 후 JSON body에 포함

## 수정 시 주의사항
- `SPREADSHEET_ID`, `DRIVE_FOLDER_ID` 변경 시 백엔드만 수정
- `API_URL` 변경 시 프론트엔드만 수정
- 스프레드시트 헤더(HEADERS 배열)와 appendRow 순서 반드시 일치
- 파일 크기 제한(10MB)은 프론트·백 양쪽 모두에서 검증

## 테스트 체크리스트
- [ ] 모든 필수 필드 비워두고 제출 → 에러 메시지 확인
- [ ] 10MB 초과 파일 업로드 → 에러 메시지 확인
- [ ] PNG/JPEG 외 파일 업로드 → 에러 메시지 확인
- [ ] 정상 제출 → 접수번호 수신, 스프레드시트 행 추가, 드라이브 파일 생성
- [ ] 접수번호 복사 → 클립보드 동작 확인
- [ ] 모바일에서 카메라/사진첩 버튼 동작 확인
- [ ] 드래그 앤 드롭 동작 확인 (데스크톱)
