'use strict';
const list = document.querySelector('#materials-list');
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safePath(value) {
  if(typeof value!=='string'||!/^(lessons|materials)\/[a-zA-Z0-9._/-]+$/.test(value)||value.split('/').includes('..'))throw new Error('자료 경로를 확인하세요.');
  return escapeHtml(value);
}
function render() {
  const term=search.value.trim().toLocaleLowerCase('ko');
  const lectures=[...(window.LECTURES||[])].sort((a,b)=>b.date.localeCompare(a.date)).filter(item=>(category.value==='all'||item.category===category.value)&&[item.title,item.description,item.audience,...item.tags].join(' ').toLocaleLowerCase('ko').includes(term));
  document.querySelector('#result-count').textContent=`총 ${lectures.length}개 강의`;
  document.querySelector('#empty').hidden=lectures.length>0;
  list.innerHTML=lectures.map(item=>`<article class="card"><div class="card-art" aria-hidden="true">${escapeHtml(item.symbol)}</div><div class="card-body"><span class="badge">${escapeHtml(item.categoryLabel)}</span><h3><a href="${safePath(item.page)}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.description)}</p><div class="meta"><span>${escapeHtml(item.audience)}</span><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time></div><div class="card-links"><a href="${safePath(item.page)}">강의 읽기 ↗</a><a href="${safePath(item.file)}" download>${escapeHtml(item.fileLabel)} ↓</a></div></div></article>`).join('');
}
search.addEventListener('input',render);category.addEventListener('change',render);render();
