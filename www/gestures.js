var gestureMove = new Touchpad.Gesture("move", function(){
  this.setStartState("start");
  var start = this.addState("start");
  var moving = this.addState("moving");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 1), "moving");
  start.forbidEvents([
    new Touchpad.TouchEventTypes.DOWN(undefined, 2)
  ]);
  moving.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 1), "moving");
  moving.forbidEvents([
    new Touchpad.TouchEventTypes.MOVE(undefined, 2),
    new Touchpad.TouchEventTypes.UP(undefined, 0),
    new Touchpad.TouchEventTypes.DOWN(undefined, 2)
  ]);
  moving.onEnter = function() {
    for (id in Touchpad.EventDispatcher.deltaTouches) {
      socket.send(JSON.stringify({
        type: "move",
        relx: Touchpad.EventDispatcher.deltaTouches[id].x,
        rely: Touchpad.EventDispatcher.deltaTouches[id].y,
      }));
    }
  };
});

var gestureClickL = new Touchpad.Gesture("clickL", function(){
  this.setStartState("start");
  var start = this.addState("start");
  var down = this.addState("down");
  var up = this.addState("up");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 1), "down");
  down.addLink(new Touchpad.TouchEventTypes.UP(undefined, 0), "up");
  down.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down.gesture.transitionTo(null);}, 200),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.DOWN(undefined, 2)
  ]);
  up.onEnter = function() {
    socket.send(JSON.stringify({
      type: "click",
      button: "left"
    }));
  };
});

var gestureClickR = new Touchpad.Gesture("clickR", function(){
  this.setStartState("start");
  var start = this.addState("start");
  var down1 = this.addState("down1");
  var down2 = this.addState("down2");
  var up1 = this.addState("up1");
  var up0 = this.addState("up0");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 1), "down1");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  down1.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  down1.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down1.gesture.transitionTo(null);}, 100),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down2.addLink(new Touchpad.TouchEventTypes.UP(undefined, 1), "up1");
  down2.addLink(new Touchpad.TouchEventTypes.UP(undefined, 0), "up0");
  down2.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down2.gesture.transitionTo(null);}, 200),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.DOWN(undefined, 3)
  ]);
  up1.addLink(new Touchpad.TouchEventTypes.UP(undefined, 0), "up0");
  up1.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down1.gesture.transitionTo(null);}, 100),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.DOWN(undefined, 2)
  ]);
  up0.onEnter = function() {
    socket.send(JSON.stringify({
      type: "click",
      button: "right"
    }));
  };
});

var gesture2DScroll = new Touchpad.Gesture("scroll", function(){
  this.onStart = function() {
    this.barycenter = undefined;
  };
  this.setStartState("start");
  var start = this.addState("start");
  var down1 = this.addState("down1");
  var down2 = this.addState("down2");
  var down3 = this.addState("down3");
  var down4 = this.addState("down4");
  var moving = this.addState("moving");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 1), "down1");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 3), "down3");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 4), "down4");
  down1.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  down1.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 3), "down3");
  down1.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 4), "down4");
  down1.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down1.gesture.transitionTo(null);}, 100),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down2.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 2), "moving");
  down2.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 3), "down3");
  down2.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 4), "down4");
  down2.forbidEvents([
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down3.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 3), "moving");
  down3.addLink(new Touchpad.TouchEventTypes.UP(undefined, 2), "down2");
  down3.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 4), "down4");
  down3.forbidEvents([
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down4.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 4), "moving");
  down4.addLink(new Touchpad.TouchEventTypes.UP(undefined, 3), "down3");
  down4.addLink(new Touchpad.TouchEventTypes.UP(undefined, 2), "down2");
  down4.forbidEvents([
    new Touchpad.TouchEventTypes.DOWN(undefined, 5),
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down2.onEnter = down3.onEnter = down4.onEnter = function() {
    this.gesture.accummulation = {dx: 0, dy: 0};
    this.gesture.barycenter = ",";
    for (id in Touchpad.EventDispatcher.touches)
      if (id != "count")
        this.gesture.barycenter += id + ",";
      console.log("barycenter key = "+this.gesture.barycenter);
  };
  moving.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 2), "moving");
  moving.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 3), "moving");
  moving.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 4), "moving");
  moving.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 3), "down3");
  moving.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 4), "down4");
  moving.addLink(new Touchpad.TouchEventTypes.UP(undefined, 3), "down3");
  moving.addLink(new Touchpad.TouchEventTypes.UP(undefined, 2), "down2");
  moving.forbidEvents([
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  moving.onEnter = function() {
    var type = undefined;
    var step = 0;
    switch (Touchpad.EventDispatcher.touches.count) {
      case 2: type = "scroll"; step = 20; break;
      case 3: type = "pagescroll"; step = 30; break;
      case 4: type = "desktopchange"; step = 60; break;
    }
    if (type == undefined) {
      this.gesture.transitionTo(null);
      return;
    }
    var b = Touchpad.EventDispatcher.barycenters._list[this.gesture.barycenter];
    this.gesture.accummulation.dx += b.dx;
    this.gesture.accummulation.dy += b.dy;
    function intTo0(v) { return v >= 0 ? Math.floor(v) : Math.ceil(v); }
    var dx = intTo0(this.gesture.accummulation.dx / step);
    var dy = intTo0(this.gesture.accummulation.dy / step);
    if (dx != 0) {
      this.gesture.accummulation.dx -= dx * step;
      socket.send(JSON.stringify({
        type: type,
        axis: "x",
        amount: dx
      }));
    }
    if (dy != 0) {
      this.gesture.accummulation.dy -= dy * step;
      socket.send(JSON.stringify({
        type: type,
        axis: "y",
        amount: dy
      }));
    }
    if (type == "desktopchange" && (dx != 0 || dy != 0))
      this.gesture.transitionTo(null);
  };
});

var gestureZoom = new Touchpad.Gesture("zoom", function(){
  this.onStart = function() {
    this.barycenter = undefined;
  };
  this.setStartState("start");
  var start = this.addState("start");
  var down1 = this.addState("down1");
  var down2 = this.addState("down2");
  var moving = this.addState("moving");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 1), "down1");
  start.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  down1.addLink(new Touchpad.TouchEventTypes.DOWN(undefined, 2), "down2");
  down1.forbidEvents([
    new Touchpad.TouchEventTypes.TIME(function(){down1.gesture.transitionTo(null);}, 100),
    new Touchpad.TouchEventTypes.DOWN(undefined, 3),
    new Touchpad.TouchEventTypes.MOVE(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down2.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 2), "moving");
  down2.forbidEvents([
    new Touchpad.TouchEventTypes.DOWN(undefined, 3),
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  down2.onEnter = function() {
    this.gesture.accummulation = {dstdXY: 0};
    this.gesture.barycenter = ",";
    for (id in Touchpad.EventDispatcher.touches)
      if (id != "count")
        this.gesture.barycenter += id + ",";
      console.log("barycenter key = "+this.gesture.barycenter);
  };
  moving.addLink(new Touchpad.TouchEventTypes.MOVE(undefined, 2), "moving");
  moving.forbidEvents([
    new Touchpad.TouchEventTypes.DOWN(undefined, 3),
    new Touchpad.TouchEventTypes.UP(undefined, 1),
    new Touchpad.TouchEventTypes.UP(undefined, 0)
  ]);
  moving.onEnter = function() {
    var b = Touchpad.EventDispatcher.barycenters._list[this.gesture.barycenter];
    this.gesture.accummulation.dstdXY += b.dstdXY;
    function intTo0(v) { return v >= 0 ? Math.floor(v) : Math.ceil(v); }
    var dstdXY = intTo0(this.gesture.accummulation.dstdXY / 30);
    if (dstdXY != 0) {
      this.gesture.accummulation.dstdXY -= dstdXY * 30;
      socket.send(JSON.stringify({
        type: "zoom",
        amount: dstdXY
      }));
    }
  };
});
