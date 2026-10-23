export function init(){
'use strict';
'use strict';
const $=sel=>document.querySelector(sel);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeRead=(key,defaultValue)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??defaultValue}catch{return defaultValue}};
const safeSave=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}};
const today=new Date();const currentY=today.getFullYear(),currentM=today.getMonth();const pad=n=>String(n).padStart(2,'0');const dateId=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;const iso=(day,offset=0)=>{const d=new Date(today.getFullYear(),today.getMonth(),day+offset);return dateId(d)};
const months=['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];const weekdays=['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'];const formatDay=s=>{const [y,m,d]=s.split('-').map(Number);return `${d}. ${months[m-1]}`};const formatLong=s=>{const [y,m,d]=s.split('-').map(Number);const x=new Date(y,m-1,d);return `${weekdays[x.getDay()]} ${d}. ${months[m-1]}`};
const seeds=[
{title:'Kaffe & nye fjes',date:iso(16),time:'15:00',place:'Studentsenteret',cat:'Sosialt',description:'Kom alene eller ta med noen! Vi møtes over en kopp kaffe og lar praten gå. Null press, bare nye bekjentskaper.',shade:'yellow',symbol:'☕'},
{title:'Quizkveld på hjørnet',date:iso(17),time:'19:00',place:'Sentrum',cat:'Sosialt',description:'Samle et lag eller bli med på et. En god quiz og kanskje litt konkurranseinstinkt.',shade:'green',symbol:'✎'},
{title:'Løp rundt Store Lungegårdsvann',date:iso(18),time:'11:00',place:'Store Lungegårdsvann',cat:'Sport',description:'Rolig løpetur i fellesskap. Tempoet tilpasses gruppa, så alle kan være med.',shade:'blue',symbol:'↗'},
{title:'Åpen scene & musikk',date:iso(20),time:'20:00',place:'Kulturhuset',cat:'Kultur',description:'Spill en låt, les et dikt eller kom for å heie på noen. Alle sjangre er velkomne.',shade:'pink',symbol:'♫'},
{title:'Brettspill uten regler',date:iso(21),time:'17:30',place:'Studentsenteret',cat:'Sosialt',description:'Vi stiller med spill, du stiller med nysgjerrigheten. En hyggelig pause fra pensum.',shade:'paper',symbol:'♟'},
{title:'Kreativ søndag',date:iso(25),time:'13:00',place:'Verkstedet',cat:'Kultur',description:'Tegn, klipp, mal eller bare heng med. Her er det lov å lage noe helt uperfekt.',shade:'yellow',symbol:'✳'},
{title:'Studentfotball',date:iso(26),time:'16:30',place:'Nygårdsparken',cat:'Sport',description:'Uformell fotballøkt for alle nivåer. Ta med sko, litt vann og godt humør.',shade:'green',symbol:'⚽'},
{title:'Film & fredagsmat',date:iso(30),time:'18:00',place:'Kollektivet',cat:'Annet',description:'En rolig filmkveld der alle tar med litt snacks. Vi stemmer over filmen sammen.',shade:'pink',symbol:'▣'}
].map((x,i)=>({id:`seed-${i}`, ...x}));
let custom=safeRead('bsh-events-v1',[]);if(!Array.isArray(custom))custom=[];
let events=[...seeds,...custom];let joined=safeRead('bsh-joined-v1',[]);if(!Array.isArray(joined))joined=[];
let selected=dateId(today),viewY=currentY,viewM=currentM,activeFilter='Alle',activeId=null;
let calendarMode='month',weekAnchor=new Date(today.getFullYear(),today.getMonth(),today.getDate());
const allEvents=()=>events.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
const fromId=id=>{const [y,m,d]=id.split('-').map(Number);return new Date(y,m-1,d)};
const mondayOf=date=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());d.setDate(d.getDate()-(d.getDay()+6)%7);return d};
const longMonth=(d)=>months[d.getMonth()];
function drawCalendar(){
 const title=$('#calendar-title'),grid=$('#calendar-grid');
 $('#view-week').classList.toggle('active',calendarMode==='week');$('#view-month').classList.toggle('active',calendarMode==='month');
 $('#view-week').setAttribute('aria-pressed',String(calendarMode==='week'));$('#view-month').setAttribute('aria-pressed',String(calendarMode==='month'));
 $('#prev-month').setAttribute('aria-label',calendarMode==='week'?'Forrige uke':'Forrige måned');$('#next-month').setAttribute('aria-label',calendarMode==='week'?'Neste uke':'Neste måned');
 grid.classList.toggle('week-mode',calendarMode==='week');grid.innerHTML='';
 const addDay=(date,isWeek)=>{
   const id=dateId(date),hasEvents=events.filter(e=>e.date===id),b=document.createElement('button');
   b.type='button';b.className='day'+(id===selected?' selected':'')+(id===dateId(today)?' today':'')+(hasEvents.length?' has-event':'');
   if(isWeek){const n=document.createElement('span');n.className='day-number';n.textContent=date.getDate();b.appendChild(n);const m=document.createElement('span');m.className='day-month-label';m.textContent=months[date.getMonth()].slice(0,3);b.appendChild(m);if(hasEvents.length){const label=document.createElement('span');label.className='day-event-label';label.textContent=`${hasEvents.length} ${hasEvents.length===1?'aktivitet':'aktiviteter'}`;b.appendChild(label)}}else b.textContent=date.getDate();
   b.setAttribute('aria-label',`${formatLong(id)}${hasEvents.length?', '+hasEvents.length+' arrangementer':''}`);b.setAttribute('aria-pressed',String(id===selected));
   b.onclick=()=>{selected=id;weekAnchor=fromId(id);drawCalendar()};grid.appendChild(b);
 };
 for(const x of ['man','tir','ons','tor','fre','lør','søn']){const e=document.createElement('div');e.className='dow';e.textContent=x;grid.appendChild(e)}
 if(calendarMode==='week'){
   const start=mondayOf(weekAnchor),finish=new Date(start.getFullYear(),start.getMonth(),start.getDate()+6);
   title.textContent=start.getMonth()===finish.getMonth()&&start.getFullYear()===finish.getFullYear()?`${start.getDate()}.–${finish.getDate()}. ${longMonth(finish)} ${finish.getFullYear()}`:`${start.getDate()}. ${longMonth(start).slice(0,3)} – ${finish.getDate()}. ${longMonth(finish).slice(0,3)} ${finish.getFullYear()}`;
   for(let i=0;i<7;i++)addDay(new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),true);
 }else{
   title.textContent=months[viewM].charAt(0).toUpperCase()+months[viewM].slice(1)+' '+viewY;
   const shift=(new Date(viewY,viewM,1).getDay()+6)%7,days=new Date(viewY,viewM+1,0).getDate();
   for(let i=0;i<shift;i++){const b=document.createElement('span');b.className='day empty';grid.appendChild(b)}
   for(let n=1;n<=days;n++)addDay(new Date(viewY,viewM,n),false);
 }
 $('#selected-day').textContent=formatLong(selected);const es=allEvents().filter(e=>e.date===selected);
 $('#calendar-description').textContent=es.length?`${es.length} arrangement${es.length===1?'':'er'} denne dagen. Vil du bli med?`:'Ingen arrangementer registrert for denne datoen ennå.';
 $('#day-event-list').innerHTML=es.length?es.map(e=>`<button type="button" class="day-event" data-id="${escapeHTML(e.id)}"><span>${escapeHTML(e.time)} · ${escapeHTML(e.cat)}</span><strong>${escapeHTML(e.title)}</strong></button>`).join(''):'<div class="none-event">En ledig dag er også en mulighet. ✳</div>';
 $('#day-event-list').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openDetail(b.dataset.id));
}
function changePeriod(by){if(calendarMode==='week'){weekAnchor=new Date(weekAnchor.getFullYear(),weekAnchor.getMonth(),weekAnchor.getDate()+by*7);selected=dateId(weekAnchor);viewY=weekAnchor.getFullYear();viewM=weekAnchor.getMonth()}else{let d=new Date(viewY,viewM+by,1);viewY=d.getFullYear();viewM=d.getMonth();selected=dateId(d);weekAnchor=d}drawCalendar()}
$('#prev-month').onclick=()=>changePeriod(-1);$('#next-month').onclick=()=>changePeriod(1);
$('#view-week').onclick=()=>{calendarMode='week';weekAnchor=fromId(selected);drawCalendar()};
$('#view-month').onclick=()=>{calendarMode='month';const d=fromId(selected);viewY=d.getFullYear();viewM=d.getMonth();drawCalendar()};
$('#today-btn').onclick=()=>{viewY=currentY;viewM=currentM;selected=dateId(today);weekAnchor=fromId(selected);drawCalendar()};
const rotations=['-2.2deg','1.5deg','-1deg','2deg','1.7deg','-2.4deg','1deg','-1.5deg'];
let favorites=safeRead('bsh-favorites-v1',[]);if(!Array.isArray(favorites))favorites=[];
let pinned=safeRead('bsh-pinned-v1',[]);if(!Array.isArray(pinned))pinned=[];
const validList=list=>list.filter(id=>events.some(e=>e.id===id));
function boardList(){const q=$('#event-search').value.trim().toLocaleLowerCase('no');return allEvents().filter(e=>(activeFilter==='Alle'||(activeFilter==='Favoritter'?favorites.includes(e.id):e.cat===activeFilter))&&(e.title+' '+e.description+' '+e.place+' '+e.cat).toLocaleLowerCase('no').includes(q)).sort((a,b)=>Number(pinned.includes(b.id))-Number(pinned.includes(a.id))||a.date.localeCompare(b.date)||a.time.localeCompare(b.time))}
function updateDetailActions(){if(!activeId)return;const e=events.find(x=>x.id===activeId);if(!e)return;const pin=$('#detail-pin'),fav=$('#detail-fav');pin.setAttribute('aria-pressed',String(pinned.includes(e.id)));pin.textContent=pinned.includes(e.id)?'📌 Løsne fra toppen':'📌 Fest på tavla';fav.setAttribute('aria-pressed',String(favorites.includes(e.id)));fav.textContent=favorites.includes(e.id)?'♥ Lagret som favoritt':'♡ Lagre som favoritt'}
function toggleEventState(kind,id){const list=kind==='pin'?pinned:favorites;const has=list.includes(id);const next=has?list.filter(x=>x!==id):[...list,id];if(kind==='pin'){pinned=next;safeSave('bsh-pinned-v1',pinned)}else{favorites=next;safeSave('bsh-favorites-v1',favorites)}drawBoard();updateDetailActions();toast(kind==='pin'?(has?'Lappen er løsnet fra toppen.':'Lappen er festet øverst på tavla!'):(has?'Fjernet fra favoritter.':'Lagret i favorittene dine!'))}
function drawBoard(){
  const scroller=$('#cork-scroll'),prevScroll=scroller.scrollTop,es=boardList();
  $('#event-board').innerHTML=es.map((e,i)=>`<article class="sticky ${pinned.includes(e.id)?'is-pinned':''}" data-shade="${escapeHTML(e.shade||'paper')}" style="--rotate:${rotations[i%rotations.length]}">${pinned.includes(e.id)?'<span class="sticky-pinned-flag">FESTET</span>':''}<div class="sticky-actions"><button type="button" class="sticky-tool pin-icon" data-pin="${escapeHTML(e.id)}" aria-label="${pinned.includes(e.id)?'Løsne':'Fest'} ${escapeHTML(e.title)} ${pinned.includes(e.id)?'fra':'på'} tavla" aria-pressed="${pinned.includes(e.id)}" title="Fest eller løsne på tavla">📌</button><button type="button" class="sticky-tool" data-fav="${escapeHTML(e.id)}" aria-label="${favorites.includes(e.id)?'Fjern':'Lagre'} ${escapeHTML(e.title)} ${favorites.includes(e.id)?'fra':'som'} favoritt" aria-pressed="${favorites.includes(e.id)}" title="Lagre som favoritt">${favorites.includes(e.id)?'♥':'♡'}</button></div><button type="button" class="sticky-open" data-id="${escapeHTML(e.id)}" aria-label="Les mer om ${escapeHTML(e.title)}"><span class="sticky-date"><span>${escapeHTML(formatDay(e.date))} / ${escapeHTML(e.time)}</span><span aria-hidden="true">${escapeHTML(e.symbol||'✳')}</span></span><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.description.length>88?e.description.slice(0,85)+'…':e.description)}</p><span class="sticky-foot"><span>⌁ ${escapeHTML(e.place)}</span><span>${joined.includes(e.id)?'✓ Med':'↗ Les mer'}</span></span></button></article>`).join('')||'<div class="empty-board">Ingen lapper her ennå. Prøv et annet søk eller lagre en favoritt!</div>';
  $('#event-count').innerHTML=`<strong>${es.length} ${es.length===1?'lapp':'lapper'}</strong> på tavla · ${pinned.length} festet`;
  $('#fav-count').textContent=favorites.length;
  $('#event-board').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openDetail(b.dataset.id));
  $('#event-board').querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>toggleEventState('pin',b.dataset.pin));
  $('#event-board').querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>toggleEventState('fav',b.dataset.fav));
  scroller.scrollTop=prevScroll;
}
$('#event-search').oninput=drawBoard;$('#event-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>t.classList.toggle('active',t===b));drawBoard()});
function showModal(id){const m=$('#'+id);m.classList.add('open');m._prevFocus=document.activeElement;document.body.style.overflow='hidden';m.querySelector('button,input,textarea')?.focus()}
function closeModal(){const m=document.querySelector('.dialog-backdrop.open');if(!m)return;m.classList.remove('open');document.body.style.overflow='';m._prevFocus?.focus()}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);document.querySelectorAll('.dialog-backdrop').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeModal()}));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function openDetail(id){const e=events.find(x=>x.id===id);if(!e)return;activeId=e.id;$('#detail-category').textContent=e.cat+' / '+formatDay(e.date);$('#detail-title').textContent=e.title;$('#detail-description').textContent=e.description;$('#detail-info').innerHTML=`<div>◷ &nbsp; ${escapeHTML(formatLong(e.date))} kl. ${escapeHTML(e.time)}</div><div>⌖ &nbsp; ${escapeHTML(e.place)}</div><div>✳ &nbsp; ${escapeHTML(e.cat)}</div>`;$('#join-btn').textContent=joined.includes(id)?'✓ Du er med! (trykk for å melde av)':'Bli med →';updateDetailActions();showModal('detail-modal')}
$('#join-btn').onclick=()=>{if(!activeId)return;const already=joined.includes(activeId);joined=already?joined.filter(x=>x!==activeId):[...joined,activeId];safeSave('bsh-joined-v1',joined);$('#join-btn').textContent=already?'Bli med →':'✓ Du er med! (trykk for å melde av)';drawBoard();drawRewards();toast(already?'Du er meldt av.':'Så hyggelig – du er med!')};
document.querySelectorAll('[data-open-create]').forEach(b=>b.onclick=()=>showModal('create-modal'));$('#new-date').value=dateId(today);$('#new-date').min=dateId(today);$('#new-time').value='18:00';
$('#create-event-form').onsubmit=e=>{e.preventDefault();const ev={id:'my-'+Date.now(),title:$('#new-title').value.trim(),date:$('#new-date').value,time:$('#new-time').value,place:$('#new-place').value.trim(),cat:$('#new-cat').value,description:$('#new-description').value.trim(),shade:['yellow','green','pink','blue','paper'][Math.floor(Math.random()*5)],symbol:'✳'};if(!ev.title||!ev.date||!ev.time||!ev.place||!ev.description)return;custom.push(ev);events.push(ev);safeSave('bsh-events-v1',custom);drawRewards();activeFilter='Alle';document.querySelectorAll('[data-filter]').forEach(t=>t.classList.toggle('active',t.dataset.filter==='Alle'));$('#event-search').value='';viewY=+ev.date.slice(0,4);viewM=+ev.date.slice(5,7)-1;selected=ev.date;weekAnchor=fromId(ev.date);drawCalendar();drawBoard();$('#create-event-form').reset();$('#new-date').value=dateId(today);$('#new-time').value='18:00';closeModal();toast('Din post-it-lapp henger nå på tavla!');document.getElementById('oppslagstavle').scrollIntoView({behavior:'smooth'})};
const rewardCatalog=[
 {id:'hei',symbol:'✳',name:'Første hei',price:20,description:'Ditt første digitale merke. For deg som tør å dukke opp.'},
 {id:'utforsker',symbol:'↗',name:'Byutforsker',price:45,description:'Et lite bevis på at Bergen er best når man blir med.'},
 {id:'stjerne',symbol:'★',name:'Studentstjerne',price:80,description:'Et digitalt hedersmerke til en ekte initiativtaker.'}
];
let redeemed=safeRead('bsh-redeemed-v1',[]);if(!Array.isArray(redeemed))redeemed=[];
function drawRewards(){
 const earned=joined.filter(id=>events.some(e=>e.id===id)).length*20+custom.length*15+posts.length*10;
 const spent=rewardCatalog.filter(r=>redeemed.includes(r.id)).reduce((sum,r)=>sum+r.price,0);
 const available=Math.max(0,earned-spent);
 $('#reward-available').textContent=available;$('#reward-count').textContent=available;
 $('#reward-earned').textContent=earned;$('#reward-spent').textContent=spent;
 const next=rewardCatalog.find(r=>!redeemed.includes(r.id));
 $('#reward-bar').style.width=(next?Math.min(100,earned/next.price*100):100)+'%';
 $('#reward-next').textContent=next?`Neste merke: ${next.name}`:'Alle merker samlet!';
 $('#reward-next-points').textContent=next?`${next.price} p`:'✳';
 $('#reward-list').innerHTML=rewardCatalog.map(r=>{
  const claimed=redeemed.includes(r.id),canBuy=available>=r.price;
  return `<article class="reward-card${claimed?' claimed':''}"><div class="reward-card-symbol" aria-hidden="true">${r.symbol}</div><h3>${escapeHTML(r.name)}</h3><p>${escapeHTML(r.description)}</p><div class="reward-card-foot"><span>${r.price} poeng</span><button class="reward-redeem" type="button" data-redeem="${r.id}" ${claimed||!canBuy?'disabled':''}>${claimed?'✓ Samlet':canBuy?'Løs inn →':'Trenger flere poeng'}</button></div></article>`
 }).join('');
 $('#reward-collection').textContent=redeemed.length?`Dine merker: ${rewardCatalog.filter(r=>redeemed.includes(r.id)).map(r=>r.symbol+' '+r.name).join('  ·  ')}`:'Ingen merker samlet ennå – det begynner med et hei.';
 $('#reward-list').querySelectorAll('[data-redeem]').forEach(b=>b.onclick=()=>{
  const r=rewardCatalog.find(x=>x.id===b.dataset.redeem);if(!r||redeemed.includes(r.id))return;
  const earnedNow=joined.filter(id=>events.some(e=>e.id===id)).length*20+custom.length*15+posts.length*10;
  const spentNow=rewardCatalog.filter(x=>redeemed.includes(x.id)).reduce((sum,x)=>sum+x.price,0);
  if(earnedNow-spentNow<r.price){drawRewards();return}
  redeemed.push(r.id);safeSave('bsh-redeemed-v1',redeemed);drawRewards();toast(`Hurra! Du har samlet merket «${r.name}»!`);
 });
}

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3200)}
let posts=safeRead('bsh-posts-v1',[]);if(!Array.isArray(posts))posts=[];
const starterPosts=[{id:'seedpost-1',name:'Studentliv i Bergen',initials:'BS',when:'I går',description:'Høsten i Bergen er noe helt eget. 🍂 Husk å sjekke oppslagstavla for ting som skjer denne uka!',visual:'campus',likes:24,comments:[{name:'Julie',text:'Elsker dette!'}]},{id:'seedpost-2',name:'Emma N.',initials:'EN',when:'For 3 dager siden',description:'Kaffe mellom forelesningene ble plutselig dagens høydepunkt ☕ Noen som blir med neste gang?',visual:'coffee',likes:17,comments:[{name:'Martin',text:'Jeg er med!'}]}];
let liked=safeRead('bsh-liked-v1',[]);if(!Array.isArray(liked))liked=[];let myComments=safeRead('bsh-comments-v1',{});if(!myComments||typeof myComments!=='object')myComments={};
function drawPosts(){const data=[...posts,...starterPosts];$('#feed-posts').innerHTML=data.map(p=>{const comments=[...(p.comments||[]),...(myComments[p.id]||[])];const likeCount=(p.likes||0)+(liked.includes(p.id)?1:0);return `<article class="post"><div class="post-heading"><span class="avatar">${escapeHTML(p.initials||'DU')}</span><span><div class="post-name">${escapeHTML(p.name)}</div><div class="post-meta">${escapeHTML(p.when||'Akkurat nå')} · Bergen</div></span></div>${p.image?`<div class="post-photo"><img src="${p.image}" alt="Bilde delt av ${escapeHTML(p.name)}"></div>`:p.visual?`<div class="post-photo"><div class="photo-art ${p.visual==='coffee'?'coffee':'campus'}" role="img" aria-label="Illustrasjon fra studentlivet i Bergen"></div></div>`:''}<div class="post-bottom"><div class="post-actions"><button type="button" class="icon-btn ${liked.includes(p.id)?'liked':''}" data-like="${escapeHTML(p.id)}" aria-label="Lik innlegg">${liked.includes(p.id)?'♥':'♡'} <span>${likeCount} liker</span></button><span class="icon-btn" aria-label="${comments.length} kommentarer">▤ <span>${comments.length} kommentarer</span></span></div>${p.description?`<p class="post-description"><strong>${escapeHTML(p.name)}</strong> ${escapeHTML(p.description)}</p>`:''}<div class="comments">${comments.map(c=>`<div class="comment"><strong>${escapeHTML(c.name)}:</strong> ${escapeHTML(c.text)}</div>`).join('')}</div><form class="comment-form" data-comment="${escapeHTML(p.id)}"><input aria-label="Skriv en kommentar" maxlength="250" placeholder="Skriv en kommentar ..." required><button type="submit">Send →</button></form></div></article>`}).join('');$('#feed-posts').querySelectorAll('[data-like]').forEach(b=>b.onclick=()=>{const id=b.dataset.like;liked=liked.includes(id)?liked.filter(x=>x!==id):[...liked,id];safeSave('bsh-liked-v1',liked);drawPosts()});$('#feed-posts').querySelectorAll('[data-comment]').forEach(f=>f.onsubmit=e=>{e.preventDefault();const text=f.querySelector('input').value.trim();if(!text)return;const id=f.dataset.comment;(myComments[id]||(myComments[id]=[])).push({name:'Du',text});safeSave('bsh-comments-v1',myComments);drawPosts();toast('Kommentaren er lagt til!')})}
let imageData=null;const photoInput=$('#post-image');photoInput.onchange=async()=>{const file=photoInput.files[0];if(!file)return;if(!file.type.startsWith('image/')){toast('Velg en bildefil.');return}if(file.size>15*1024*1024){toast('Bildet er for stort (maks 15 MB).');return}try{const read=await new Promise((res,rej)=>{const reader=new FileReader();reader.onload=()=>res(reader.result);reader.onerror=rej;reader.readAsDataURL(file)});const img=new Image();img.src=read;await new Promise((res,rej)=>{img.onload=res;img.onerror=rej});const c=document.createElement('canvas');const size=Math.min(1,1100/Math.max(img.width,img.height));c.width=Math.max(1,Math.round(img.width*size));c.height=Math.max(1,Math.round(img.height*size));c.getContext('2d').drawImage(img,0,0,c.width,c.height);imageData=c.toDataURL('image/jpeg',.75);$('#preview-image').src=imageData;$('#upload-preview').style.display='block'}catch{toast('Kunne ikke lese bildet. Prøv et annet bilde.')}};$('#remove-photo').onclick=()=>{imageData=null;photoInput.value='';$('#upload-preview').style.display='none'};
$('#post-form').onsubmit=e=>{e.preventDefault();const text=$('#post-text').value.trim();if(!text&&!imageData){toast('Skriv noe eller velg et bilde først.');return}const p={id:'post-'+Date.now(),name:'Du',initials:'DU',when:'Akkurat nå',description:text,image:imageData,likes:0,comments:[]};posts.unshift(p);const saved=safeSave('bsh-posts-v1',posts);$('#post-text').value='';$('#remove-photo').click();drawPosts();drawRewards();toast(saved?'Innlegget ditt er publisert!':'Innlegget er lagt til, men kunne ikke lagres til neste gang. Prøv et mindre bilde.')};
$('#share-btn').onclick=async()=>{const msg='Bli med på Bergen Student Hub!';try{await navigator.clipboard.writeText(location.href);toast('Lenken til Bergen Student Hub er kopiert!')}catch{toast(msg+' Del filen med en venn!')}};$('#contact-btn').onclick=()=>{toast('Dette er en demo. Kontaktinformasjon kommer når nettsiden publiseres.')};
$('#chat-form').onsubmit=e=>{e.preventDefault();const val=$('#chat-input').value.trim();if(!val)return;const area=$('#chat-messages');const b=document.createElement('div');b.className='chat-bubble mine';b.textContent=val;area.append(b);$('#chat-input').value='';const a=document.createElement('div');a.className='chat-bubble';a.textContent=/arrangement|aktivitet|lapp/i.test(val)?'Du kan finne aktiviteter på korktavla, eller trykke «Nytt arrangement» for å lage ditt eget.':/bilde|post|feed/i.test(val)?'Nederst i studentfeeden kan du skrive en melding og legge til et bilde.':'Så fint at du skriver! Dette er en demo-chat, men snart kan vi samle hele studentmiljøet her. ✳';area.append(a);area.scrollTop=area.scrollHeight};
// Three-line menu (also keyboard accessible).
let lastMenuFocus=null;const menu=$('#site-menu'),shade=$('#menu-shade'),toggle=$('#menu-toggle');
function openMenu(){lastMenuFocus=document.activeElement;menu.classList.add('open');shade.classList.add('open');menu.setAttribute('aria-hidden','false');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';$('#menu-close').focus()}
function closeMenu(){menu.classList.remove('open');shade.classList.remove('open');menu.setAttribute('aria-hidden','true');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';lastMenuFocus?.focus()}
toggle.onclick=()=>menu.classList.contains('open')?closeMenu():openMenu();$('#menu-close').onclick=closeMenu;shade.onclick=closeMenu;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu();if(e.key==='Tab'&&menu.classList.contains('open')){const all=[...menu.querySelectorAll('button:not([disabled]),a[href]')];if(!all.length)return;if(e.shiftKey&&document.activeElement===all[0]){e.preventDefault();all[all.length-1].focus()}else if(!e.shiftKey&&document.activeElement===all[all.length-1]){e.preventDefault();all[0].focus()}}});
menu.querySelectorAll('[data-menu-link]').forEach(x=>x.addEventListener('click',closeMenu));
menu.querySelector('[data-menu-create]').onclick=()=>{closeMenu();showModal('create-modal')};
menu.querySelector('[data-menu-contact]').onclick=()=>{closeMenu();showModal('contact-modal')};
menu.querySelector('[data-menu-sponsor]').onclick=()=>{closeMenu();showModal('sponsor-modal')};
function showUser(){
 const mk=list=>validList(list).length?validList(list).map(id=>{const ev=events.find(e=>e.id===id);return `<button type="button" data-profile-event="${escapeHTML(id)}"><span>${escapeHTML(ev.title)}</span><span>${escapeHTML(formatDay(ev.date))} ↗</span></button>`}).join(''):'<div class="profile-empty">Ingen arrangementer her ennå.</div>';
 $('#profile-stats').innerHTML=`<div><strong>${favorites.length}</strong><span>Favoritter</span></div><div><strong>${pinned.length}</strong><span>Festet</span></div><div><strong>${joined.length}</strong><span>Påmeldt</span></div>`;
 $('#profile-favorites').innerHTML=mk(favorites);$('#profile-pinned').innerHTML=mk(pinned);$('#profile-joined').innerHTML=mk(joined);
 $('#profile-modal').querySelectorAll('[data-profile-event]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.profileEvent;closeModal();openDetail(id)});
 showModal('profile-modal');
}
menu.querySelector('[data-menu-profile]').onclick=()=>{closeMenu();showUser()};
$('#detail-pin').onclick=()=>activeId&&toggleEventState('pin',activeId);
$('#detail-fav').onclick=()=>activeId&&toggleEventState('fav',activeId);
$('#sponsor-contact').onclick=()=>{closeModal();$('#contact-subject').value='Samarbeid / sponsing';showModal('contact-modal')};
$('#contact-form').onsubmit=async e=>{e.preventDefault();const content=`Bergen Student Hub – henvendelse\nNavn: ${$('#contact-name').value.trim()}\nEmne: ${$('#contact-subject').value.trim()}\n\n${$('#contact-message').value.trim()}`;if(!$('#contact-name').value.trim()||!$('#contact-subject').value.trim()||!$('#contact-message').value.trim())return;try{await navigator.clipboard.writeText(content);toast('Henvendelsen er kopiert! Merk: Den er ikke sendt.')}catch{const box=$('#contact-message');box.value=content;box.focus();box.select();toast('Marker og kopier teksten manuelt. Den er ikke sendt.')}};
// Contact button in side panel opens same functional contact draft rather than a placeholder.
$('#contact-btn').onclick=()=>showModal('contact-modal');
drawCalendar();drawBoard();drawRewards();drawPosts();
}
