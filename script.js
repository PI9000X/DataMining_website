const repoURL = 'https://github.com/YOUR_USERNAME/YOUR_REPOSITORY'; // CHANGE THIS after creating your repo
for (const id of ['repoLink','footerRepo']) document.getElementById(id).href = repoURL;
const updates = document.getElementById('updates');
for (const item of projectUpdates) {
  const article = document.createElement('article'); article.className='update';
  const date = document.createElement('time'); date.dateTime=item.date; date.textContent=item.date;
  const content=document.createElement('div'); const heading=document.createElement('h3'); heading.textContent=item.title;
  const paragraph=document.createElement('p'); paragraph.textContent=item.description;
  const tag=document.createElement('span'); tag.className='pill'; tag.textContent=item.tag;
  content.append(heading,paragraph,tag); article.append(date,content); updates.append(article);
}
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('menuBtn'),nav=document.getElementById('nav');
menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
