document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('item-form');
  const input = document.getElementById('item-input');
  const list = document.getElementById('items');
  const themeToggle = document.getElementById('theme-toggle');

  function renderItem(text){
    const li = document.createElement('li');
    li.textContent = text;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remove';
    btn.addEventListener('click', ()=> li.remove());
    li.appendChild(btn);
    list.prepend(li);
  }

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const v = input.value.trim();
    if(!v) return;
    renderItem(v);
    input.value = '';
    input.focus();
  });

  // Theme handling
  const themeKey = 'js-test-theme';
  function setTheme(t){
    if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem(themeKey, t) }catch(e){}
  }
  themeToggle.addEventListener('click', ()=>{
    const current = localStorage.getItem(themeKey) || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  });
  // initialize theme
  const saved = localStorage.getItem(themeKey) || 'light';
  setTheme(saved);

  // small demo items
  ['Try adding items','Toggle theme button'].forEach(renderItem);
});
