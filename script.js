(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
    navigation.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', e => { if(e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {setMenu(false); menuButton.focus();}
    if (e.key === 'Tab' && menuButton.getAttribute('aria-expanded') === 'true') {
      const items = [menuButton, ...navigation.querySelectorAll('a')];
      if (e.shiftKey && document.activeElement === items[0]) {e.preventDefault();items.at(-1).focus();}
      else if (!e.shiftKey && document.activeElement === items.at(-1)) {e.preventDefault();items[0].focus();}
    }
  });
  matchMedia('(min-width:951px)').addEventListener('change', e => {if(e.matches)setMenu(false);});
  const dock=document.querySelector('.mobile-dock');
  const anchor=document.querySelector('.hero') || document.querySelector('.page-intro');
  if(anchor && 'IntersectionObserver' in window) new IntersectionObserver(entries => {
    dock.classList.toggle('visible', !entries[0].isIntersecting);
  }, {threshold:0}).observe(anchor);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const chosen=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;
    document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=chosen!=='all'&&card.dataset.category!==chosen;if(!card.hidden)count++;});
    document.querySelector('#filter-status').textContent=`${count} arbeten visas.`;
  }));
  const dialog=document.querySelector('#lightbox');
  let lastPhoto;
  document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{
    lastPhoto=button;
    dialog.querySelector('img').src=button.dataset.lightbox;
    dialog.querySelector('img').alt=button.querySelector('img').alt;
    dialog.querySelector('p').textContent=button.dataset.caption;
    document.body.classList.add('modal-open');
    dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastPhoto)lastPhoto.focus();});
  const form=document.querySelector('#project-brief');
  if(form)form.addEventListener('submit', e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const body=`Hej Majek!\n\nJag vill gärna prata om ett projekt.\n\nNamn: ${data.get('name')}\nTelefon: ${data.get('phone')||'Ej angivet'}\nOrt: ${data.get('place')}\nTyp av arbete: ${data.get('service')}\n\n${data.get('message')}\n\nVänliga hälsningar\n${data.get('name')}`;
    const subject=`Projektförfrågan – ${data.get('service')}`;
    window.location.href=`mailto:info@majek.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector('#brief-status').textContent='Ditt mejlutkast är förberett. Skicka det i din mejlapp. Om ingen app öppnas kan du mejla oss direkt på info@majek.se.';
  });
})();
