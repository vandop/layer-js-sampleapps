'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.message-composer',
  initialize: function() {
    this.$el.hide();
  },
  render() {
    this.$el.show();
    this.$el.find('input').focus();
  },
  newConversation: function() {
    this.$el.show();
    this.conversation = null;
  },
  events: {
    'keypress input': 'inputAction'
  },
  inputAction: function(e) {
    this.trigger('typing:started');

    var text = e.target.value.trim();
    if (e.keyCode !== 13 || !text) return true;
    console.log('send: ' + text);

    if (this.conversation) this.conversation.createMessage(text).send();
    else this.trigger('conversation:create', text);

    e.target.value = '';
    this.trigger('typing:finished');
  }
});
