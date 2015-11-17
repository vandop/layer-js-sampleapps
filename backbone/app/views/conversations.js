'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.conversation-list',
  newConversation: function() {
    this.$el.find('.participant').removeClass('selected-conversation');
  },
  render: function() {
    if (!this.conversations) return;
    console.log('render: ' + this.conversations.length + ' Conversations');

    this.$el.empty();
    this.conversations.forEach(function(conversation) {
      var uuid = conversation.id.substr(conversation.id.lastIndexOf('/') + 1); // extract just UUID
      var title = conversation.metadata.title || conversation.participants;
      var unread = conversation.unreadCount !== 0 ? 'unread-messages ' : '';

      var selectedClass = '';
      if (this.conversation && conversation.id === this.conversation.id) selectedClass = 'selected-conversation';

      var avatars = _.reduce(conversation.participants, function(res, user) {
        if (user === window.layerSample.user) return res;
        res.push('<span>' + user.substr(0, 2).toUpperCase() + '</span>');
        return res;
      }, []);
      var cluster = avatars.length > 1 ? 'cluster' : '';

      this.$el.append('<a class="participant ' + unread + selectedClass + '" href="#conversations/' + uuid + '">' +
                        '<div class="avatar ' + cluster + '">' + avatars.join('') + '</div>' +
                        '<div class="info">' +
                          '<div class="main">' +
                            '<span class="title">' + title + '</span>' +
                            '<span class="delete fa fa-times-circle" title="Delete conversation" data-id="' + conversation.id + '"></span>' +
                          '</div>' +
                        '</div>' +
                      '</a>');
    }, this);
  },
  events: {
    'click .delete': 'deleteConversation'
  },
  deleteConversation: function(e) {
    e.preventDefault();
    this.trigger('conversation:delete', Backbone.$(e.target).data('id'));
  }
});
