var socket = {
  send: function(msg) {console.log(msg)},
  close: function() {}
};

function pleaseDo() {
  socket = new WebSocket("ws://"+location.hostname+":3400");
  socket.onopen = function(evt){
    alert("Socket has been opened!\n"+evt);
    registerEvents();
  }
  var messages = document.getElementById("messages");
  socket.onmessage = function(msg) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(msg.data));
    messages.insertBefore(li, messages.firstChild);
  }
  socket.onerror = function(evt) {
    alert('error'+evt);
  }
  socket.onclose = function(evt) {
    alert('close '+evt);
    registerEvents(false);
  }

}
function pleaseClose() {
  if (socket == undefined) return;
  registerEvents(false);
  socket.close();
  socket = undefined;
}

function registerEvents(unregister) {
  var cb = document.addEventListener;
  if (unregister == false) cb = document.removeEventListener;
  var events = [ "touchstart", "touchmove", "touchend" ];
  for (var i = 0 ; i < events.length ; i++)
    cb.call(document, events[i], movereport, false);
}

function movereport(evt) {
  if (evt.target instanceof HTMLButtonElement) return;
  if (evt.type != "touchstart")
    evt.preventDefault();
  if (!evt.touches) return;
  var s = evt.type+' '+evt.touches.length;
  for (var i = 0 ; i < evt.touches.length ; i++) {
    s += ' ' + evt.touches[i].identifier + '>' + evt.touches[i].screenX + '-' + evt.touches[i].screenY;
  }
  document.title = s;
  Touchpad.EventDispatcher.receiveEvent(evt);
}
