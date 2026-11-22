'use strict';
const entriesRoot = document.getElementById('entries');
const searchBox = document.getElementById('search');
const filterStrip = document.getElementById('groups');
const indexRoot = document.getElementById('index-links');
const countNode = document.getElementById('count');
const statusNode = document.getElementById('search-status');
let catalogue = [];
let selectedTopic = 'All';
let lastRenderedMath = 0;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = value => 'topic-'+String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// String.raw is important: a JavaScript string literal containing '\(' can silently lose the backslash.
function displayMath(tex) { return String.raw`\(${esc(tex)}\)`; }
function typeset() {
  if (!window.MathJax || !window.MathJax.typesetPromise) return;
  const current = ++lastRenderedMath;
  window.MathJax.typesetPromise([document.querySelector('.brand-mark'), entriesRoot])
    .catch(err => { if (current === lastRenderedMath) console.warn('Math rendering failed',err); });
}
function makeField(label, html, className='') {
  return `<div class="field ${className}"><dt>${esc(label)}</dt><dd>${html}</dd></div>`;
}
function makeEntry(item) {
  const article = document.createElement('article');
  article.className = 'specimen';
  article.id = item.id;
  article.innerHTML = `
    <div class="specimen-head"><h4><a href="#${esc(item.id)}">${esc(item.name)}</a></h4><a class="entry-anchor" href="#${esc(item.id)}" title="Direct link to this specimen" aria-label="Direct link to ${esc(item.name)}">#</a></div>
    <dl>${makeField('Dimensions', `<span class="dimension-tag">${esc(item.dimensions)}</span>`)}
      ${makeField('Definition', displayMath(item.formula), 'definition')}
      ${makeField('Operational task', esc(item.operation))}
      ${makeField('Minimality', esc(item.minimality))}
      ${makeField('Reference', `<a class="reference-link" href="${esc(item.reference)}" target="_blank" rel="noopener noreferrer">Original / related source ↗</a>`)}</dl>`;
  return article;
}
function render() {
  const term = searchBox.value.trim().toLowerCase();
  const filtered = catalogue.filter(item => (selectedTopic === 'All' || item.group === selectedTopic) &&
    [item.name,item.group,item.dimensions,item.formula,item.operation,item.minimality].some(value => String(value ?? '').toLowerCase().includes(term)));
  countNode.textContent = `(${filtered.length})`;
  statusNode.textContent = term || selectedTopic !== 'All' ? `${filtered.length} of ${catalogue.length} specimens shown` : `${catalogue.length} specimens in ${new Set(catalogue.map(x=>x.group)).size} topics`;
  entriesRoot.replaceChildren();
  if (!filtered.length) { entriesRoot.innerHTML = '<p class="empty">No matching examples. Try a different search.</p>'; return; }
  const allGroups = [...new Set(filtered.map(x => x.group))];
  for (const group of allGroups) {
    const section = document.createElement('section');
    section.className = 'chapter'; section.id = slug(group);
    const title = document.createElement('h3'); title.className='chapter-title'; title.textContent=group;
    section.append(title);
    for (const item of filtered.filter(x=>x.group===group)) section.append(makeEntry(item));
    entriesRoot.append(section);
  }
  // Leave TeX source intact if the external math library is unavailable.
  if (window.MathJax?.typesetPromise) typeset();
}
function initialize(data) {
  if (!Array.isArray(data)) throw Error('The catalogue is not an array');
  catalogue=data;
  const groups=[...new Set(data.map(x=>x.group))];
  for (const group of groups) {
    const a=document.createElement('a'); a.href='#'+slug(group); a.textContent=group; indexRoot.append(a);
  }
  const loading=indexRoot.querySelector('.quiet'); if (loading) loading.remove();
  for(const group of ['All',...groups]) {
    const button=document.createElement('button');button.type='button';button.textContent=group;
    button.classList.toggle('active',group===selectedTopic);
    button.addEventListener('click',()=>{ selectedTopic=group;for(const btn of filterStrip.children)btn.classList.toggle('active',btn.textContent===group);render(); });
    filterStrip.append(button);
  }
  render();
  if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));target?.scrollIntoView();}
}
fetch('entries.json').then(res=>{if(!res.ok)throw Error('HTTP '+res.status);return res.json();}).then(initialize).catch(err=>{entriesRoot.textContent='Could not load catalogue: '+err.message;});
searchBox.addEventListener('input',render);
window.addEventListener('zoo-mathjax-ready',typeset);
document.addEventListener('keydown', event=>{if(event.key==='/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){event.preventDefault();searchBox.focus();}});
