# Getting Started

## Docker Server

도커 서버 설치 및 실행
- https://www.docker.com/ 에서 도커 데스크탑을 설치
- 다운받은 도커 서버 실행

명령어 실행
```bash
$ npm i
$ docker-compose up --build
```

아래 문구가 나타날 때까지 대기 후 localhost:3000 으로 접속
```
crawler_1  | Compiled successfully!
crawler_1  | 
crawler_1  | You can now view front-react in the browser.
crawler_1  | 
crawler_1  |   Local:            http://localhost:3000
crawler_1  |   On Your Network:  http://172.19.0.2:3000
crawler_1  | 
crawler_1  | Note that the development build is not optimized.
crawler_1  | To create a production build, use npm run build.
crawler_1  | 
crawler_1  | webpack compiled successfully
crawler_1  | No issues found.
```

## Branch and Commit Format

우선 이슈를 생성한 뒤, 이슈 넘버를 참조하여 알맞는 브랜치를 생성한다<br>

### 형태
카테고리/이슈-브랜치명<br>
(예) develop/#12-text-sentiment-analysis

### 브랜치명 종류
- (1) feature/ : 기능
- (2) fix/ : 버그 픽스
- (3) develop/ : 개발 단위 (대단위 기능) 목표
- (4) project/ : 프로젝트 세팅 관련

### 커밋 형태
[브랜치 명] 커밋 메시지 (자유)<br>
(예) [feature/#23-deep-learning-api-integration] 모델의 파라미터를 수정