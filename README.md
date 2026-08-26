# Rx (LMS) - Lens Work Management Prototype

IIC Combined Global Back Office의 **Lens Work Management** 화면 프로토타입입니다.

## Overview

렌즈 주문의 작업 흐름을 관리하는 BO 화면으로, 주문 접수부터 출고까지의 전 과정을 추적합니다.

### 주요 기능

- **Lens Work List**: 주문 리스트 조회, 검색 필터, 일괄 상태 변경
- **Processing Stats**: 작업 기간별 주문 현황 카드
- **Work Detail**: 주문 상세 정보 (To Customer / To Store 탭)
- **Label Registration**: TMS 라벨 등록 (배송사 선택: FedEx, UPS)
- **Outbound Registration**: 출고 등록 (배송사 선택)
- **Invoice / Picking List / Label Print**: 각종 출력 기능

### 상태 흐름

```
Pending → Inbound Inspection → In Progress → Re Do → Outbound Inspection → Completed → Finalized
```

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Project Structure

```
app/
  page.tsx                    # Lens Work List (메인)
  work/[id]/page.tsx          # Work Detail (상세)
components/
  app-header.tsx              # 공통 헤더
  app-sidebar.tsx             # 공통 사이드바
  ui/                         # shadcn/ui 컴포넌트
    carrier-select.tsx         # 배송사 선택 드롭다운
  lens-work/
    filter-section.tsx         # 검색 필터
    work-table.tsx             # 작업 리스트 테이블
    processing-stats.tsx       # 작업 기간별 현황
    outbound-modal.tsx         # 출고 등록 팝업
    invoice-modal.tsx          # 인보이스 출력
    picking-list-modal.tsx     # 피킹리스트 출력
    label-print-modal.tsx      # 라벨 출력
    cancel-return-modal.tsx    # 취소/반품 처리
```
