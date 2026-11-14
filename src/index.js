import { MEDIA_MANIFEST } from "./media-manifest.js";

const HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"theme-color\" content=\"#08090d\">\n<meta name=\"description\" content=\"Discover films, series, anime and documentaries with gogoiTV.\">\n<title>gogoiTV — Find your next story</title>\n<style>:root{color-scheme:light;--bg:#fff;--panel:#f7f7f5;--panel2:#f1f1ee;--line:#e7e7e3;--muted:#73736f;--text:#171715;--accent:#171715;--soft:#e9e9e5;--green:#477a5b}\n*{box-sizing:border-box}\nhtml{scroll-behavior:smooth;scroll-padding-top:90px}\nbody{margin:0;background:var(--bg);color:var(--text);font-family:Inter,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}\nbutton,input{font:inherit}button{cursor:pointer;color:inherit}\n.shell{max-width:1440px;margin:auto;padding:0 5.2vw}\n.topbar{height:76px;display:flex;align-items:center;gap:34px;border-bottom:1px solid var(--line);position:relative;z-index:5;background:rgba(255,255,255,.92)}\n.brand{display:flex;align-items:center;gap:11px;font-weight:650;letter-spacing:-1.1px;font-size:23px;white-space:nowrap;color:var(--text);text-decoration:none}\n.brandmark{width:31px;height:31px;border-radius:50%;background:#171715;display:grid;place-items:center;box-shadow:none}\n.brandmark svg{width:15px}\n.nav{display:flex;gap:26px;color:#62625e;font-size:12px;white-space:nowrap}\n.nav a{color:inherit;text-decoration:none;transition:color .18s}.nav a:hover,.nav a.active{color:#111}\n.searchbar{margin-left:auto;display:flex;align-items:center;gap:9px;border:1px solid var(--line);background:#fafaf8;border-radius:999px;padding:0 14px;height:39px;width:min(310px,32vw)}\n.searchbar:focus-within{border-color:#aaa}.searchbar svg{width:16px;opacity:.6;flex:none}\n.searchbar input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#171715;font-size:11px}\n.searchbar input::placeholder{color:#92928c}\n.top-actions{display:flex;align-items:center;gap:9px}\n.avatar{width:35px;height:35px;border:1px solid var(--line);border-radius:50%;background:#f4f4f1;display:grid;place-items:center;color:#343430;font-weight:600;font-size:11px}\n.hero{min-height:510px;display:flex;align-items:center;position:relative;isolation:isolate;overflow:hidden;margin:0 calc(-5.2vw);padding:70px 5.2vw 75px;background:linear-gradient(110deg,#f7f7f4 0%,#f4f4f0 53%,#ecece7 100%)}\n.hero:before{content:\"\";position:absolute;width:550px;height:550px;border-radius:50%;right:7%;top:-19%;z-index:-1;background:radial-gradient(circle at 42% 38%,#fff 0,#e6e6df 48%,#d9d9d0 72%,transparent 73%);opacity:.78}\n.hero:after{content:\"\";position:absolute;width:300px;height:300px;border:1px solid #d5d5cd;border-radius:50%;right:15%;top:15%;z-index:-1;box-shadow:0 0 0 35px #ffffff24,0 0 0 70px #ffffff18}\n.hero-copy{max-width:670px;position:relative;z-index:1}\n.eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#77776f;font-weight:650}\n.hero h1{font-size:clamp(46px,6.2vw,82px);letter-spacing:-5px;line-height:.99;margin:20px 0 20px;font-weight:550;max-width:690px}\n.hero p{color:#5d5d57;line-height:1.75;font-size:15px;max-width:500px;margin:0}\n.hero-meta{display:flex;align-items:center;gap:12px;margin:19px 0;color:#62625d;font-size:11px}\n.meta-rating{color:#826d43}.dot{width:3px;height:3px;background:#aaa;border-radius:50%}\n.hero-actions{display:flex;align-items:center;gap:10px;margin-top:27px;flex-wrap:wrap}\n.primary,.secondary,.ghost{border-radius:999px;padding:13px 20px;font-size:11px;font-weight:650;border:1px solid transparent;transition:transform .18s ease,background .18s ease,border-color .18s ease}\n.primary{background:#171715;color:#fff}.primary:hover{transform:translateY(-2px);background:#343430}\n.secondary{background:transparent;color:#171715;border-color:#c9c9c2}.secondary:hover,.ghost:hover{background:#e9e9e3}\n.ghost{background:#f8f8f6;border-color:var(--line)}\nbutton:disabled{opacity:.45;cursor:not-allowed}\n.section{padding:30px 0 10px}\n.section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:17px}\n.section h2{font-size:20px;letter-spacing:-.65px;margin:0;font-weight:550}\n.section-head p{color:var(--muted);font-size:11px;margin:7px 0 0}\n.row-link{border:0;background:none;color:#55554f;font-size:11px;padding:7px 0}.row-link:hover{color:#000}\n.shelf{display:flex;gap:15px;overflow-x:auto;padding:2px 1px 17px;scrollbar-width:thin;scrollbar-color:#d0d0c9 transparent}\n.card{position:relative;flex:0 0 clamp(140px,14vw,185px);border:0;padding:0;background:none;text-align:left;transition:transform .2s ease}\n.card:hover{transform:translateY(-3px)}\n.poster{position:relative;aspect-ratio:2/3;border-radius:8px;overflow:hidden;background:#eeeee9;border:1px solid #e6e6e0;box-shadow:none}\n.poster img{width:100%;height:100%;object-fit:cover;display:block}\n.poster-fallback{position:absolute;inset:0;display:grid;place-items:center;padding:18px;text-align:center;color:#77776f;font-weight:600;font-size:13px;background:linear-gradient(145deg,#e5e5de,#f5f5f1)}\n.card-title{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:10px 1px 4px}\n.card-sub{font-size:10px;color:#77776f;margin:0 1px}\n.card-rating{position:absolute;right:7px;top:7px;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.92);font-size:9px;color:#4e4b40}\n.genres{display:flex;gap:8px;flex-wrap:wrap;padding:2px 0 15px}\n.genre-chip{border:1px solid #deded8;border-radius:999px;background:#fff;padding:9px 14px;color:#55554f;font-size:10px;transition:.18s}\n.genre-chip:hover,.genre-chip.active{background:#171715;border-color:#171715;color:#fff}\n.status-panel{margin:15px 0 24px;border:1px solid var(--line);border-radius:10px;padding:14px 17px;background:#fafaf8;color:#65655f;font-size:11px;line-height:1.65;display:flex;align-items:center;gap:12px}\n.status-dot{width:7px;height:7px;border-radius:50%;background:#b79a58;flex:none}\n.status-panel.error{border-color:#e7c9c9;color:#985858}.status-panel.error .status-dot{background:#b85b5b}\n.status-panel.success .status-dot{background:#568c67}\n.empty{padding:34px 18px;text-align:center;color:#85857e;border:1px dashed #dcdcd5;border-radius:10px;font-size:11px}\n.search-view{display:none;min-height:50vh;padding:40px 0}.search-view.show{display:block}\n.results-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(135px,1fr));gap:18px 13px}\n.footer{margin-top:48px;border-top:1px solid var(--line);padding:28px 0 37px;color:#77776f;font-size:10px;display:flex;justify-content:space-between;gap:20px;align-items:center}\n.footer strong{color:#252521}.credits{display:flex;align-items:center;gap:12px;max-width:530px;line-height:1.6}\n.tmdb-logo{width:76px;height:auto;display:block;opacity:.8}.footer a{color:#55554f}\n.modal{position:fixed;inset:0;z-index:20;background:rgba(20,20,18,.55);backdrop-filter:blur(12px);display:none;align-items:center;justify-content:center;padding:18px}\n.modal.show{display:flex}.modal-card{width:min(850px,100%);max-height:92vh;overflow:auto;border:1px solid #e3e3dd;border-radius:16px;background:#fff;box-shadow:0 25px 90px #0002;position:relative}\n.modal-backdrop{height:260px;background:linear-gradient(0deg,#fff 0%,transparent 100%),#e7e7e1;background-size:cover;background-position:center 25%}\n.modal-close{position:absolute;right:16px;top:16px;width:34px;height:34px;border-radius:50%;border:1px solid #ffffff88;background:#ffffffd9;display:grid;place-items:center;font-size:18px}\n.modal-body{padding:0 30px 28px;margin-top:-60px;position:relative}\n.modal-title{font-size:clamp(26px,4vw,44px);letter-spacing:-1.7px;line-height:1;margin:0 0 12px;font-weight:550}\n.modal-meta{display:flex;gap:10px;flex-wrap:wrap;color:#77776f;font-size:10px;margin-bottom:17px}\n.modal-overview{font-size:12px;line-height:1.8;color:#55554f;max-width:720px}\n.modal-subhead{font-size:12px;margin:22px 0 10px}.cast-list{display:flex;gap:9px;flex-wrap:wrap}\n.cast-pill{border:1px solid var(--line);background:#fafaf8;border-radius:999px;padding:7px 10px;font-size:10px;color:#55554f}\n.watch-btn{border:1px solid #d9d9d2;background:#f7f7f4;padding:9px 13px;border-radius:999px;font-size:10px;margin-top:5px}\n.modal-note{font-size:10px;color:#77776f;margin-top:12px}\n.skeleton{background:linear-gradient(90deg,#ededE8,#f7f7f4,#ededE8);background-size:200% 100%;animation:shine 1.2s infinite}\n@keyframes shine{to{background-position:-200% 0}}\n.hidden{display:none!important}.mobile-search{display:none}\n@media(max-width:900px){.nav{gap:15px}.hero{min-height:470px}.searchbar{width:min(260px,30vw)}}\n@media(max-width:650px){.shell{padding:0 18px}.topbar{height:66px;gap:12px}.brand{font-size:20px}.nav{display:none}.searchbar{width:auto;flex:1;padding:0 10px;height:36px}.searchbar input{font-size:10px}.top-actions{display:none}\n.hero{margin:0 -18px;padding:65px 18px 55px;min-height:490px;align-items:flex-end;background:linear-gradient(145deg,#f7f7f4,#e9e9e3)}\n.hero:before{width:330px;height:330px;right:-100px;top:-90px;opacity:.6}.hero:after{width:190px;height:190px;right:-25px;top:8%}\n.hero h1{font-size:49px;letter-spacing:-3.2px;margin:15px 0}.hero p{font-size:13px;max-width:390px}\n.section{padding-top:23px}.section h2{font-size:17px}.card{flex-basis:135px}\n.modal{padding:0}.modal-card{border-radius:0;max-height:100vh;height:100vh;border:0}.modal-backdrop{height:230px}.modal-body{padding:0 20px 28px}\n.footer{flex-direction:column;align-items:flex-start}.credits{align-items:flex-start}.results-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:15px 10px}}\n@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}\n</style>\n</head>\n<body>\n<div class=\"shell\">\n<header class=\"topbar\">\n  <a class=\"brand\" href=\"#\" aria-label=\"gogoiTV home\"><span class=\"brandmark\"><svg viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M8 5.5v13l11-6.5-11-6.5Z\" fill=\"white\"/></svg></span>gogoiTV</a>\n  <nav class=\"nav\" aria-label=\"Primary navigation\"><a href=\"#\" class=\"active\" data-nav=\"home\">Home</a><a href=\"#movies\" data-nav=\"movies\">Movies</a><a href=\"#series\" data-nav=\"series\">Series</a><a href=\"#watchlist\" data-nav=\"watchlist\">My List</a></nav>\n  <form class=\"searchbar\" id=\"searchForm\" role=\"search\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"10.8\" cy=\"10.8\" r=\"6.8\"/><path d=\"m16 16 5 5\"/></svg><input id=\"searchInput\" type=\"search\" maxlength=\"100\" placeholder=\"Search movies, series, people...\" aria-label=\"Search titles\"><span id=\"searchHint\" class=\"hidden\">↵</span></form>\n  <div class=\"top-actions\"><button class=\"avatar\" id=\"listButton\" aria-label=\"Open my list\">BR</button></div>\n</header>\n\n<main id=\"homeView\">\n  <section class=\"hero\" id=\"hero\">\n    <div class=\"hero-copy\">\n      <div class=\"eyebrow\" id=\"heroEyebrow\">A more considered way to discover</div>\n      <h1 id=\"heroTitle\">Stories worth<br>your time.</h1>\n      <p id=\"heroOverview\">A quieter place to discover films, series and documentaries. Find something worth watching, without the noise.</p>\n      <div class=\"hero-meta\" id=\"heroMeta\"><span>Curated discovery</span><span class=\"dot\"></span><span>Movies & series</span></div>\n      <div class=\"hero-actions\"><button class=\"primary\" id=\"heroDetails\" disabled>Explore title&nbsp; ↗</button><button class=\"secondary\" id=\"heroBrowse\">Browse catalogue</button></div>\n    </div>\n  </section>\n\n  <div id=\"catalogStatus\" class=\"status-panel\"><span class=\"status-dot\"></span><span>Connecting to the gogoiTV catalogue…</span></div>\n  <section class=\"section\" id=\"genreSection\"><div class=\"section-head\"><div><h2>Find your atmosphere</h2><p>Pick a genre and explore the catalogue.</p></div></div><div class=\"genres\" id=\"genreChips\"><span class=\"genre-chip\">Loading genres…</span></div></section>\n  <div id=\"shelves\">\n    <section class=\"section\" id=\"movies\"><div class=\"section-head\"><div><h2>Trending this week</h2><p>What people are discovering right now.</p></div></div><div class=\"shelf\" id=\"trendingShelf\"><div class=\"empty\">Loading titles…</div></div></section>\n    <section class=\"section\"><div class=\"section-head\"><div><h2>Popular movies</h2><p>Big stories for your next movie night.</p></div><button class=\"row-link\" data-more=\"movie\">Explore movies ↗</button></div><div class=\"shelf\" id=\"moviesShelf\"><div class=\"empty\">Loading titles…</div></div></section>\n    <section class=\"section\" id=\"series\"><div class=\"section-head\"><div><h2>Series worth settling into</h2><p>Find your next episode obsession.</p></div><button class=\"row-link\" data-more=\"tv\">Explore series ↗</button></div><div class=\"shelf\" id=\"seriesShelf\"><div class=\"empty\">Loading titles…</div></div></section>\n  </div>\n</main>\n\n<section class=\"search-view\" id=\"searchView\" aria-live=\"polite\">\n  <div class=\"section-head\"><div><h2 id=\"searchTitle\">Search results</h2><p id=\"searchSubtitle\">Find something worth watching.</p></div><button class=\"row-link\" id=\"clearSearch\">Back to home</button></div>\n  <div class=\"results-grid\" id=\"searchResults\"></div>\n</section>\n<section class=\"search-view\" id=\"watchlistView\" aria-live=\"polite\">\n  <div class=\"section-head\"><div><h2>My List</h2><p>Saved on this device. No account required.</p></div><button class=\"row-link\" id=\"clearList\">Clear list</button></div>\n  <div class=\"results-grid\" id=\"watchlistResults\"></div>\n</section>\n\n<footer class=\"footer\">\n  <div><strong>gogoiTV</strong> · Cinema discovery for the open web.<br><span>IPFS-powered playback is being built separately from catalogue metadata.</span></div>\n  <div class=\"credits\">\n    <a href=\"https://www.themoviedb.org/\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"The Movie Database\"><img class=\"tmdb-logo\" src=\"https://www.themoviedb.org/assets/2/v4/logos/blue_long.svg\" alt=\"The Movie Database (TMDB)\" loading=\"lazy\" onerror=\"this.style.display='none'\"></a>\n    <span>This product uses the TMDB API but is not endorsed or certified by TMDB. <a href=\"https://www.themoviedb.org/about/logos-attribution\" target=\"_blank\" rel=\"noopener noreferrer\">Attribution & logo guidance</a>.</span>\n  </div>\n</footer>\n</div>\n\n<div class=\"modal\" id=\"detailModal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"detailTitle\">\n  <div class=\"modal-card\"><div class=\"modal-backdrop\" id=\"detailBackdrop\"></div><button class=\"modal-close\" id=\"closeModal\" aria-label=\"Close details\">×</button>\n    <div class=\"modal-body\"><div class=\"eyebrow\" id=\"detailType\">DETAILS</div><h2 class=\"modal-title\" id=\"detailTitle\">Loading…</h2><div class=\"modal-meta\" id=\"detailMeta\"></div><p class=\"modal-overview\" id=\"detailOverview\"></p><div class=\"modal-subhead\">Cast</div><div class=\"cast-list\" id=\"detailCast\"></div><button class=\"watch-btn\" id=\"saveTitle\">＋ Add to My List</button><div class=\"modal-note\" id=\"playNote\">Checking for an authorised IPFS source…</div></div>\n  </div>\n</div>\n\n<script>\n(function(){\n\"use strict\";\nconst API=\"/api/catalog\";\nconst IMG=\"https://image.tmdb.org/t/p/\";\nconst $=function(id){return document.getElementById(id);};\nlet currentHero=null;\nlet currentDetail=null;\nlet lastFocus=null;\nlet genreCache=[];\nconst listKey=\"gogoitv.watchlist.v1\";\nfunction escapeHtml(value){return String(value==null?\"\":value).replace(/[&<>\"']/g,function(c){return {\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c];});}\nfunction titleOf(item){return item.title||item.name||item.original_title||item.original_name||\"Untitled\";}\nfunction yearOf(item){const d=item.release_date||item.first_air_date||\"\";return d?String(d).slice(0,4):\"\";}\nfunction posterOf(item,size){return item.poster_path?IMG+(size||\"w342\")+item.poster_path:\"\";}\nfunction backdropOf(item){return item.backdrop_path?IMG+\"w1280\"+item.backdrop_path:\"\";}\nfunction ratingOf(item){const n=Number(item.vote_average||0);return n? n.toFixed(1):\"—\";}\nfunction typeOf(item){return item.media_type===\"tv\"||item.type===\"tv\"||item.first_air_date?\"tv\":\"movie\";}\nfunction updateStatus(message,kind){const el=$(\"catalogStatus\");el.className=\"status-panel\"+(kind?\" \"+kind:\"\");el.innerHTML='<span class=\"status-dot\"></span><span>'+escapeHtml(message)+'</span>';}\nasync function api(path,absolute){const response=await fetch((absolute?\"\":API)+path,{headers:{\"accept\":\"application/json\"},cache:\"default\"});let data={};try{data=await response.json();}catch(e){}if(!response.ok){const error=new Error(data.message||\"Catalogue request failed.\");error.code=data.code||\"API_ERROR\";error.status=response.status;throw error;}return data;}\nfunction card(item){const id=Number(item.id);const type=typeOf(item);const poster=posterOf(item);const title=escapeHtml(titleOf(item));const year=escapeHtml(yearOf(item));const rating=ratingOf(item);const image=poster?'<img src=\"'+escapeHtml(poster)+'\" alt=\"'+title+'\" loading=\"lazy\" onerror=\"this.parentElement.querySelector(\\'.poster-fallback\\').classList.remove(\\'hidden\\');this.remove()\">':\"\";return '<button class=\"card\" type=\"button\" data-id=\"'+id+'\" data-type=\"'+type+'\" aria-label=\"Open '+title+'\"><div class=\"poster\">'+image+'<span class=\"poster-fallback '+(poster?\"hidden\":\"\")+'\">'+title+'</span>'+(rating!==\"—\"?'<span class=\"card-rating\">★ '+rating+'</span>':\"\")+'</div><div class=\"card-title\">'+title+'</div><p class=\"card-sub\">'+(type===\"tv\"?\"Series\":\"Movie\")+(year?\" · \"+year:\"\")+'</p></button>';}\nfunction renderShelf(id,items){const el=$(id);const valid=(items||[]).filter(function(item){return item&&item.id&&item.poster_path;});el.innerHTML=valid.length?valid.map(card).join(\"\"):'<div class=\"empty\">No titles to show right now.</div>';}\nfunction showHome(){ $(\"homeView\").classList.remove(\"hidden\");$(\"searchView\").classList.remove(\"show\");$(\"watchlistView\").classList.remove(\"show\");setNav(\"home\");}\nfunction setNav(which){document.querySelectorAll(\"[data-nav]\").forEach(function(a){a.classList.toggle(\"active\",a.getAttribute(\"data-nav\")===which);});}\nfunction showSearch(){ $(\"homeView\").classList.add(\"hidden\");$(\"watchlistView\").classList.remove(\"show\");$(\"searchView\").classList.add(\"show\");setNav(\"\");}\nfunction showWatchlist(){ $(\"homeView\").classList.add(\"hidden\");$(\"searchView\").classList.remove(\"show\");$(\"watchlistView\").classList.add(\"show\");setNav(\"watchlist\");renderWatchlist();}\nfunction getList(){try{return JSON.parse(localStorage.getItem(listKey)||\"[]\");}catch(e){return [];}}\nfunction setList(items){try{localStorage.setItem(listKey,JSON.stringify(items));}catch(e){}}\nfunction renderWatchlist(){const items=getList();$(\"watchlistResults\").innerHTML=items.length?items.map(card).join(\"\"):'<div class=\"empty\">Your list is empty. Save titles you want to come back to.</div>';}\nfunction setHero(item){if(!item)return;currentHero=item;const title=titleOf(item);$(\"heroEyebrow\").textContent=(item.media_type===\"tv\"?\"SERIES SPOTLIGHT\":\"FEATURED DISCOVERY\")+\" · GOGOITV\";$(\"heroTitle\").textContent=title;$(\"heroOverview\").textContent=item.overview||\"A story worth discovering. Open the details to learn more.\";$(\"heroMeta\").innerHTML='<span class=\"meta-rating\">★ '+ratingOf(item)+'</span><span class=\"dot\"></span><span>'+escapeHtml(typeOf(item)===\"tv\"?\"Series\":\"Movie\")+'</span>'+(yearOf(item)?'<span class=\"dot\"></span><span>'+escapeHtml(yearOf(item))+'</span>':\"\");const bg=backdropOf(item);$(\"hero\").style.setProperty(\"--hero-image\",bg?'linear-gradient(90deg,rgba(8,9,13,.08),rgba(8,9,13,.08)),url(\"'+bg.replace(/\"/g,\"%22\")+'\")':\"transparent\");$(\"heroDetails\").disabled=false;}\nasync function loadHome(){try{const results=await Promise.all([api(\"/trending?type=all&window=week\"),api(\"/popular?type=movie\"),api(\"/popular?type=tv\"),api(\"/genres?type=movie\")]);const trending=(results[0].results||[]).filter(function(item){return item.media_type===\"movie\"||item.media_type===\"tv\";});const movies=results[1].results||[];const series=results[2].results||[];renderShelf(\"trendingShelf\",trending);renderShelf(\"moviesShelf\",movies);renderShelf(\"seriesShelf\",series);const feature=trending.find(function(x){return x.backdrop_path&&x.overview;})||trending[0];if(feature)setHero(feature);genreCache=results[3].genres||[];renderGenres(genreCache);updateStatus(\"Catalogue connected · \"+trending.length+\" trending titles loaded. Choose a title to explore its details.\",\"success\");}catch(error){renderShelf(\"trendingShelf\",[]);renderShelf(\"moviesShelf\",[]);renderShelf(\"seriesShelf\",[]);if(error.code===\"TMDB_NOT_CONFIGURED\"){updateStatus(\"TMDB is not connected yet. Add the TMDB API Read Access Token as the Cloudflare Worker secret TMDB_API_READ_ACCESS_TOKEN, then the catalogue will load here.\",\"error\");}else{updateStatus(error.message+\" Try again in a moment.\",\"error\");}}}\nfunction renderGenres(genres){$(\"genreChips\").innerHTML=genres.slice(0,16).map(function(g){return '<button class=\"genre-chip\" type=\"button\" data-genre=\"'+Number(g.id)+'\">'+escapeHtml(g.name)+'</button>';}).join(\"\")||'<span class=\"genre-chip\">Genres unavailable</span>';}\nasync function showCollection(type){showSearch();const label=type===\"tv\"?\"Popular series\":\"Popular movies\";$(\"searchTitle\").textContent=label;$(\"searchSubtitle\").textContent=\"Popular right now on The Movie Database.\";$(\"searchResults\").innerHTML='<div class=\"empty\">Loading titles…</div>';try{const data=await api(\"/popular?type=\"+encodeURIComponent(type));const items=(data.results||[]).filter(function(x){return x.poster_path;});$(\"searchResults\").innerHTML=items.length?items.map(card).join(\"\"):'<div class=\"empty\">No titles found.</div>';}catch(error){$(\"searchResults\").innerHTML='<div class=\"empty\">'+escapeHtml(error.message)+'</div>';}}\nasync function runGenre(id,name){showSearch();$(\"searchTitle\").textContent=name;$(\"searchSubtitle\").textContent=\"Popular titles in this genre.\"; $(\"searchResults\").innerHTML='<div class=\"empty\">Finding titles…</div>';try{const data=await api(\"/discover?type=movie&genre=\"+encodeURIComponent(id));$(\"searchResults\").innerHTML=(data.results||[]).filter(function(x){return x.poster_path;}).map(card).join(\"\")||'<div class=\"empty\">No titles found in this genre.</div>';}catch(e){$(\"searchResults\").innerHTML='<div class=\"empty\">'+escapeHtml(e.message)+'</div>';}}\nasync function search(query){const q=String(query||\"\").trim();if(!q)return;showSearch();$(\"searchTitle\").textContent='Results for “'+q+'”';$(\"searchSubtitle\").textContent=\"Movies, series and people from The Movie Database.\"; $(\"searchResults\").innerHTML='<div class=\"empty\">Searching the catalogue…</div>';try{const data=await api(\"/search?q=\"+encodeURIComponent(q));const items=(data.results||[]).filter(function(x){return (x.media_type===\"movie\"||x.media_type===\"tv\")&&x.poster_path;});$(\"searchResults\").innerHTML=items.length?items.map(card).join(\"\"):'<div class=\"empty\">No matching movies or series. Try another search.</div>';}catch(error){$(\"searchResults\").innerHTML='<div class=\"empty\">'+escapeHtml(error.message)+'</div>';}}\nasync function openDetails(id,type,trigger){lastFocus=trigger||document.activeElement;currentDetail=null;$(\"detailModal\").classList.add(\"show\");document.body.style.overflow=\"hidden\";$(\"detailTitle\").textContent=\"Loading details…\";$(\"detailOverview\").textContent=\"\";$(\"detailMeta\").textContent=\"\";$(\"detailCast\").innerHTML=\"\";$(\"detailBackdrop\").style.backgroundImage=\"\";$(\"saveTitle\").disabled=true;$(\"playNote\").textContent=\"Checking for an authorised IPFS source…\";try{const data=await api(\"/details?type=\"+encodeURIComponent(type)+\"&id=\"+encodeURIComponent(id));currentDetail={id:Number(data.id),type:type,title:titleOf(data),poster_path:data.poster_path,backdrop_path:data.backdrop_path,overview:data.overview,release_date:data.release_date,first_air_date:data.first_air_date,vote_average:data.vote_average};$(\"detailType\").textContent=type===\"tv\"?\"SERIES\":\"MOVIE\";$(\"detailTitle\").textContent=titleOf(data);$(\"detailOverview\").textContent=data.overview||\"No synopsis is available.\";const genres=(data.genres||[]).slice(0,4).map(function(g){return g.name;});const year=yearOf(data);const duration=type===\"movie\"&&data.runtime?data.runtime+\" min\":type===\"tv\"&&data.number_of_seasons?data.number_of_seasons+\" season\"+(data.number_of_seasons===1?\"\":\"s\"):\"\";$(\"detailMeta\").textContent=[year,type===\"tv\"?\"Series\":\"Movie\",duration,ratingOf(data)!==\"—\"?\"★ \"+ratingOf(data):\"\",genres.join(\" · \")].filter(Boolean).join(\"  ·  \");const back=backdropOf(data);if(back)$(\"detailBackdrop\").style.backgroundImage='linear-gradient(0deg,#12131a 0%,transparent 100%),url(\"'+back.replace(/\"/g,\"%22\")+'\")';const cast=(data.credits&&data.credits.cast||[]).slice(0,8);$(\"detailCast\").innerHTML=cast.map(function(person){return '<span class=\"cast-pill\">'+escapeHtml(person.name)+(person.character?\" · \"+escapeHtml(person.character):\"\")+'</span>';}).join(\"\")||'<span class=\"cast-pill\">Cast information unavailable</span>';$(\"saveTitle\").disabled=false;syncSaveButton();api(\"/api/media/resolve?type=\"+encodeURIComponent(type)+\"&id=\"+encodeURIComponent(id),true).then(function(result){if(!currentDetail||currentDetail.id!==Number(id)||currentDetail.type!==type)return;$(\"playNote\").textContent=result.playable?\"A rights-cleared IPFS source is connected. Playback controls are coming in the next milestone.\":\"Not playable yet: no rights-cleared IPFS source has been added for this title.\";}).catch(function(){if(currentDetail&&currentDetail.id===Number(id)&&currentDetail.type===type)$(\"playNote\").textContent=\"Source availability could not be checked. No playable source is assumed.\";});}catch(error){$(\"detailTitle\").textContent=\"Details unavailable\";$(\"detailOverview\").textContent=error.message;$(\"detailType\").textContent=\"CATALOGUE\";}}\nfunction closeDetails(){ $(\"detailModal\").classList.remove(\"show\");document.body.style.overflow=\"\";if(lastFocus&&lastFocus.focus)lastFocus.focus();}\nfunction syncSaveButton(){if(!currentDetail)return;const exists=getList().some(function(x){return x.id===currentDetail.id&&x.type===currentDetail.type;});$(\"saveTitle\").textContent=exists?\"✓ Saved to My List\":\"＋ Add to My List\";}\nfunction saveCurrent(){if(!currentDetail)return;const list=getList();const index=list.findIndex(function(x){return x.id===currentDetail.id&&x.type===currentDetail.type;});if(index>=0)list.splice(index,1);else list.unshift(currentDetail);setList(list);syncSaveButton();}\n$(\"searchForm\").addEventListener(\"submit\",function(e){e.preventDefault();search($(\"searchInput\").value);});\n$(\"clearSearch\").addEventListener(\"click\",showHome);\n$(\"heroBrowse\").addEventListener(\"click\",function(){$(\"movies\").scrollIntoView({behavior:\"smooth\"});});\n$(\"heroDetails\").addEventListener(\"click\",function(){if(currentHero)openDetails(currentHero.id,typeOf(currentHero),$(\"heroDetails\"));});\n$(\"closeModal\").addEventListener(\"click\",closeDetails);\n$(\"detailModal\").addEventListener(\"click\",function(e){if(e.target===$(\"detailModal\"))closeDetails();});\ndocument.addEventListener(\"keydown\",function(e){if(e.key===\"Escape\")closeDetails();});\n$(\"saveTitle\").addEventListener(\"click\",saveCurrent);\n$(\"listButton\").addEventListener(\"click\",showWatchlist);\n$(\"clearList\").addEventListener(\"click\",function(){setList([]);renderWatchlist();});\ndocument.addEventListener(\"click\",function(e){const cardEl=e.target.closest(\"[data-id][data-type]\");if(cardEl){openDetails(cardEl.getAttribute(\"data-id\"),cardEl.getAttribute(\"data-type\"),cardEl);return;}const genre=e.target.closest(\"[data-genre]\");if(genre){runGenre(genre.getAttribute(\"data-genre\"),genre.textContent);return;}const more=e.target.closest(\"[data-more]\");if(more){const type=more.getAttribute(\"data-more\");showCollection(type);}});\ndocument.querySelectorAll(\"[data-nav]\").forEach(function(link){link.addEventListener(\"click\",function(e){const which=link.getAttribute(\"data-nav\");if(which===\"home\"){e.preventDefault();showHome();}else if(which===\"watchlist\"){e.preventDefault();showWatchlist();}else if(which===\"movies\"||which===\"series\"){e.preventDefault();showCollection(which===\"movies\"?\"movie\":\"tv\");}});});\nloadHome();\n})(); \n</script>\n</body>\n</html>";


const TMDB_BASE = "https://api.themoviedb.org/3";

function json(data, status, cacheControl) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl || "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}


const RIGHTS_BASES = new Set(["public-domain", "creator-owned", "licensed"]);
const CID_V0_RE = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
const CID_V1_RE = /^b[a-z2-7]{20,}$/;

function validIsoDate(value) {
  return typeof value === "string" && value.length <= 40 && !Number.isNaN(Date.parse(value));
}

function validIpfsPath(value) {
  if (typeof value !== "string" || !value || value.length > 512 || value.startsWith("/") || value.endsWith("/") || value.includes("\\") || value.includes("?") || value.includes("#")) return false;
  const parts = value.split("/");
  return parts.every(function(part) {
    return part && part !== "." && part !== ".." && /^[A-Za-z0-9._~-]+$/.test(part);
  });
}

function normalizeManifestItem(entry) {
  if (!entry || entry.active !== true || typeof entry.id !== "string" || !/^[a-z0-9][a-z0-9-]{2,63}$/.test(entry.id)) return null;
  const tmdb = entry.tmdb || {};
  if (!["movie", "tv"].includes(tmdb.type) || !Number.isSafeInteger(tmdb.id) || tmdb.id <= 0) return null;
  if (typeof entry.title !== "string" || !entry.title.trim() || entry.title.length > 180) return null;

  const rights = entry.rights || {};
  if (rights.status !== "cleared" || !RIGHTS_BASES.has(rights.basis)) return null;
  if (!Array.isArray(rights.territories) || !rights.territories.some(function(t) { return String(t).toLowerCase() === "worldwide"; })) return null;
  if (!validIsoDate(rights.verifiedAt) || Date.parse(rights.verifiedAt) > Date.now() + 300000) return null;
  if (rights.validFrom && (!validIsoDate(rights.validFrom) || Date.parse(rights.validFrom) > Date.now())) return null;
  if (rights.validUntil && (!validIsoDate(rights.validUntil) || Date.parse(rights.validUntil) <= Date.now())) return null;
  let evidence;
  try { evidence = new URL(rights.evidenceUrl); } catch { return null; }
  if (evidence.protocol !== "https:" || evidence.username || evidence.password) return null;

  const media = entry.media || {};
  if (!["hls", "mp4"].includes(media.protocol)) return null;
  if (typeof media.cid !== "string" || !(CID_V0_RE.test(media.cid) || CID_V1_RE.test(media.cid))) return null;
  if (!validIpfsPath(media.path)) return null;
  if (!Number.isSafeInteger(media.durationSeconds) || media.durationSeconds < 1 || media.durationSeconds > 86400) return null;
  if (media.protocol === "hls" && (!media.path.toLowerCase().endsWith(".m3u8") || media.mimeType !== "application/vnd.apple.mpegurl")) return null;
  if (media.protocol === "mp4" && (!media.path.toLowerCase().endsWith(".mp4") || media.mimeType !== "video/mp4")) return null;
  if (media.sizeBytes !== undefined && (!Number.isSafeInteger(media.sizeBytes) || media.sizeBytes < 1)) return null;
  if (media.sha256 !== undefined && (typeof media.sha256 !== "string" || !/^[a-fA-F0-9]{64}$/.test(media.sha256))) return null;

  const audioLanguages = media.audioLanguages === undefined ? [] : media.audioLanguages;
  if (!Array.isArray(audioLanguages) || audioLanguages.length > 20 || !audioLanguages.every(function(x) { return typeof x === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(x); })) return null;
  const subtitles = media.subtitles === undefined ? [] : media.subtitles;
  if (!Array.isArray(subtitles) || subtitles.length > 20 || !subtitles.every(function(x) {
    return x && typeof x.language === "string" && /^[a-z]{2,3}(-[A-Z]{2})?$/.test(x.language) &&
      typeof x.label === "string" && x.label.length > 0 && x.label.length <= 80 &&
      validIpfsPath(x.path) && x.mimeType === "text/vtt";
  })) return null;

  return {
    id: entry.id,
    title: entry.title.trim(),
    tmdb: { type: tmdb.type, id: tmdb.id },
    rights: {
      basis: rights.basis,
      evidenceUrl: evidence.href,
      territories: ["worldwide"],
      verifiedAt: rights.verifiedAt,
      ...(rights.validFrom ? { validFrom: rights.validFrom } : {}),
      ...(rights.validUntil ? { validUntil: rights.validUntil } : {})
    },
    media: {
      protocol: media.protocol,
      cid: media.cid,
      path: media.path,
      mimeType: media.mimeType,
      durationSeconds: media.durationSeconds,
      ...(media.sizeBytes ? { sizeBytes: media.sizeBytes } : {}),
      ...(media.sha256 ? { sha256: media.sha256.toLowerCase() } : {}),
      audioLanguages: audioLanguages,
      subtitles: subtitles.map(function(x) { return { language: x.language, label: x.label, path: x.path, mimeType: x.mimeType }; })
    }
  };
}

function getManifestState() {
  const all = Array.isArray(MEDIA_MANIFEST.items) ? MEDIA_MANIFEST.items : [];
  const active = all.filter(function(item) { return item && item.active === true; });
  const counts = new Map();
  for (const item of active) {
    const tmdb = item.tmdb || {};
    if (["movie", "tv"].includes(tmdb.type) && Number.isSafeInteger(tmdb.id)) {
      const key = tmdb.type + ":" + tmdb.id;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const items = [];
  let invalidCount = 0;
  for (const item of active) {
    const tmdb = item.tmdb || {};
    const key = tmdb.type + ":" + tmdb.id;
    const normalized = normalizeManifestItem(item);
    if (!normalized || counts.get(key) !== 1) {
      invalidCount++;
      continue;
    }
    items.push(normalized);
  }
  return { items: items, invalidCount: invalidCount };
}

function publicMediaItem(item) {
  return {
    id: item.id,
    title: item.title,
    tmdb: item.tmdb,
    rights: item.rights,
    media: item.media,
    ipfsUri: "ipfs://" + item.media.cid + "/" + item.media.path
  };
}

function handleMediaCatalogue(url) {
  const state = getManifestState();
  const cache = "public, max-age=30, s-maxage=60, stale-while-revalidate=300";
  if (url.pathname === "/api/media/manifest") {
    return json({
      ok: true,
      schemaVersion: MEDIA_MANIFEST.schemaVersion,
      version: MEDIA_MANIFEST.version,
      updatedAt: MEDIA_MANIFEST.updatedAt,
      count: state.items.length,
      items: state.items.map(publicMediaItem)
    }, 200, cache);
  }
  if (url.pathname === "/api/media/resolve") {
    const type = url.searchParams.get("type") || "";
    const id = url.searchParams.get("id") || "";
    if (!["movie", "tv"].includes(type) || !/^\d{1,12}$/.test(id)) {
      return json({ ok: false, code: "INVALID_PARAMS", message: "A valid movie or tv id is required." }, 400);
    }
    const item = state.items.find(function(x) { return x.tmdb.type === type && x.tmdb.id === Number(id); });
    if (!item) return json({ ok: true, playable: false, reason: "NO_RIGHTS_CLEARED_SOURCE", tmdb: { type: type, id: Number(id) } }, 200, cache);
    return json({ ok: true, playable: true, asset: publicMediaItem(item) }, 200, cache);
  }
  return json({ ok: false, code: "NOT_FOUND", message: "Media endpoint not found." }, 404);
}

function intParam(value, fallback, min, max) {
  const n = Number.parseInt(value || "", 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

async function tmdbRequest(path, token) {
  const response = await fetch(TMDB_BASE + path, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "authorization": "Bearer " + token
    }
  });
  const body = await response.text();
  let data;
  try { data = JSON.parse(body); } catch { data = {}; }
  if (!response.ok) {
    const error = new Error("The Movie Database request failed.");
    error.status = response.status;
    error.tmdbStatus = response.status;
    throw error;
  }
  return data;
}

async function handleCatalog(url, env) {
  const path = url.pathname;
  if (path.startsWith("/api/media/")) return handleMediaCatalogue(url);
  const token = env.TMDB_API_READ_ACCESS_TOKEN;
  if (!token) {
    return json({
      ok: false,
      code: "TMDB_NOT_CONFIGURED",
      message: "The TMDB API Read Access Token has not been configured on this Worker."
    }, 503);
  }

  try {
    const page = intParam(url.searchParams.get("page"), 1, 1, 500);
    let data;

    if (path === "/api/catalog/trending") {
      const type = url.searchParams.get("type") || "all";
      const window = url.searchParams.get("window") || "week";
      if (!["all", "movie", "tv"].includes(type) || !["day", "week"].includes(window)) {
        return json({ ok: false, code: "INVALID_PARAMS", message: "Unsupported trending parameters." }, 400);
      }
      data = await tmdbRequest("/trending/" + type + "/" + window + "?page=" + page + "&language=en-US", token);
    } else if (path === "/api/catalog/popular") {
      const type = url.searchParams.get("type") || "movie";
      if (!["movie", "tv"].includes(type)) {
        return json({ ok: false, code: "INVALID_PARAMS", message: "Type must be movie or tv." }, 400);
      }
      data = await tmdbRequest("/" + type + "/popular?page=" + page + "&language=en-US", token);
      data.results = (data.results || []).map(function(item) {
        item.media_type = type;
        return item;
      });
    } else if (path === "/api/catalog/search") {
      const query = (url.searchParams.get("q") || "").trim().slice(0, 100);
      if (!query) return json({ ok: false, code: "QUERY_REQUIRED", message: "Enter a search term." }, 400);
      data = await tmdbRequest("/search/multi?query=" + encodeURIComponent(query) + "&include_adult=false&page=" + page + "&language=en-US", token);
    } else if (path === "/api/catalog/details") {
      const type = url.searchParams.get("type") || "";
      const id = url.searchParams.get("id") || "";
      if (!["movie", "tv"].includes(type) || !/^\d{1,12}$/.test(id)) {
        return json({ ok: false, code: "INVALID_PARAMS", message: "A valid movie or tv id is required." }, 400);
      }
      data = await tmdbRequest("/" + type + "/" + id + "?append_to_response=credits,videos&language=en-US", token);
    } else if (path === "/api/catalog/genres") {
      const type = url.searchParams.get("type") || "movie";
      if (type === "all") {
        const results = await Promise.all([
          tmdbRequest("/genre/movie/list?language=en-US", token),
          tmdbRequest("/genre/tv/list?language=en-US", token)
        ]);
        const map = new Map();
        for (const g of results[0].genres || []) map.set("movie-" + g.id, Object.assign({}, g, { media_type: "movie" }));
        for (const g of results[1].genres || []) map.set("tv-" + g.id, Object.assign({}, g, { media_type: "tv" }));
        data = { genres: Array.from(map.values()) };
      } else if (["movie", "tv"].includes(type)) {
        data = await tmdbRequest("/genre/" + type + "/list?language=en-US", token);
      } else {
        return json({ ok: false, code: "INVALID_PARAMS", message: "Type must be movie, tv or all." }, 400);
      }
    } else if (path === "/api/catalog/discover") {
      const type = url.searchParams.get("type") || "movie";
      const genre = url.searchParams.get("genre") || "";
      if (!["movie", "tv"].includes(type) || !/^\d{1,5}$/.test(genre)) {
        return json({ ok: false, code: "INVALID_PARAMS", message: "A valid type and genre id are required." }, 400);
      }
      data = await tmdbRequest("/discover/" + type + "?with_genres=" + genre + "&sort_by=popularity.desc&include_adult=false&page=" + page + "&language=en-US", token);
      data.results = (data.results || []).map(function(item) {
        item.media_type = type;
        return item;
      });
    } else {
      return json({ ok: false, code: "NOT_FOUND", message: "Catalogue endpoint not found." }, 404);
    }

    return json(data, 200, "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  } catch (error) {
    const status = error.tmdbStatus === 404 ? 404 :
      error.tmdbStatus === 401 || error.tmdbStatus === 403 ? 502 :
      error.tmdbStatus === 429 ? 503 : 502;
    return json({
      ok: false,
      code: error.tmdbStatus === 429 ? "TMDB_RATE_LIMIT" : "TMDB_UPSTREAM_ERROR",
      message: status === 404 ? "This title could not be found." :
        error.tmdbStatus === 429 ? "The catalogue is busy. Please try again shortly." :
        "The catalogue is temporarily unavailable. Please try again."
    }, status);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        app: "gogoiTV",
        version: "0.3.0",
        storage: "IPFS gateways",
        database: false,
        tmdbConfigured: Boolean(env.TMDB_API_READ_ACCESS_TOKEN),
        mediaManifestVersion: MEDIA_MANIFEST.version,
        mediaManifestCount: getManifestState().items.length,
        mediaManifestInvalidCount: getManifestState().invalidCount
      }, 200);
    }
    if (url.pathname.startsWith("/api/")) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
      }
      return handleCatalog(url, env);
    }
    if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 });
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }
    return new Response(request.method === "HEAD" ? null : HTML, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "x-frame-options": "DENY",
        "permissions-policy": "camera=(), microphone=(), geolocation=()"
      }
    });
  }
};
