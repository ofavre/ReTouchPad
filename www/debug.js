function FakeTouch(id, x, y) {
  this.identifier = id;
  this.screenX = x;
  this.screenY = y;
}

function playFakeEvents(fakeevents, offset) {
  var i = 0;
  if (offset != undefined) {
    var i = offset;
    if (i >= fakeevents.length) return;
    var evt = fakeevents[i];
    Touchpad.EventDispatcher.receiveEvent(evt);
    i++;
  }
  if (i >= fakeevents.length) return;
  var evt = fakeevents[i];
  setTimeout((function(fakeevents, offset){ return function() {
    playFakeEvents(fakeevents, offset);
  }; })(fakeevents, i), evt.delay);
}

function newTestButton(name, events) {
  var buttons = document.getElementById('buttons');
  var button = document.createElement('button');
  button.appendChild(document.createTextNode(name));
  button.addEventListener('click', function() {
    playFakeEvents(events);
  }, false);
  buttons.appendChild(button);
}

newTestButton("MOVE", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 110, 100)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 100)]
},{
  delay: 200,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 120, 100)]
}]);

newTestButton("MOVE failed", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 100,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 110, 100)]
},{
  delay: 200,
  type: "touchstart",
  changedTouches: [new FakeTouch(2, 200,200)]
},{
  delay: 100,
  type: "touchmove",
  changedTouches: [new FakeTouch(2, 200, 210)]
},{
  delay: 200,
  type: "touchend",
  changedTouches: [new FakeTouch(2, 200, 210)]
},{
  delay: 200,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 100)]
},{
  delay: 200,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 120, 100)]
}]);

newTestButton("CLICK", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 150,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 100, 100)]
}]);

newTestButton("CLICK too long", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 500,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 100, 100)]
}]);

newTestButton("CLICK R", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 50,
  type: "touchstart",
  changedTouches: [new FakeTouch(2, 200, 200)]
},{
  delay: 150,
  type: "touchend",
  changedTouches: [new FakeTouch(2, 200, 210)]
},{
  delay: 50,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 120, 100)]
}]);

newTestButton("Scroll", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100), new FakeTouch(2, 200, 200)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 100), new FakeTouch(2, 220, 200)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 120), new FakeTouch(2, 220, 220)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 100, 100), new FakeTouch(2, 200, 200)]
},{
  delay: 50,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 100, 100), new FakeTouch(2, 200, 200)]
}]);

newTestButton("Scroll steps", [{
  delay: 500,
  type: "touchstart",
  changedTouches: [new FakeTouch(1, 100, 100)]
},{
  delay: 50,
  type: "touchstart",
  changedTouches: [new FakeTouch(2, 200, 200)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 100), new FakeTouch(2, 220, 200)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 120, 120), new FakeTouch(2, 220, 220)]
},{
  delay: 20,
  type: "touchmove",
  changedTouches: [new FakeTouch(1, 100, 100), new FakeTouch(2, 200, 200)]
},{
  delay: 150,
  type: "touchend",
  changedTouches: [new FakeTouch(2, 200, 200)]
},{
  delay: 50,
  type: "touchend",
  changedTouches: [new FakeTouch(1, 100, 100)]
}]);
