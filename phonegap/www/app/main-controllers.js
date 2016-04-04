/* global angular layer */
'use strict';

var sampleControllers = angular.module('sampleAppControllers', []);

/**
 * Notes: data in this application is driven by Queries.  Queries can be set
 * to return Conversation and Message Objects or Instances.  An Object
 * lets us have an immutable object that simplifies angular's scope comparisons.
 * An Instance provides methods that let us interact with the layer services.
 * Both are used in this application: Objects for managing angular state, Instances for interacting.
 */

var identityReady;

/**
 * Wait for identity dialog message to complete
 */
window.addEventListener('message', function(evt) {
  if (evt.data === 'layer:identity') {
    identityReady();
  }
});

/**
 * The Main Application Controller initializes the client
 * and loads the Chat Controller
 */
sampleControllers.controller('appCtrl', function ($scope) {
  $scope.appCtrlState = {
    isReady: false,
    client: null,
    pushRegistrationId: null
  };

  /**
   * Start by creating a client; it will authenticate asynchronously,
   * so the UI needs to account for the fact that it won't have any data
   * when first rendering.
   */
  identityReady = function() {

    /**
     * Initialize Layer Client with `appId`
     */
    $scope.appCtrlState.client = new layer.Client({
      appId: window.layerSample.appId
    });

    /**
     * Client authentication challenge.
     * Sign in to Layer sample identity provider service.
     */
    $scope.appCtrlState.client.on('challenge', function(evt) {
      window.layerSample.challenge(evt.nonce, evt.callback);
    });

    /**
     * Once the client is ready, get our users (static data
     * for this sample) and render.
     */
    $scope.appCtrlState.client.on('ready', function() {
      $scope.appCtrlState.isReady = true;
      $scope.appCtrlState.users = window.layerSample.users;
      $scope.appCtrlState.user = window.layerSample.user;
      $scope.$digest();
    });
  };
});

/**
 * The Main Application Controller manages:
 * 1. Whether to show the userList or the messages panel
 * 2. All routing (current conversation or new conversation)
 */
sampleControllers.controller('chatCtrl', function ($scope, $route) {
  $scope.chatCtrlState = {
    showUserList: false,
    currentConversation: null
  };

  $scope.$watch('appCtrlState.isReady', function() {
    $scope.registerForPush();
  });
  $scope.registerForPush = function() {
    $scope.appCtrlState.client.registerAndroidPushToken({
      token: $scope.appCtrlState.pushRegistrationId,
      deviceId: window.device.uuid,
      senderId: 'YOUR-SENDER-ID'
    }, function(err) {
      if (err) console.error('Error registering for Push Notifications with Layer:', err);
      else console.log('Push Notifications registered on Layer Servers');
    });
  }

  document.addEventListener('deviceready', function() {
    var push = PushNotification.init({
      android: {
        senderID: 'YOUR-SENDER-ID',
        vibrate: true
      }
    });

  	push.on('registration', function(data) {
  	    $scope.appCtrlState.pushRegistrationId = data.registrationId;
  	    if ($scope.appCtrlState.client) $scope.registerForPush();
  	});

  	push.on('notification', function(data) {
  	    // If the app was in the foreground when the notification arrived, ignore it; these notifications are expected to be handled
  	    // via layer.Client events: layer.Client.on('messages:new') or event layer.Client.on('messages:notify')
  	    if (data.additionalData.foreground) return;

  	    // If the app was in the background when the notification occurred, and was opened by a user selecting the notification, then
  	    // we will reach this point, and should open the specified Conversation
  	    var conversationId = data.additionalData.layer.conversation_identifier;
  	    $scope.loadConversation(conversationId);
  	}, false);
  });


  /**
   * Get the Conversation from cache... or from the server if not cached.
   * Once loaded, set it as our currentConversation.
   */
  $scope.loadConversation = function loadConversation(id) {
    $scope.chatCtrlState.showUserList = false;
    var conversation = $scope.appCtrlState.client.getConversation(id, true);
    conversation.once('conversations:loaded', function() {
      $scope.chatCtrlState.currentConversation = conversation.toObject();
      $scope.$digest();
      document.querySelectorAll('.message-textarea')[0].focus();
    });
  };

  /**
   * Utility for rendering all users in a Conversation.
   */
  $scope.getConversationAvatars = function(conversationObject) {
    return conversationObject.participants.map(function(participant) {
      return participant.substr(0, 2).toUpperCase();
    });
  };

  /**
   * Utility for getting the title for a Conversation
   */
  $scope.getConversationTitle = function(conversationObject) {
    if (conversationObject) {
      // Metadata.title is the preferred title
      if (conversationObject.metadata.title) return conversationObject.metadata.title;

      // A join of all participants names is the backup title.
      return conversationObject.participants.join(', ');
    }
    return '';
  };
});

/**
 * The Conversation List Controller manages the List of Conversation on
 * the left column.
 *
 * This Controller manages the Conversation Query which delivers
 * all Conversations and any changes to the Conversations.
 *
 * Rendering is done by iterating over $scope.query.data
 */
sampleControllers.controller('conversationListCtrl', function ($scope, $rootScope) {
  // Once we are authenticated and the User list is loaded, create the query
  $scope.$watch('appCtrlState.isReady', function(newValue) {
    if (newValue) {

      // Create the Conversation List query
      $scope.query = $scope.appCtrlState.client.createQuery({
        model: layer.Query.Conversation,
        dataType: 'object',
        paginationWindow: 500
      });

      /**
       * Any time the query data changes, rerender.  Data changes when:
       *
       * * The Conversation data has loaded from the server
       * * A new Conversation is created and added to the results
       * * A Conversation is deleted and removed from the results
       * * Any Conversation in the results has a change of metadata or participants
       */
      $scope.query.on('change', function() {
        $rootScope.$digest();
      });
    }
  }, this);


  /**
   * This deletes a Conversation from the server.
   */
  $scope.deleteConversation = function(conversation) {
    var conversationInstance = $scope.appCtrlState.client.getConversation(conversation.id);
    if (conversationInstance) {
      window.setTimeout(function() {
        if (confirm('Are you sure you want to delete this conversation?')) {
          conversationInstance.delete(true);
        }
      }, 1);
    }
  };
});
