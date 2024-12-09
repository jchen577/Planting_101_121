const CACHE_NAME = "seedy-place-cache-v1";
const BASE_URL = "/seedy_place_in_outer_space";
const urlsToCache = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/src/main.js`,
  `${BASE_URL}/src/Scenes/Load.js`,
  `${BASE_URL}/src/Scenes/GenerateMap.js`,
  `${BASE_URL}/src/Scenes/Game.js`,
  `${BASE_URL}/assets/player.png`,
  `${BASE_URL}/assets/galaxyBG.jpeg`,
  `${BASE_URL}/assets/earthPixel.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
