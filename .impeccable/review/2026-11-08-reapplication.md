# Impeccable 재적용

대상: `aimers-app/public/app.js`, `aimers-app/public/style.css`

사용자 요청: `e8f752a` UI를 나쁜 변화로 평가했고, 별도로 변경 범위를 제한하지 말고 Impeccable을 원래 절차대로 다시 적용하도록 요청했다. 기존 서비스 기획, 네 탭, 개인별 기록 주기와 공개 권한은 계속 유효하다.

## 독립 평가

- A: `/root/design_reassessment` — 디자인과 사용 흐름, detector 결과를 보지 않고 평가. 26/40. 기록보다 메타데이터가 먼저 오는 폼, 저장 시 보이지 않는 공개 범위, 동등한 기록/회고 CTA, 긴 서비스 행의 설명·버튼 분리를 지적했다.
- B: `/root/evidence_reassessment` — 별도 context에서 CLI detector 실행. Arial 로고 2건과 모달 shadow 1건 경고. 본문 서체/어두운 페이지에 대한 판정은 실제 소스와 달라 오탐으로 분류했다. 필터·정리본 선택 상태의 접근성 속성 누락을 확인했다.
- 두 에이전트의 브라우저 목록은 비어 있어 직접 조작하지 못했다. 부모가 실제 브라우저를 조작해 주요 화면을 캡처하고 A에게 제공했다. 잘못 캡처된 대시보드는 A의 시각 판단에서 제외했다. 부모는 별도로 올바른 대시보드 캡처를 확인했다.
- 예시 데이터 표기 관련 A의 제안은 예시 데이터에 별도 처리를 요구하지 않은 사용자 지시에 따라 이번 수정에 포함하지 않았다.

## 적용 방향

Operate 화면에서 경험 기록을 시작하는 동작이 먼저 보이도록 한다. 대시보드에서 한 줄을 입력하고 편집기로 이어가며, 회고는 개인 주기에 따른 별도 영역으로 구분한다. 입력 원문과 임시 답변을 보존한다. 저장 버튼 곁에서 공개 범위를 항상 확인·변경할 수 있도록 한다.

기존 파란색과 밝은 화면 체계 안에서 실제 한국어 웹폰트, 제목·본문·메타데이터의 크기와 두께, 패널 간 비율을 조정한다. 부가 서비스는 각 설명 곁에 실행 버튼과 명시적인 예시를 둔다. 변경 전 화면의 특정 CSS 수치나 요소를 추가 제약으로 고정하지 않는다.

## 구현·검증 기록

- Pretendard v1.3.9 가변 웹폰트와 OFL 라이선스를 로컬 제공한다. 출처: https://github.com/orioncactus/pretendard/tree/v1.3.9/packages/pretendard/dist/web/variable/woff2
- 대시보드 한 줄 입력 → 편집기 이동 → 비공개 원문 저장 → 새 기록과 완료 상태 표시를 실제 브라우저에서 확인했다.
- 유효한 최종 증거: `desktop-v2.jpg`, `dashboard-mobile-verified.jpg`, `final-mobile-editor.jpg`, `final-editor-desktop.jpg`, `services-v2.jpg`, `mobile-services-v2.jpg`, `library-v2.jpg`, `settings-800-large-v2.jpg`. 전체 페이지 캡처는 일부 하단이 누락되어 최종 증거로 사용하지 않았다. 저장 데이터는 `.data/ui-reapply`의 별도 검증 DB를 사용한다.
- 자동 테스트 19개, JS 문법 검사, Worker 빌드, Git 공백 검사 통과. 로컬과 Worker에서 웹폰트 MIME 및 바이트 일치를 확인했다. 390px 모바일과 800px/20px 글씨 설정에서 가로 넘침이 없었다.
- 독립 마무리 리뷰(`/root/impeccable_finish_reviewer`)는 `fix`를 반환했다. 원문 변경 후 이전 AI 질문이 남는 문제와 제품·디자인 문서 동기화를 요구했다. 기존 UI를 다듬는 Operate 작업이므로 새 시각 세계나 이미지 시안을 요구하지 않았다.
- AI 질문 문제 수정: 원문 변경 시 미응답 질문을 제거한다. 작성한 답변이 있으면 질문·답변을 보존하고 이전 원문의 질문임을 명시한다. 실제 AI 생성 → 원문 삭제 → 재열기에서 질문 0개, 생성 → 답변 작성 → 원문 변경 → 재열기에서 답변과 안내 보존을 확인했다. 재검토에서 이 수정은 resolved 판정을 받았다. 증거는 `fix-empty-editor.jpg`, `fix-retained-answer.jpg`, `fix-retained-answer-mobile.jpg`이다.
- 최종 detector는 모달 shadow의 dark-glow 경고 1건이다. 실제 밝은 배경과 `0 20px 70px #10253b30`의 오프셋 shadow를 확인해 오탐으로 남겼다. 같은 검사 반복 실행으로 결과를 바꾸려 하지 않았다.
- 문서화는 별도 `/root/impeccable_documenter`가 수행했다. `PRODUCT.md`, 현재 토큰과 흐름을 반영한 `DESIGN.md`, 폰트 배포 설명을 갱신했다. 기존 검증 기록은 과거 이력으로 구분했다. 부모가 실제 코드에서 추출한 토큰 frontmatter와 sidecar를 보완했다.
- 최종 verdict pass: AI 질문 상태와 문서화 두 항목 모두 resolved, fix-batch 회귀 없음, disposition `ship`. 이 판정은 두 수정 항목에 대한 것이며 전체 서비스나 사용자의 미적 선호를 승인했다는 의미가 아니다.
