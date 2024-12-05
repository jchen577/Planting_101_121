// example code found here: https://christianheilmann.com/2022/01/13/turning-a-github-page-into-a-progressive-web-app/

// Change this to your repository name
const GHPATH = '/github-page-pwa';
 
// Choose a different app prefix name
const APP_PREFIX = 'gppwa_';
 
// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
const VERSION = 'version_00';
 
// The files to make available for offline use. make sure to add 
// others to this list
const URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/js/app.js`
]