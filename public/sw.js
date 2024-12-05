// example code found here: https://christianheilmann.com/2022/01/13/turning-a-github-page-into-a-progressive-web-app/

// Change this to your repository name
const BASE_PATH = self.location.pathname.replace(/sw\.js$/, '');
 
// Choose a different app prefix name
const APP_PREFIX = 'spos';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
const VERSION = 'version_01';
 
// The files to make available for offline use. make sure to add 
// others to this list
const URLS = [    
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/css/styles.css`,
  `${BASE_PATH}/js/app.js`
]

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(APP_PREFIX + VERSION).then(function (cache) {
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});