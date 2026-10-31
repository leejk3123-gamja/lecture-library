// 외부 패키지 없이 공개 파일과 다운로드 경로를 검사합니다.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../site');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/materials.js'),'utf8'),context,{timeout:1000});
const lectures=context.window.LECTURES;
assert(Array.isArray(lectures)&&lectures.length>0,'강의가 필요합니다.');
const ids=new Set();
function localFile(base,link){
  const target=path.resolve(base,decodeURIComponent(link.split('#')[0].split('?')[0]));
  assert(target.startsWith(root+path.sep),'공개 폴더 밖의 참조입니다.');
  assert(fs.existsSync(target)&&fs.statSync(target).isFile(),`파일 누락: ${link}`);
  return target;
}
for(const lecture of lectures){
  for(const key of ['id','title','category','categoryLabel','audience','date','description','symbol','page','file','fileLabel'])assert(typeof lecture[key]==='string'&&lecture[key].length,`필수 항목 누락: ${key}`);
  assert(!ids.has(lecture.id),'중복 강의 ID');ids.add(lecture.id);
  assert(['math','data','teacher'].includes(lecture.category),'분류를 확인하세요.');
  assert(Array.isArray(lecture.tags),'태그 배열이 필요합니다.');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(lecture.date)&&new Date(lecture.date).toISOString().slice(0,10)===lecture.date,'게시일을 확인하세요.');
  localFile(root,lecture.page);localFile(root,lecture.file);
}
let count=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  assert(!entry.isSymbolicLink(),'심볼릭 링크는 게시하지 않습니다.');
  if(entry.isDirectory()){walk(file);continue;}
  assert(!/\.(php|sql|env|pem|key)$/i.test(entry.name),'서버 설정·비밀 파일을 게시하지 않습니다.');
  assert(!entry.name.startsWith('.')||entry.name==='.nojekyll','숨김 파일을 확인하세요.');
  if(!entry.name.endsWith('.html'))continue;
  const html=fs.readFileSync(file,'utf8');
  assert(html.includes('lang="ko"'),'한국어 문서 선언 누락');
  const idList=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(idList).size,idList.length,'HTML ID 중복');
  for(const [,link] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(/^https?:\/\//.test(link))continue;
    if(link.startsWith('#')){assert(idList.includes(link.slice(1)),`없는 위치: ${link}`);continue;}
    assert(!link.startsWith('/'),'프로젝트 Pages에서는 상대 경로를 사용하세요.');
    localFile(path.dirname(file),link);
  }
  count++;
}}
walk(root);
console.log(`검사 통과: 강의 ${lectures.length}개, HTML ${count}개, 로컬 링크와 공개 파일 구성`);
