const CACHE_NAME = 'nfz-v1';

// Install service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'No Filter Zim';
  const options = {
    body: data.body || 'Something happened on your profile',
    icon: data.icon || '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now()
    },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is open focus it
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Handle notification action clicks
self.addEventListener('notificationclick', (event) => {
  if (event.action === 'generate') {
    event.waitUntil(clients.openWindow('/roast.html'));
  }
  if (event.action === 'view') {
    event.waitUntil(clients.openWindow('/profile.html'));
  }
});

// Background sync for checking expiry
self.addEventListener('sync', (event) => {
  if (event.tag === 'check-expiry') {
    event.waitUntil(checkExpiry());
  }
});

async function checkExpiry() {
  const expiresAt = parseInt(await getFromDB('nfz_expires_at') || '0');
  if (!expiresAt) return;

  const remaining = expiresAt - Date.now();
  const twoHours = 2 * 60 * 60 * 1000;

  if (remaining > 0 && remaining <= twoHours) {
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    self.registration.showNotification('⏱️ No Filter Zim', {
      body: `Your link closes in ${hours}h ${mins}m — share it now before it's too late!`,
      icon: '/icon.png',
      vibrate: [200, 100, 200],
      data: { url: '/profile.html' },
      actions: [
        { action: 'view', title: 'View profile' }
      ]
    });
  }
}