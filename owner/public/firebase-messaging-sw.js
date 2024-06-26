// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGsZQB9BdrdzS1U4GSZl-aPJ9d1lvbIH8",
  authDomain: "swigggy-a5d1b.firebaseapp.com",
  projectId: "swigggy-a5d1b",
  storageBucket: "swigggy-a5d1b.appspot.com",
  messagingSenderId: "919437109542",
  appId: "1:919437109542:web:f81e5ad49c1724f163b9e7",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./logo/favicon.ico",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// self.addEventListener("notificationclick", function (event) {
//   console.log("Notification clicked!");

//   event.notification.close();

//   event.waitUntil(
//     clients
//       .matchAll({
//         type: "window",
//       })
//       .then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url === "http://localhost:3003/orderdetails") {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow("http://localhost:3003/orderdetails");
//         }
//       })
//   );
// });

// self.addEventListener('notificationclick', function(event) {
//   console.log('Notification clicked!', event);

//   event.notification.close();

//   event.waitUntil(
//     clients.matchAll({
//       type: 'window'
//     }).then(function(clientList) {
//       console.log('Client list:', clientList);
//       for (var i = 0; i < clientList.length; i++) {
//         var client = clientList[i];
//         console.log('Client:', client);
//         if (client.url.includes('localhost:3003') && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow('http://localhost:3003/orderdetails');
//       }
//     })
//   );
// });
