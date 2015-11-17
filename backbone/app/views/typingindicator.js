'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.typing-indicator-panel',
  render: function() {
    var text = '';
    if (this.typing.length > 0) {
      var prefix = this.typing.length === 1 ? ' is' : ' are';
      text = this.typing.join(', ') + prefix + ' typing...';
    }
    this.$el.text(text);
  }
});
