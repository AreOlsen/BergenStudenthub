<script>
  import { onMount } from 'svelte';
  import { init } from '$lib/app.js';

  onMount(() => {
    init();
  });
</script>

<svelte:head>
  <title>Bergen Student Hub — Studentlivet skjer her</title>
</svelte:head>

<a href="#kalender" class="skip-link">Hopp til kalenderen</a>
<header class="header"><div class="container nav">
<a href="#top" class="brand" aria-label="Bergen Student Hub, til toppen"><span class="brand-symbol"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-7.2 8-13A8 8 0 0 0 4 9c0 5.8 8 13 8 13Z"/><circle cx="12" cy="9" r="2.8"/></svg></span><span><span class="brand-name">Bergen Student Hub</span><span class="brand-city">Studentlivet i byen</span></span></a>
<nav class="main-nav" aria-label="Hovedmeny"><a href="#kalender">Kalender</a><a href="#oppslagstavle">Oppslagstavla</a><a href="#belonninger">Belønninger</a><a href="#feed">Studentfeed</a></nav>
<button type="button" class="nav-action btn btn-outline" data-open-create>+ Nytt arrangement</button>
  <button class="hamburger" id="menu-toggle" type="button" aria-controls="site-menu" aria-expanded="false" aria-label="Åpne meny"><span></span><span></span><span></span></button>
</div></header>
<div class="menu-shade" id="menu-shade" aria-hidden="true"></div>
<aside class="menu-drawer" id="site-menu" aria-label="Hovedmeny" aria-hidden="true" tabindex="-1">
  <div class="drawer-head"><div><span class="eyebrow">BERGEN STUDENT HUB</span><h2>Hvor vil du gå?</h2></div><button type="button" class="drawer-close" id="menu-close" aria-label="Lukk meny">×</button></div>
  <nav class="drawer-links" aria-label="Brukermeny">
    <button type="button" data-menu-profile><span class="drawer-index">01</span> Din bruker <span aria-hidden="true">↗</span></button>
    <a href="#belonninger" data-menu-link><span class="drawer-index">02</span> Reward <span aria-hidden="true">↗</span></a>
    <button type="button" data-menu-contact><span class="drawer-index">03</span> Kontakt oss <span aria-hidden="true">↗</span></button>
    <button type="button" data-menu-create><span class="drawer-index">04</span> Post en aktivitet <span aria-hidden="true">↗</span></button>
    <button type="button" data-menu-sponsor><span class="drawer-index">05</span> Spons oss <span aria-hidden="true">↗</span></button>
  </nav>
  <div class="drawer-foot">Gode ting skjer sammen. <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-7.2 8-13A8 8 0 0 0 4 9c0 5.8 8 13 8 13Z"/><circle cx="12" cy="9" r="2.8"/></svg></span></div>
</aside>
<main id="top"><section class="hero container" aria-label="Velkommen"><div class="hero-flex"><div class="hero-main"><span class="eyebrow">01 / Hele Bergen, ett sted</span><h1>Det skjer mer<br>enn du tror.</h1><div class="top-banner"><span>Finn folk. Finn din greie.</span><span>Skapt for studenter i Bergen.</span></div></div><div class="hero-aside">Din plass for nye folk, gode kvelder, små initiativ og alt som skjer mellom forelesningene.</div></div></section>
<section class="container" id="kalender" aria-labelledby="calendar-title"><div class="calendar-wrap"><div class="calendar-main"><div class="calendar-top"><div><div class="eyebrow">Hva skjer når?</div><h2 id="calendar-title" class="calendar-heading">Oktober 2026</h2></div><div class="calendar-actions"><div class="calendar-view" role="group" aria-label="Velg kalendervisning"><button type="button" class="view-choice" id="view-week" aria-pressed="false">Uke</button><button type="button" class="view-choice active" id="view-month" aria-pressed="true">Måned</button></div><div class="calendar-controls"><button type="button" id="prev-month" aria-label="Forrige periode">←</button><button type="button" id="today-btn" class="today-btn">I dag</button><button type="button" id="next-month" aria-label="Neste periode">→</button></div></div></div><div class="calendar-days" id="calendar-grid" aria-label="Kalender med arrangementer"></div><div class="calendar-key"><i aria-hidden="true"></i> Dager med arrangementer <span>· Trykk på en dato for å se mer</span></div></div><aside class="calendar-note"><span class="eyebrow">Valgt dato / din kalender</span><h3 id="selected-day" class="note-date">16. oktober</h3><p id="calendar-description">Finn ut hva som skjer denne dagen.</p><div id="day-event-list" class="day-event-list"></div><div class="calendar-note-bottom"><span class="eyebrow">Hele byen er en møteplass</span><strong>Ta plass. Bli med. ♡</strong></div></aside></div></section>
<section class="section container" id="oppslagstavle"><div class="section-header"><div><div class="eyebrow">02 / Oppslagstavla</div><h2>Heng med på noe.</h2></div><p>Alle gode planer starter et sted. Finn et arrangement, eller heng opp din egen lapp.</p></div><div class="board-tools"><div class="board-search"><input id="event-search" aria-label="Søk i arrangementer" placeholder="Søk etter noe du har lyst til å gjøre ..."></div><div class="filters" id="event-filters"><button type="button" class="filter active" data-filter="Alle">Alle</button><button type="button" class="filter" data-filter="Sosialt">Sosialt</button><button type="button" class="filter" data-filter="Sport">Sport</button><button type="button" class="filter" data-filter="Kultur">Kultur</button><button type="button" class="filter" data-filter="Annet">Annet</button>
    <button type="button" data-filter="Favoritter" class="filter filter-favs">♡ Favoritter <span id="fav-count">0</span></button></div></div>  <div class="board-outer">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="cork-scroll" id="cork-scroll" role="region" tabindex="0" aria-label="Korktavle: bla opp og ned gjennom alle arrangementer">
      <div class="cork"><span class="cork-label">Bergen Student Hub · Oppslag</span><div id="event-board" class="stickies" aria-live="polite"></div></div>
    </div>
    <div class="board-scroll-strip"><span>📌 Fest øverst &nbsp; · &nbsp; ♡ Lagre som favoritt</span><span>Rull inni tavla for flere lapper ↓</span></div>
  </div><div class="board-bottom"><span id="event-count"><strong>8 lapper</strong> på tavla</span><button type="button" class="outline-btn" data-open-create>+ Heng opp din egen lapp ↗</button></div></section>

<section class="rewards-section section container" id="belonninger" aria-labelledby="rewards-title">
  <div class="section-header">
    <div><div class="eyebrow">03 / Bonus for å være med</div><h2 id="rewards-title">Gjør noe. Få noe igjen.</h2></div>
    <p>Hver lille ting teller. Samle stjerner og lås opp digitale merker for studentlivet ditt.</p>
  </div>
  <div class="rewards-panel">
    <div class="reward-stats">
      <div class="reward-stamp" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-7.2 8-13A8 8 0 0 0 4 9c0 5.8 8 13 8 13Z"/><circle cx="12" cy="9" r="2.8"/></svg></div>
      <div class="reward-balance"><span class="eyebrow">Din poengsaldo</span><div><strong id="reward-available">0</strong><span> POENG</span></div></div>
      <div class="reward-stats-note"><strong>Mer aktivitet. Mer Bergen.</strong><span><span id="reward-earned">0</span> opptjente poeng totalt · <span id="reward-spent">0</span> brukt</span></div>
    </div>
    <div class="reward-earnings" aria-label="Slik tjener du poeng">
      <div><span class="earn-symbol">↗</span><span><strong>+20 poeng</strong><small>Meld deg på et arrangement</small></span></div>
      <div><span class="earn-symbol">✎</span><span><strong>+15 poeng</strong><small>Heng opp din egen lapp</small></span></div>
      <div><span class="earn-symbol">▣</span><span><strong>+10 poeng</strong><small>Del et innlegg i feeden</small></span></div>
    </div>
    <div class="reward-list" id="reward-list" aria-live="polite"></div>
    <div class="reward-bottom"><div id="reward-collection" aria-live="polite">Ingen merker samlet ennå – det begynner med et hei.</div><span>Digitale demobelønninger · Poeng lagres på denne enheten</span></div>
  </div>
</section>

<section class="community container" id="feed"><div class="community-layout"><div class="community-main"><div class="eyebrow">04 / Fra studentene</div><h2>Det som skjer<br>mellom alt annet.</h2><p class="feed-intro">Små øyeblikk, store historier og alt imellom. Del bilder, skriv en melding og se hva de andre driver med.</p><div class="composer"><div class="composer-top"><span class="avatar">DU</span><span><strong>Del noe med Bergen</strong><small>Alle studenter er invitert til å poste her</small></span></div><form id="post-form"><label class="skip-link" for="post-text">Din melding</label><textarea id="post-text" maxlength="700" placeholder="Hva har skjedd siden sist? Fortell, tips eller del et bilde ..."></textarea><div class="upload-preview" id="upload-preview"><img id="preview-image" alt="Bilde valgt for publisering"><button type="button" id="remove-photo" aria-label="Fjern valgt bilde">×</button></div><div class="composer-actions"><label class="photo-label" for="post-image">▣ &nbsp; Legg til bilde<input id="post-image" type="file" accept="image/*"></label><button class="solid-btn" type="submit">Publiser innlegg →</button></div></form></div><div id="feed-posts" aria-live="polite"></div></div><aside class="community-side" id="fellesskap"><div class="side-paper"><div class="eyebrow">Din plass i byen</div><h3>Hei, du!<br>Velkommen inn.</h3><p>Her er det plass til deg. Bli med på det som skjer, eller inviter en venn.</p><button id="share-btn" type="button">↗ Inviter en venn</button><button type="button" data-open-create>＋ Lag et arrangement</button><button type="button" id="contact-btn">✉ Kontakt oss</button></div><div class="side-dark"><div class="eyebrow">Din studentstjerne 📍</div><h3>Samle poeng. Få mer ut av Bergen.</h3><p>Få poeng når du melder deg på, lager arrangementer og deler i feeden.</p><div class="side-points"><strong id="reward-count">0</strong><span>poeng tilgjengelig</span></div><div class="progress"><div id="reward-bar"></div></div><div class="progress-text"><span id="reward-next">Neste belønning venter</span><strong id="reward-next-points">20 p</strong></div><a class="side-reward-link" href="#belonninger">Se belønningene →</a></div><div class="mini-chat"><div class="eyebrow">Studentprat</div><h3 class="mini-chat-title">Spør oss om noe.</h3><div class="chat-messages" id="chat-messages"><div class="chat-bubble">Hei! 👋 Trenger du tips til å finne arrangementer eller legge ut en lapp? Bare spør.</div></div><form id="chat-form" class="chat-form"><input id="chat-input" placeholder="Skriv en melding ..." aria-label="Melding til studentprat" maxlength="300" required><button type="submit" aria-label="Send melding">→</button></form></div></aside></div></section></main>
<footer class="footer"><div class="container footer-inner"><span><strong>Bergen Student Hub.</strong><br>Studentlivet er bedre sammen.</span><span>Laget for studenter i Bergen · <a href="#top">Tilbake til toppen ↑</a></span></div></footer>
<div class="dialog-backdrop" id="detail-modal" role="presentation"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button class="close-dialog" type="button" data-close aria-label="Lukk">×</button><span class="eyebrow" id="detail-category">Arrangement</span><h2 id="detail-title">Detaljer om arrangement</h2><p id="detail-description"></p>  <div id="detail-info" class="dialog-info"></div>
  <div class="detail-actions"><button type="button" id="detail-pin">📌 Fest på tavla</button><button type="button" id="detail-fav">♡ Lagre som favoritt</button></div>
  <button class="solid-btn" id="join-btn" type="button">Bli med →</button></div></div>
<div class="dialog-backdrop" id="create-modal" role="presentation"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="create-title"><button class="close-dialog" type="button" data-close aria-label="Lukk">×</button><span class="eyebrow">En ny lapp på tavla</span><h2 id="create-title">Hva skjer?</h2><p>Del planene dine, så kan flere være med.</p><form id="create-event-form"><label for="new-title">Navn på arrangementet</label><input id="new-title" maxlength="70" placeholder="F.eks. Brettspill og kakao" required><label for="new-date">Dato</label><input id="new-date" type="date" required><label for="new-time">Klokkeslett</label><input id="new-time" type="time" required><label for="new-place">Sted</label><input id="new-place" maxlength="80" placeholder="F.eks. Studentsenteret" required><label for="new-cat">Kategori</label><select id="new-cat"><option>Sosialt</option><option>Sport</option><option>Kultur</option><option>Annet</option></select><label for="new-description">Litt om det som skjer</label><textarea id="new-description" maxlength="350" placeholder="Hva kan folk glede seg til?" required></textarea><button class="solid-btn" type="submit">Heng opp lappen →</button></form></div></div>
<div class="dialog-backdrop" id="profile-modal" role="presentation">
 <div class="dialog user-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
  <button type="button" class="close-dialog" data-close aria-label="Lukk">×</button>
  <span class="eyebrow">01 / Din bruker</span><h2 id="profile-title">Din lille studentkrok.</h2>
  <p>Her finner du arrangementene du har lagret, festet og meldt deg på.</p>
  <div class="profile-stats" id="profile-stats"></div>
  <div class="profile-group"><h3>♡ Dine favoritter</h3><div id="profile-favorites" class="profile-list"></div></div>
  <div class="profile-group"><h3>📌 Festet på tavla</h3><div id="profile-pinned" class="profile-list"></div></div>
  <div class="profile-group"><h3>✓ Du er med på</h3><div id="profile-joined" class="profile-list"></div></div>
  <p class="dialog-disclaimer">Demo: listen er bare lagret i nettleseren din.</p>
 </div>
</div>
<div class="dialog-backdrop" id="contact-modal" role="presentation">
 <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
  <button type="button" class="close-dialog" data-close aria-label="Lukk">×</button>
  <span class="eyebrow">03 / Kontakt oss</span><h2 id="contact-title">Si hei!</h2>
  <p>En idé, et spørsmål eller noe på hjertet? Skriv en henvendelse og kopier den.</p>
  <form id="contact-form"><label for="contact-name">Navn</label><input id="contact-name" maxlength="75" required placeholder="Hva heter du?">
   <label for="contact-subject">Emne</label><input id="contact-subject" maxlength="100" required placeholder="Hva gjelder det?">
   <label for="contact-message">Melding</label><textarea id="contact-message" maxlength="1500" required placeholder="Skriv her ..."></textarea>
   <button class="solid-btn" type="submit">Kopier henvendelsen →</button>
  </form><p class="dialog-disclaimer">Dette er en prototype. Henvendelser sendes ikke automatisk.</p>
 </div>
</div>
<div class="dialog-backdrop" id="sponsor-modal" role="presentation">
 <div class="dialog sponsor-dialog" role="dialog" aria-modal="true" aria-labelledby="sponsor-title">
  <button type="button" class="close-dialog" data-close aria-label="Lukk">×</button>
  <span class="eyebrow">05 / Spons oss</span><div class="sponsor-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-7.2 8-13A8 8 0 0 0 4 9c0 5.8 8 13 8 13Z"/><circle cx="12" cy="9" r="2.8"/></svg></div>
  <h2 id="sponsor-title">Vil du bidra til studentlivet?</h2>
  <p>Bedrifter og organisasjoner kan bli med og støtte møteplasser, lavterskelaktiviteter og nye vennskap i Bergen.</p>
  <ul class="sponsor-perks"><li>Støtt aktiviteter som samler studenter</li><li>Bli en del av et lokalt studentfellesskap</li><li>Ta kontakt om mulig samarbeid</li></ul>
  <button type="button" class="solid-btn" id="sponsor-contact">Ta kontakt om samarbeid →</button>
  <p class="dialog-disclaimer">Sponsorfunksjonen er foreløpig en demo.</p>
 </div>
</div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
