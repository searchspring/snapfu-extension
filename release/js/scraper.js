(function(){"use strict";const e=1e3;let t={},n=0;setInterval((()=>{if(n+=e,n>5e3&&!t.version){const e=new CustomEvent("snapfu-scrape",{detail:{timestamp:Date.now()}});document.dispatchEvent(e)}const s=["google.com"];let o=window;if(!o?.searchspring){const e=document.querySelectorAll("iframe");o=Array.from(e).filter((e=>0==s.filter((t=>e?.src.includes(t)))?.length)).filter((e=>e.src?.includes(window.location.host))).filter((e=>e.contentWindow?.searchspring))?.pop()?.contentWindow}if(o?.searchspring){const e=o.searchspring,{controller:n,version:s,context:r}=e,l=Object.keys(n||{}),c=l.map((e=>{const{type:t,store:s}=n[e],o=s.results;return{id:e,type:t,store:{loaded:s.loaded,results:o?new Array(o.length):[]},collapsed:!0}})),i={controllers:c,version:s,context:r},a=c.every(((e,n)=>{const s=t.controllers&&t.controllers[n];return s&&e.id===s.id&&e.type===s.type&&e.store.loaded===s.store.loaded&&e.store.results.length===s.store.results.length})),d=t.version===i.version,p=!a||!d;if(i.version!=t.version||i.controllers?.length!=t.controllers?.length||p){t=i;const e={timestamp:Date.now(),...t},n=new CustomEvent("snapfu-scrape",{detail:JSON.parse(JSON.stringify(e))});document.dispatchEvent(n)}}}),e)})();