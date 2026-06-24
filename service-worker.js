// Murphy传讯 Service Worker - 离线缓存 v2
var CACHE='murphy-v2';

// 安装：预缓存核心文件
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./','./index.html','./manifest.json'])}));
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))
  }));
  self.clients.claim();
});

// 请求拦截：网络优先，失败时使用缓存
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(response){
      var cloned=response.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,cloned)});
      return response;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
