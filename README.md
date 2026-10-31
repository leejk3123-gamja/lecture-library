# GitHub Pages 강의자료실 예제

별도 서버·DB·유료 라이브러리 없이 공개 강의자료를 운영하는 예제다. 기존 PHP 예약 시스템과 독립되어 있다. 이 폴더의 내용만 새 GitHub 저장소에 올린다.

## 먼저 확인하기

`site/index.html`을 브라우저로 열면 수학·데이터 탐구·교사 연수 강의 3개가 표시된다. 제목·설명·태그 검색과 분류 선택, 강의 상세 페이지, 활동지·CSV 다운로드를 확인할 수 있다. 강의 페이지의 `인쇄 / PDF 저장`에서 프린터를 `PDF로 저장`으로 선택하면 PDF를 만들 수 있다. 이 예제에 미리 만들어진 PDF 파일은 없으며 SVG 활동지·CSV·텍스트 파일을 제공한다.

```text
저장소 루트/
├─ .github/workflows/pages.yml  자동 게시 설정
├─ scripts/check-site.mjs       게시 전 검사
├─ site/                       이 폴더만 홈페이지로 공개
│  ├─ index.html
│  ├─ assets/                  디자인·검색·강의 목록
│  ├─ lessons/                 강의 본문 HTML
│  └─ materials/               다운로드 파일
└─ README.md
```

## GitHub에 올려 실제 운영하기

### 1. 공개 저장소 만들기

GitHub에 로그인하고 `New repository`를 누른다. 이름을 예를 들어 `lecture-library`로 정하고 Public을 선택한다. `Add a README file`을 선택하여 저장소를 생성한다. 공개해도 되는 강의자료만 사용한다.

### 2. 자동 게시 방식 설정하기

생성한 저장소에서 `Settings → Pages → Build and deployment → Source`를 `GitHub Actions`로 선택한다. 이 예제에는 워크플로가 포함되어 있으므로 GitHub가 제시하는 추가 템플릿을 만들 필요는 없다.

### 3. 예제 파일 올리기 — GitHub Desktop 권장

1. GitHub Desktop을 설치하고 GitHub 계정으로 로그인한다.
2. `File → Clone repository`에서 방금 만든 `lecture-library`를 선택한다. 예: `D:\github\lecture-library`로 복제한다. 기존 solomon 폴더와 다른 경로를 사용한다.
3. 예제 ZIP을 풀고, 그 안의 `.github`, `scripts`, `site`, `README.md`를 복제한 폴더 안에 복사한다. 예제 폴더 자체를 한 단계 더 넣지 않는다. README 교체는 이 새 예제 저장소에서만 한다.
4. Desktop의 Changes에서 위 파일만 들어왔는지 확인하고 Summary에 `공개 강의자료실 예제 추가`를 입력한다.
5. `Commit to main`을 누른 뒤 `Push origin`을 누른다. 기본 브랜치가 main인지 확인한다. 다른 이름을 사용할 경우 pages.yml의 branches를 맞춘다.
6. 숨김 폴더 `.github`가 빠지지 않았는지 GitHub 웹에서 확인한다. Windows 탐색기의 숨김 항목 표시를 켜면 확인하기 쉽다.

### 4. 배포 결과 확인하기

GitHub 저장소의 Actions 탭에서 `강의자료 홈페이지 게시`가 초록색으로 완료될 때까지 기다린다. Settings → Pages에 표시된 주소 또는 배포 작업의 github-pages 링크를 연다.

일반적인 주소는 `https://계정명.github.io/lecture-library/`다. 계정명과 저장소 이름은 실제 값으로 바꾼다. GitHub 계정 없이 새 시크릿 창에서도 자료가 열리는지 확인한다.

처음 실행이 Pages 설정 누락으로 실패했다면 Source를 GitHub Actions로 설정한 후 Actions에서 해당 실행의 `Re-run all jobs`를 선택한다.

### 웹 브라우저만 사용하려면

저장소의 `Add file → Upload files`에서 `site`와 `scripts` 폴더 및 README를 업로드한다. `.github` 폴더 업로드가 누락되면 `Add file → Create new file`을 선택하고 파일 이름에 `.github/workflows/pages.yml`을 입력한다. 제공된 pages.yml의 내용을 그대로 복사하고 main에 커밋한다. 모든 파일이 올라간 후 Actions를 실행하거나 재실행한다.

## 강의 추가하기

1. `site/lessons/functions.html`을 복사하여 `quadratic.html` 등 새 이름으로 저장한다.
2. 제목, 대상, 게시일과 본문을 새 강의에 맞게 바꾼다.
3. PDF 등을 `site/materials`에 추가하고 강의 본문의 다운로드 링크를 바꾼다.
4. `site/assets/materials.js` 배열에 아래와 같은 항목을 추가한다. 항목 사이에는 쉼표를 둔다.

```javascript
{
  id: 'quadratic',
  title: '이차함수의 그래프',
  category: 'math',
  categoryLabel: '수학',
  audience: '중학교',
  date: '2026-11-01',
  description: '포물선의 꼭짓점과 축을 알아봅니다.',
  tags: ['이차함수', '포물선'],
  symbol: 'x²',
  page: 'lessons/quadratic.html',
  file: 'materials/quadratic.pdf',
  fileLabel: '강의 PDF'
}
```

위 PDF와 HTML은 추가 방법을 보여주는 이름이며 실제 파일을 함께 만들어 올려야 한다. 분류 값은 math·data·teacher 중 하나를 사용한다. 파일명은 영문 소문자와 하이픈을 권장하고 대소문자를 정확히 맞춘다. 새 분류를 만들려면 index.html의 select와 검사 스크립트의 허용 목록도 수정한다.

Node.js가 설치되어 있다면 저장소 루트에서 다음 명령으로 검사할 수 있다. GitHub Actions도 같은 검사를 실행한다.

```powershell
node --check site/assets/app.js
node --check site/assets/materials.js
node scripts/check-site.mjs
node scripts/test-search.mjs
```

수정 후 Desktop에서 Commit → Push origin 하면 홈페이지에 자동 반영된다. 잘못 게시했을 경우 Desktop에서 해당 변경 커밋을 되돌리는 커밋을 만들고 Push한다.

## 운영 시 알아둘 점

- 자료 목록은 JavaScript 파일에서 관리한다. 별도의 관리자 업로드 화면·DB·로그인·예약 기능은 없다.
- GitHub 무료 요금제에서는 공개 저장소로 Pages를 사용할 수 있다. 저장소에 올린 원본·수정 이력도 공개되므로 공개 가능한 자료만 넣는다.
- GitHub Pages에서는 PHP가 실행되지 않는다. 기존 solomon의 app·config·database·public/api.php를 이 저장소에 복사하지 않는다.
- 웹 업로드는 파일당 25MiB, 일반 Git은 100MiB 초과 파일을 차단한다. 게시 사이트 최대 1GB와 월 대역폭 100GB 소프트 제한을 고려하여 영상·대용량 파일은 별도 서비스에 둔다.
- 외부 파일 저장소의 링크를 추가하는 경우 app.js의 safePath와 검사 로직을 함께 수정하고 허용할 https 호스트를 명시한다. 현재 예제는 로컬 자료 경로만 허용한다.
- 개인정보, 학생 명단, 비밀번호, API 키와 공개 권한이 없는 자료를 올리지 않는다. 저장소를 비공개로 만드는 것과 홈페이지 접근 제한은 별개의 설정이다.
- 이 패키지는 로컬 파일 검사만 완료했다. GitHub 계정·원격 저장소가 연결되지 않아 실제 업로드와 Pages 배포는 수행하지 않았다. 실제 브라우저와 다운로드 확인은 게시 후 수행한다.

## 공식 안내

- [GitHub Pages 배포 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Actions로 Pages 게시](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages 사용 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [파일 업로드](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
