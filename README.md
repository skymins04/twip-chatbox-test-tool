# Twip Chatbox test tool

[Twip Chatbox](https://twip.kr/)의 채팅창 오버레이 테마 제작 시 채팅테스트를 도와주는 툴입니다.  
여러종류 테스트 유저로 샘플 채팅들을 확인할 수 있습니다.

## 1. 주요기능

채팅창 테마 제작 시 채팅 테스트와 커스텀테마 자동저장 및 슬롯 기능들을 제공합니다.

1. 채팅 테스트 툴
   - 랜덤 테스트 채팅 메시지 생성 기능 (여러종류의 테스트 유저 제공)
   - 테스트 채팅 간격 조절 기능
   - 테스트 채팅 간격 랜덤 오프셋 활성/비활성 및 조절 기능
   - 채팅창 내역 초기화 기능
   - 테스트 유저 유형별 활성화 설정 기능
   - 테스트 메시지 설정 기능
2. 트윕 오버레이 슬롯 기능
   - 트윕 커스텀테마 CSS 저장 슬롯 기능
   - 저장된 테마의 "현재 오버레이에 적용", "CSS파일 다운로드", "미리보기" 기능
3. 트윕 오버레이 커스텀테마 CSS 자동저장 기능
   - 트윕 커스텀테마 CSS 자동저장 기능
   - 상시 자동저장 활성화 옵션 선택 기능
   - 자동저장된 테마의 "현재 오버레이에 적용", "트윕설정페이지 바로가기", "CSS파일 다운로드", "미리보기" 기능

## 2. 지원 테스트 유저

테스트 유저로 제공하는 종류는 아래와 같습니다.

- 일반유저(별도의 권한이 없는 일반 시청자)
- Broadcaster(스트리머)
- Moderator(매니저 권한을 부여한 사용자)
- Partner(트위치파트너)
- Subscriber(구독자)
- Turbo(트위치터보 사용자)
- Premium(프리미엄 사용자)
- Bits(비트 사용자)
- Admin(트위치 어드민)
- Staff(트위치 스태프)

## 3. 설치방법

### 3-1. 크롬웹스토어를 이용하여 설치

크롬웹스토어에 게시된 [**"Twip chatbox test tool"**](https://chrome.google.com/webstore/detail/twip-chatbox-test-tool/dmpokkhjjinmldokleiiibigbieikdoa) 확장프로그램을 "Chrome에 추가" 버튼을 클릭하여 크롬 브라우저에 간편히 설치할 수 있습니다

![Twip Chatbox test tool Chrome WebStore](/readme/readme_2.png)

### 3-2. 압축파일을 이용하여 설치

[최신 릴리즈](https://github.com/skymins04/twip-chatbox-test-tool/releases/tag/main)의 압축파일을 다운로드 받은 후 해당 압축파일을 크롬 브라우저 확장프로그램관리에서 **"개발자 모드"** 를 활성화한 뒤, **"압축해제된 확장 프로그램을 로드합니다."** 를 선택 후 압축파일을 압축해제한 폴더를 선택하여 설치합니다.

### 3-3. 직접 빌드하여 설치

빌드를 위해선 Node 및 NPM 개발환경이 필요합니다.  
아래 명령으로 소스를 빌드해주세요.

```
$ git clone https://github.com/skymins04/twip-chatbox-test-tool.git
$ cd twip-chatbox-test-tool
$ npm install (또는 yarn install)
$ npm run build (또는 yarn run build)
```

빌드가 완료되면 크롬 브라우저 확장프로그램관리에서 **"개발자 모드"** 를 활성화한 뒤, **"압축해제된 확장 프로그램을 로드합니다."** 를 선택 후 빌드로 생성된 **"dist" 폴더** 를 선택하여 설치합니다.
