const loadScript = document.getElementById('snapfu-script');
const context = loadScript?.innerText || '';
const url = loadScript?.getAttribute('url');

const script = document.createElement('script');
script.id = 'searchspring-snapfu-script';
script.src = url || '';
script.innerHTML = context.trim();
(document.head || document.documentElement).appendChild(script);
