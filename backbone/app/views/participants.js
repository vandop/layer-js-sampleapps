'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.user-list',
  newConversation: function() {
    this.$el.show();
    this.render();
  },
  hide: function() {
    this.$el.hide();
  },
  render: function() {
    this.$el.empty();
     window.layerSample.users.forEach(function(participant) {
      this.$el.append('<label for="' + participant + '" class="participant">' +
        '<div class="avatar"><span>' + participant.substr(0, 2).toUpperCase() + '</span></div>' +
          '<div class="info">' +
            '<div class="main">' +
              '<span class="title">' + participant + '</span>' +
              '<input id="' + participant + '" type="checkbox" name="userList"/>' +
            '</div>' +
          '</div>' +
        '</label>');
    }, this);
  },
  events: {
    'change input': 'participantSelected'
  },
  participantSelected: function() {
    var participants = [];
    this.$el.find('input:checked').each(function(i, input) {
      participants.push(input.id);
    });
    this.trigger('conversation:participants', participants);
  }
});
