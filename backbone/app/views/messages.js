'use strict';

var Backbone = require('backbone');

var MessageView = require('./message');

module.exports = Backbone.View.extend({
  el: '.message-list',
  initialize: function() {
    this.scrollSnap = true;
  },
  newConversation: function() {
    this.$el.hide();
  },
  render: function() {
    if (!this.messages) return;

    var messages = this.messages.concat().reverse();
    console.log('render: ' + messages.length + ' Messages');

    this.$el.show();
    this.$el.empty();
    messages.forEach(this.addMessage, this);

    this.scrollBottom();
  },
  addMessage: function(message) {
    var messageView = new MessageView({model: message});
    this.$el.append(messageView.$el);
    messageView.render();

    if (message.isRead === false) message.isRead = true;
    this.scrollBottom();
  },
  events: {
    'scroll': 'scrollView'
  },
  scrollView: function(e) {
    this.scrollSnap = e.target.scrollTop < (e.target.scrollTopMax - 40);
    if (e.target.scrollTop === 0) this.trigger('messages:paginate');
  },
  scrollBottom: function() {
    if (!this.scrollSnap) this.el.scrollTop = this.el.scrollHeight;
  }
});
