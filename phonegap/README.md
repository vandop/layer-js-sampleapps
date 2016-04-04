# The Phonegap/Cordova Sample

This sample app takes the existing AngularJS Sample App and updates it to work with Cordova.

Demo is done using Android.  Additional code is needed for IOS support.

Demo is done using phonegap rather than cordova; it should be possible to replace every place where there is a `phonegap` command with a
`cordova` command.

## How to Build a Phonegap/Cordova App

The following steps explain the process used to do this; you should be able to follow comparable steps to turn your own app into a Cordova App.  To straight up run this project, see the Run The Sample section below.

1. Run: sudo npm install phonegap -g
2. Run: phonegap create my-app
3. Run: cd my-app
4. Run: phonegap plugin add phonegap-plugin-push --variable  SENDER_ID="YOUR_SENDER_ID"
    * Get your SENDER_ID from https://console.developers.google.com/
    * Make sure that you have enabled push notifications on https://console.developers.google.com/
    * Make sure to log into the Layer Developer Dashboard, Select your App, and select `Push`, and enter your Android push settings.
5. Run: phonegap plugin add cordova-plugin-device
    * For phonegap, this will already be installed; for Cordova you will need this.
6. Your www folder is where all of your web resources go.  Cache the index.html file that was generated for you in your www folder.
6. Copy your HTML, CSS and Javascript resources into the www folder of your app;
7. Copy over entries from the generated index.html into your own index.html (meta tags, and <script src='cordova.js'></script>)
8. Configure your Content-Security-Policy in your index.html file; to get started without errors, something like this should work, but should be refined as your project gets off the ground:  `  <meta http-equiv="Content-Security-Policy" content="default-src * data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src * 'unsafe-inline'; media-src *">`
9. Test your app by plugging your android device into your computer and executing `phonegap run android`
10. Setup Notifications
    * After the `deviceready` event, register for GCM Push notifications.
    ```
      document.addEventListener('deviceready', function() {
        var push = PushNotification.init({
          android: {
            senderID: 'YOUR-SENDER-ID',
            vibrate: true
          }
        });

        push.on('registration', function(data) {
            if (client && client.isReady) registerForPush(data.registrationId);
        });

        push.on('notification', function(data) {
            if (data.additionalData.foreground) return;
            var conversationId = data.additionalData.layer.conversation_identifier;
            loadConversation(conversationId);
        }, false);
      });
    ```
    * Register for Push Notifications on Layer's Servers:
    ```
        function registerForPush(registrationId) {
            client.registerAndroidPushToken({
              token: registrationId,
              deviceId: window.device.uuid,
              senderId: 'YOUR-SENDER-ID'
            }, function(err) {
              if (err) console.error('Error registering for Push Notifications with Layer:', err);
              else console.log('Push Notifications registered on Layer Servers');
            });
        }
    ```
    * Make sure you have some sort of `loadConversation(conversationId)` method to call from your `push.on('notification', function(data) {})` handler:
    ```
        function loadConversation(id) {
            // Load the conversation from cache or from server
            var conversation = client.getConversation(id, true);
            conversation.once('conversations:loaded', function() {
              myRenderConversation(conversation);
            });
        }
    ```
11. The Layer Team followed the above instructions, copying in our AngularJS Sample app. We then made the following additional changes:
    * Removed all use of Locations and routers.  While location works in a WebView container, it does not feel like the right approach for triggering logic and Views, where locations can be shared, reloaded, etc.
    * Added `<preference name="orientation" value="landscape" />` because frankly, the AngularJS Sample App isn't very mobile friendly, and this orientation works better.

## How to Run the Sample

1. Run: sudo npm install phonegap -g
2. Open up phonegap/www/app/main-controller.js and replace MY-SENDER-ID with your project number/SENDER_ID from https://console.cloud.google.com/home/dashboard
3. Run: phonegap plugin add phonegap-plugin-push --variable  SENDER_ID="YOUR_SENDER_ID"
    * Get your SENDER_ID from https://console.cloud.google.com/home/dashboard
    * Make sure that you have enabled push notifications on https://console.cloud.google.com/home/dashboard
    * Make sure to log into the Layer Developer Dashboard, Select your App, and select `Push`, and enter your Android push settings.
4. Run: phonegap run android
