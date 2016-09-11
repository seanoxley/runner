'use strict';

console.log( "YO*********************************************" )

// Create `myApp` namespace.
window.myApp = {
  // Function to use for the `focus` event.
  onFocus: function () {
    // Append message to the `body` element.
    document.body.appendChild(
      document.createTextNode('The window has focus.'));
    // Add a line break.
    document.body.appendChild(document.createElement('br'));
  },
  // Function to use for the `blur` event.
  onBlur: function () {
    // Append message to the `body` element.
    document.body.appendChild(
      document.createTextNode('The window has lost focus.'));
    // Add a line break.
    document.body.appendChild(document.createElement('br'));
  }
};

/* Detect if the browser supports `addEventListener`
  Complies with DOM Event specification. */
if(window.addEventListener) {
  // Handle window's `load` event.
  window.addEventListener('load', function () {
    // Wire up the `focus` and `blur` event handlers.
    window.addEventListener('focus', window.myApp.onFocus);
    window.addEventListener('blur', window.myApp.onBlur);
  });
}
/* Detect if the browser supports `attachEvent`
  Only Internet Explorer browsers support that. */
else if(window.attachEvent) {
  // Handle window's `load` event.
  window.attachEvent('onload', function () {
    // Wire up the `focus` and `blur` event handlers.
    window.attachEvent('onfocus', window.myApp.onFocus);
    window.attachEvent('onblur', window.myApp.onBlur);
  });
}
/* If neither event handler function exists, then overwrite 
the built-in event handers. With this technique any previous event
handlers are lost. */
else {
  // Handle window's `load` event.
  window.onload = function () {
    // Wire up the `focus` and `blur` event handlers.
    window.onfocus = window.myApp.onFocus;
    window.onblur = window.myApp.onBlur;
  };
}