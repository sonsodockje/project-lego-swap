# 🧱 LEGO SWAP : 중고 레고 거래 플랫폼

Lego Market은 레고 애호가들을 위한 전용 중고 거래 커뮤니티 웹사이트입니다. 더 이상 가지고 놀지 않는 레고를 판매하거나, 단종되어 구하기 어려운 레고를 찾아 구매할 수 있는 공간을 제공합니다. 직관적인 UI와 실시간 채팅 기능을 통해 사용자 간의 원활한 소통과 거래를 지원합니다.

## 🚀 배포 주소

**[https://lego-f1-3d70e.web.app/](https://lego-f1-3d70e.web.app/)**

## ✨ 주요 기능 상세

- **🔐 사용자 인증**
  - Firebase Authentication을 연동하여 구글 로그인을 구현하였습니다.

- **📝 상품 등록 및 관리**
  - 판매하고자 하는 레고 상품의 사진, 제목, 설명, 가격을 포함한 판매글을 작성할 수 있습니다.
  - 사용자가 업로드하는 이미지를 웹에 최적화된 크기로 축소하여 업로드 속도와 스토리지 효율을 높였습니다.
  - 본인이 작성한 게시글은 언제든지 수정하거나 삭제할 수 있습니다.

- **❤️ 찜하기 기능**
  - 마음에 드는 상품에 '찜' 표시를 하여 관심 목록에 추가할 수 있습니다.
  - 마이페이지에서 찜한 상품들을 모아보고 관리할 수 있습니다.

- **💬 실시간 1:1 채팅 (DM)**
  - Firebase Realtime Database를 활용하여 판매자와 구매자 간의 실시간 채팅을 지원합니다.
  - 상품 상세 페이지에서 판매자에게 바로 쪽지를 보내 거래 관련 문의를 할 수 있습니다.

- **👤 마이페이지**
  - 사용자의 프로필 정보 관리 기능을 제공합니다.
  - 내가 작성한 모든 판매글과 찜한 상품 목록을 한눈에 확인할 수 있는 개인화된 대시보드입니다.

- **📱 반응형 UI/UX**
  - Tailwind CSS와 DaisyUI를 활용하여 데스크톱, 태블릿, 모바일 등 모든 디바이스에서 일관되고 쾌적한 사용자 경험을 제공합니다. 
  - 모바일 친화적인 경험을 제공합니다.

## 🛠️ 기술 스택 및 아키텍처

- **Frontend**: `React`, `Vite`
  - 컴포넌트 기반 아키텍처와 빠른 개발 환경을 위해 React와 Vite를 사용했습니다.
- **Styling**: `Tailwind CSS`, `DaisyUI`
  - 유틸리티 우선의 CSS 프레임워크인 Tailwind와 이를 기반으로 한 DaisyUI를 통해 신속하고 일관된 UI를 개발했습니다.
- **Backend & Database**: `Firebase`
  - **Authentication**: 사용자 인증 처리
  - **Firestore**: 상품 정보, 사용자 데이터 등 구조화된 데이터 저장
  - **Realtime Database**: 실시간 채팅 기능 구현
  - **Storage**: 사용자가 업로드하는 상품 이미지 저장
- **State Management**: `React Query (TanStack Query)`
  - 서버 상태(Firebase 데이터)를 효율적으로 관리하고, 캐싱, 동기화, 데이터 재요청 등의 복잡한 로직을 단순화하기 위해 사용했습니다.
- **Routing**: `React Router`
  - SPA(Single Page Application) 내에서 페이지 간의 원활한 이동을 위해 사용했습니다.

## ⚙️ 로컬 환경에서 시작하기

### 1. 사전 요구사항

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- `pnpm` 패키지 매니저 (`npm install -g pnpm`)
- [Firebase](https://firebase.google.com/) 프로젝트

### 2. 설치 및 설정

1.  **저장소 클론 및 종속성 설치**

    ```bash
    git clone https://github.com/your-username/zb-pj-01.git
    cd zb-pj-01
    pnpm install
    ```

2.  **Firebase 환경 변수 설정**

    - Firebase Console에서 웹 앱을 생성하고 Firebase SDK 설정 정보를 확인합니다.
    - 프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고 아래와 같이 환경 변수를 추가합니다. `VITE_` 접두사는 Vite 프로젝트의 규칙입니다.

    ```
    VITE_API_KEY="your_api_key"
    VITE_AUTH_DOMAIN="your_auth_domain"
    VITE_PROJECT_ID="your_project_id"
    VITE_STORAGE_BUCKET="your_storage_bucket"
    VITE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    VITE_APP_ID="your_app_id"
    ```

### 3. 프로젝트 실행

- **개발 서버 실행**

  ```bash
  pnpm run dev
  ```

- **프로덕션 빌드**

  ```bash
  pnpm run build
  ```

- **Firebase 호스팅 배포**

  ```bash
  firebase deploy --only hosting
  ```

---

## 📝 향후 업데이트 계획

- **[ ] 알림 기능**: 다른 사용자가 내 게시물에 찜을 누르거나 DM을 보냈을 때 실시간 알림을 제공합니다.
- **[ ] 검색 및 필터링 강화**: 카테고리, 가격 범위 등 다양한 조건으로 상품을 검색하고 필터링하는 기능을 추가합니다.
- **[ ] 사용자 평가 시스템**: 거래 완료 후 서로에 대한 후기를 남길 수 있는 기능을 도입합니다.
