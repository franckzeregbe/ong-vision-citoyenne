// Service Worker pour ONG Vision Citoyenne
// Améliore le fonctionnement hors-ligne et la vitesse de chargement des ressources locales.

const CACHE_NAME = 'ong-vision-citoyenne-v15';

// Ressources essentielles mises en cache à l'installation
const CORE_ASSETS = [
  './',
  './index.html',
  './css/fonts.css',
  './css/style.css',
  './css/home.css',
  './css/renovation.css',
  './css/news.css',
  './js/main.js',
  './js/layout.js',
  './js/galerie.js',
  './js/news.js',
  './js/news-render.js',
  './manifest.json',
  './assets/logo.jpeg',
  './assets/img/presidente-wassia.jpg',
  './assets/img/equipe-ceremonie.jpg',
  './assets/partenaires/onu.jpg',
  './assets/partenaires/unicef.png',
  './assets/partenaires/ecosoc.jpg',
  './assets/partenaires/banque-mondiale.jpg',
  './assets/partenaires/iom.jpg',
  './assets/partenaires/usaid.svg',
  './assets/partenaires/minhas.png',
  './assets/partenaires/ippdr.webp',
  './assets/partenaires/piducas.png',
  './assets/partenaires/eicf.jpg',
  './assets/partenaires/verdis.png',
  './assets/partenaires/hff.jpeg',
  './assets/img/galerie/don-unicef-materiel.jpg',
  './assets/img/galerie/don-unicef-remise.jpg',
  './assets/img/galerie/don-unicef-groupe.jpg',
  './assets/img/galerie/engagement-citoyen-ecole.jpg',
  './assets/img/galerie/sensibilisation-classe.jpg',
  './assets/img/galerie/mobilisation-scolaire.jpg',
  './assets/img/galerie/sensibilisation-eleves.jpg',
  './assets/img/galerie/distribution-hygiene.jpg',
  './assets/img/galerie/distribution-nord.jpg',
  './assets/img/galerie/equipe-terrain.jpg',
  './assets/img/galerie/action-terrain-ecole.jpg',
  './assets/img/galerie/suivi-projet.jpg',
  './assets/img/projets/renovation-epp/avant-sanitaires.jpg',
  './assets/img/projets/renovation-epp/apres-aire-jeux.jpg',
  './assets/img/projets/renovation-epp/apres-cour.jpg',
  './assets/img/projets/renovation-epp/apres-batiment.jpg',
  './assets/img/projets/renovation-epp/ceremonie-equipe.jpg',
  './assets/img/projets/renovation-epp/ceremonie-vc.jpg',
  './assets/img/projets/renovation-epp/ceremonie-officiel.jpg',
  './assets/img/projets/renovation-epp/ceremonie-ippdr.jpg',
  './assets/img/domaines/autonomisation.jpg',
  './assets/img/domaines/eha.jpg',
  './assets/img/domaines/genre.jpg',
  './assets/img/domaines/sante.jpg',
  './assets/img/domaines/paix.jpg',
  './assets/img/domaines/inclusion.jpg'
];

// Installation : mise en cache des ressources principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[PWA] Cache initial partiel:', err))
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Laisser passer les requêtes externes (Facebook, Google Maps, polices...)
  if (url.origin !== self.location.origin) return;

  // Navigation HTML : réseau d'abord, puis cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((r) => r || caches.match('./index.html') || caches.match('./'))
      )
    );
    return;
  }

  // Ressources statiques : cache d'abord, mise à jour réseau en arrière-plan (Stale-While-Revalidate)
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
