/* ═══════════════════════════════════════════════════════════
 *  사진공모전 접수 백엔드 — Google Apps Script Web App
 *  doPost(e) 하나로 접수 처리
 * ═══════════════════════════════════════════════════════════ */

// ─── 환경 상수 ────────────────────────────────────────────
var SPREADSHEET_ID  = "1qwDww9cKxzHBdyK-q4HSBRauCGpYekXSc8S1X9PZrMs";
var SHEET_NAME      = "접수";
var DRIVE_FOLDER_ID = "1xtYb91H-D380bKUgKNntt16XXilUcP8V";

// 스프레드시트 헤더 (appendRow 순서와 반드시 일치)
var HEADERS = [
  "접수번호","접수일시(KST)","이름","소속","연락처",
  "공모부문","사진제목","설명","파일명","MIME","파일URL","파일ID"
];

// 허용 MIME 타입 및 파일 최대 크기
var ALLOWED_TYPES = ["image/jpeg", "image/png"];
var MAX_BYTES     = 10 * 1024 * 1024; // 10 MB

// ─── 메인 엔드포인트 ──────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    validatePayload(body);

    var file     = saveFileToDrive(body.file, body.name);
    var receipt  = generateReceiptId();
    var now      = formatKST(new Date());

    appendToSheet([
      receipt,
      now,
      body.name,
      body.org || "",
      body.phone,
      body.category,
      body.title,
      body.desc,
      body.file.name,
      body.file.type,
      file.url,
      file.id
    ]);

    return jsonResponse({ ok: true, receiptId: receipt });

  } catch (err) {
    return jsonResponse({ ok: false, message: err.message || "서버 오류" });
  }
}

// ─── 유효성 검사 ──────────────────────────────────────────
function validatePayload(body) {
  if (!body.name || !body.phone || !body.category ||
      !body.title || !body.desc) {
    throw new Error("필수값 누락");
  }
  if (body.agree !== true) {
    throw new Error("개인정보·초상권 동의가 필요합니다.");
  }
  if (!body.file || !body.file.base64 || !body.file.name || !body.file.type) {
    throw new Error("사진 파일 정보가 누락되었습니다.");
  }
  if (ALLOWED_TYPES.indexOf(body.file.type) === -1) {
    throw new Error("지원하지 않는 파일 형식입니다. (JPEG/PNG만 가능)");
  }
  // Base64 크기 → 원본 크기 추정
  var estimatedBytes = Math.ceil(body.file.base64.length * 3 / 4);
  if (estimatedBytes > MAX_BYTES) {
    throw new Error("파일 용량이 10MB를 초과합니다.");
  }
}

// ─── 파일 → Google Drive ─────────────────────────────────
function saveFileToDrive(fileData, submitterName) {
  var blob   = Utilities.newBlob(
    Utilities.base64Decode(fileData.base64),
    fileData.type,
    fileData.name
  );
  var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  var saved  = folder.createFile(blob);

  // 파일명에 제출자 이름 접두사 추가 (관리 편의)
  var newName = submitterName + "_" + fileData.name;
  saved.setName(newName);

  return {
    id:  saved.getId(),
    url: saved.getUrl()
  };
}

// ─── 스프레드시트 행 추가 ─────────────────────────────────
function appendToSheet(rowArray) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // 헤더가 비어 있으면 자동 생성
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  sheet.appendRow(rowArray);
}

// ─── 접수번호 생성 ────────────────────────────────────────
function generateReceiptId() {
  var now   = new Date();
  var yyyy  = now.getFullYear();
  var mm    = ("0" + (now.getMonth() + 1)).slice(-2);
  var dd    = ("0" + now.getDate()).slice(-2);
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var rand  = "";
  for (var i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "SASW-" + yyyy + mm + dd + "-" + rand;
}

// ─── KST 포맷 ────────────────────────────────────────────
function formatKST(date) {
  // Apps Script 런타임은 프로젝트 타임존(Asia/Seoul 설정 필요)을 따름
  return Utilities.formatDate(date, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
}

// ─── JSON 응답 헬퍼 ───────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
