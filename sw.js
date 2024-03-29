// import
importScripts('js/sw-utils.js'); 


const STATIC_CACHE      = 'static-v4';
const DYNAMIC_CACHE     = 'dynamic-v2';
const INMUTABLE_CACHE   ='inmutable-v1';

const APP_SHELL = [
 //'/',
 'index.html',
 'css/style.css',
 'img/favicon.ico',
 'img/avatars/hulk.jpg',
 'img/avatars/ironman.jpg',
 'img/avatars/spiderman.jpg',
 'img/avatars/thor.jpg',
 'img/avatars/wolverine.jpg',
 'js/app.js',
 'js/sw-utils.js'

];

const APP_SHELL_INMUTABLE =[
'https://fonts.googleapis.com/css?family=Quicksand:300,400',
'https://fonts.googleapis.com/css?family=Lato:400,300',
'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
'css/animate.css',
'js/libs/jquery.js'
];

self.addEventListener('install', event => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));
    
    const cacheinmut = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));


    event.waitUntil(Promise.all([cacheStatic,cacheinmut]));
});
self.addEventListener('activate', event => {
    const borrarCache = caches.keys().then(keys => {
        
        keys.forEach(key => {
            //stactic-v4
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });


    event.waitUntil(borrarCache);
});

self.addEventListener('fetch', event =>{

    const resp = caches.match(event.request).then( res =>{
        if (res) {
            return res;
        }else{
          return fetch(event.request).then( newres =>{

            return actualizaCacheDinamico(DYNAMIC_CACHE, event.request ,newres );

          });
        }
        console.log(res);
    });
    event.respondWith(resp);
} );