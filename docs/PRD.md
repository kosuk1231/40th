PRD: 서울특별시사회복지사협회 창립 40주년 사진공모전 작품 제출 시스템
1. 개요
1.1 프로젝트 명
사진공모전 작품 제출 웹 애플리케이션

1.2 목적
서울특별시사회복지사협회 창립 40주년을 기념하여 회원의 사진공모전 작품을 온라인으로 접수·관리하는 시스템 구축

1.3 주최
서울특별시사회복지사협회

1.4 접수기간
2026.3.9(월) ~ 2026.4.10(금)

2. 시스템 아키텍처
2.1 기술 스택
계층	기술	설명
프론트엔드	HTML + CSS + Vanilla JS	단일 페이지 폼
프론트엔드 호스팅	GitHub → Vercel	자동 배포 (push 시 트리거)
백엔드 (API)	Google Apps Script (Web App)	POST 엔드포인트, 파일 저장·시트 기록
데이터 저장	Google Sheets	접수 내역 관리
파일 저장	Google Drive 폴더	사진 원본 보관
2.2 데이터 흐름
[사용자 브라우저]
     │
     │  ① 폼 입력 + 사진 Base64 인코딩
     ▼
[프론트엔드 - index.html]
     │
     │  ② POST (JSON: 메타데이터 + file.base64)
     ▼
[백엔드 - Google Apps Script doPost()]
     │
     ├─ ③ Base64 → Blob → Google Drive 폴더에 파일 저장
     │      폴더 ID: 1xtYb91H-D380bKUgKNntt16XXilUcP8V
     │
     └─ ④ 접수 정보 → Google Sheets 행 추가
            시트 ID: 1qwDww9cKxzHBdyK-q4HSBRauCGpYekXSc8S1X9PZrMs
            시트 탭: "접수"
     │
     │  ⑤ 응답 JSON { ok: true, receiptId: "SASW-..." }
     ▼
[사용자 브라우저 - 완료 화면]
3. 백엔드 사양 (Google Apps Script)
3.1 엔드포인트
메서드: POST
URL: Apps Script 웹앱 배포 URL
Content-Type: text/plain;charset=utf-8 (CORS 우회)
3.2 요청 페이로드 (JSON)
json
{
  "contest": "사진공모전",
  "name": "홍길동",           // 필수
  "org": "○○복지관",          // 선택
  "phone": "01012345678",    // 필수 (숫자만)
  "category": "함께한추억상",  // 필수 (enum)
  "title": "사진 제목",       // 필수
  "desc": "사진 설명",        // 필수
  "agree": true,             // 필수 (true만 허용)
  "file": {
    "name": "photo.jpg",
    "type": "image/jpeg",
    "base64": "..."          // 필수
  },
  "submittedAt": "2026-03-10T09:00:00.000Z"
}
3.3 응답
성공 (200)

json
{ "ok": true, "receiptId": "SASW-20260310-AB12CD" }
실패 (400/500)

json
{ "ok": false, "message": "필수값 누락" }
3.4 접수번호 규칙
SASW-{YYYYMMDD}-{6자리 랜덤 영숫자}

3.5 스프레드시트 컬럼 (시트 탭: "접수")
열	필드
A	접수번호
B	접수일시(KST)
C	이름
D	소속
E	연락처
F	공모부문
G	사진제목
H	설명
I	파일명
J	MIME
K	파일URL
L	파일ID
3.6 환경 변수 (Apps Script 내 상수)
상수	값
SPREADSHEET_ID	1qwDww9cKxzHBdyK-q4HSBRauCGpYekXSc8S1X9PZrMs
SHEET_NAME	접수
DRIVE_FOLDER_ID	1xtYb91H-D380bKUgKNntt16XXilUcP8V
4. 프론트엔드 사양
4.1 페이지 구조 (Single Page, 3-Step)
Step 1 — 입력 폼

이름 (필수)
소속/기관명 (선택)
연락처 (필수, 하이픈 자동 처리)
공모부문 (필수, select: 함께한추억상 / 현장의순간상 / 실천의모범상)
사진 제목 (필수)
간단한 설명 (필수, textarea)
사진 업로드 (필수, JPEG/PNG, 최대 10MB)
드래그 앤 드롭 + 파일 선택
모바일: 사진첩 / 카메라 버튼
업로드 미리보기 (썸네일 + 메타정보)
개인정보·초상권 동의 체크박스 (필수)
Step 2 — 확인 (Review)

입력 내용 요약 표시
"수정하기" / "최종 제출하기" 버튼
Step 3 — 완료

감사 메시지 + 접수번호 표시
"접수번호 복사" / "새로 작성하기" 버튼
4.2 유효성 검사 (클라이언트)
필드	규칙
이름	비어있지 않을 것
연락처	숫자 추출 후 10자리 이상
공모부문	3개 중 선택
사진 제목	비어있지 않을 것
설명	비어있지 않을 것
사진 파일	JPEG/PNG, ≤10MB
동의	체크 필수
4.3 디자인 토큰
토큰	값	용도
--teal	
#008e90	주요 액센트
--lime	
#a5cd39	보조 액센트
--bg	
#f2fbfb	배경
--card	
#ffffff	카드 배경
--text	
#0f172a	본문 텍스트
--muted	
#475569	보조 텍스트
--danger	
#dc2626	오류
--ok	
#16a34a	성공
4.4 반응형 기준
데스크톱: 2-column grid (>760px)
모바일: 1-column, 카메라/사진첩 버튼 노출 (≤760px)
5. 파일 구조 (GitHub 리포지토리)
photo-contest/
├── README.md                   # 프로젝트 설명 + 배포 가이드
├── vercel.json                 # Vercel 배포 설정
├── docs/
│   └── PRD.md                  # 이 문서
│
├── backend/
│   └── Code.gs                 # Google Apps Script 코드
│                                 (Apps Script 편집기에 복사·배포)
│
├── public/                     # ← Vercel이 서빙하는 루트
│   └── index.html              # 메인 페이지 (CSS + JS 인라인)
│
└── .antigravity/
    └── rules.md                # Antigravity 에이전트용 규칙/지침
6. 배포 절차
6.1 백엔드 (Apps Script)
Google Apps Script 에서 새 프로젝트 생성
backend/Code.gs 코드 붙여넣기
상수 확인: SPREADSHEET_ID, SHEET_NAME, DRIVE_FOLDER_ID
배포 → 새 배포 → 유형: "웹 앱"
실행 계정: "나" (본인)
액세스: "모든 사용자"
웹앱 URL 복사
6.2 프론트엔드 (GitHub → Vercel)
GitHub에 리포지토리 생성 후 프로젝트 push
public/index.html 내 API_URL 상수에 Apps Script 웹앱 URL 입력
Vercel에서 GitHub 리포지토리 연결
Framework Preset: Other
Output Directory: public
배포 완료 후 Vercel 도메인 또는 커스텀 도메인 사용
이후 main 브랜치에 push 시 자동 재배포
7. 보안 및 유의사항
Apps Script 웹앱은 HTTPS 제공 (Google 인프라)
사진 Base64 전송 → 10MB 제한 내에서 네트워크 부하 관리
스프레드시트/드라이브 접근 권한: Apps Script 실행 계정의 Google 계정에 종속
개인정보(이름, 연락처)는 스프레드시트에 저장되므로 시트 공유 범위 제한 필요
중복 제출 방지 로직은 현재 미포함 (향후 개선 가능)
8. 향후 개선 사항 (Backlog)
중복 제출 감지 (동일 연락처 + 동일 파일명)
접수 확인 이메일/SMS 발송
관리자용 접수 현황 대시보드
이미지 리사이즈 (서버 사이드)
접수 마감일 자동 차단
