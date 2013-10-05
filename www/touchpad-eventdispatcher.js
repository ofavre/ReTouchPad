Touchpad.EventDispatcher = {

  lastEvent: null,
  lastEventTime: 0,

  touches: {
    count: 0,
  },
  deltaTouches: {},
  
  barycenters: {
    _list: {}, // ",id1,id2," for keys
    list: function() {
      var rtn = [];
      for (var kyz in this._list) {
        var e = this._list[kyz];
        var keys = kyz.split(',');
        keys.shift();
        keys.pop();
        if (keys.length < 2) continue;
        keys = keys.map(function(v){return parseInt(v);}); // function wrapping necessary otherwise NaN is returned except for first value...
        if (e.ids == undefined) e.ids = keys;
        rtn.push(e);
      }
      return rtn;
    },
    _key: function() {
      var a = [];
      for (var i = 0 ; i < arguments.length ; i++)
        a.push(arguments[i]);
      return ","+a.sort().join(",")+",";
    },
    deleteWithId: function(id) {
      id = this._key(id);
      for (var key in this._list)
        if (key.indexOf(id) >= 0) {
          delete this._list[key];
        }
    },
    deleteWithTouch: function(touch) {
      return this.deleteWithId(touch.id != undefined ? touch.id : touch.identifier);
    },
    updateWithDeltaTouches: function(deltaTouches) {
      for (var id in deltaTouches) {
        var deltaTouch = deltaTouches[id];
        id = this._key(id);
        for (var keys in this._list) {
          if (keys.indexOf(id) == -1) continue;
          var length = keys.replace(/[^,]*/g,'').length - 1;
          var o = this._list[keys];
          o.dx += deltaTouch.x / length;
          o.dy += deltaTouch.y / length;
          o.x += deltaTouch.x / length;
          o.y += deltaTouch.y / length;
          o.dx2 += deltaTouch.x2 / length;
          o.dy2 += deltaTouch.y2 / length;
          o.x2 += deltaTouch.x2 / length;
          o.y2 += deltaTouch.y2 / length;
          var dvarX = o.varX;
          var dvarY = o.varY;
          var dvarXY = o.varXY;
          o.varX = o.x2 - Math.pow(o.x,2);
          o.varY = o.y2 - Math.pow(o.y,2);
          o.varXY = o.varX + o.varY;
          o.dvarX = dvarX - o.varX;
          o.dvarY = dvarY - o.varY;
          o.dvarXY = dvarXY - o.varXY;
          var dstdX = o.stdX;
          var dstdY = o.stdY;
          var dstdXY = o.stdXY;
          o.stdX = Math.sqrt(o.varX);
          o.stdY = Math.sqrt(o.varY);
          o.stdXY = Math.sqrt(o.varXY);
          o.dstdX = dstdX - o.stdX;
          o.dstdY = dstdY - o.stdY;
          o.dstdXY = dstdXY - o.stdXY;
        }
      }
    },
    newTouch: function(touch) {
      var oldKeys = [];
      for (var keys in this._list)
        oldKeys.push(keys);
      for (var i = 0 ; i < oldKeys.length ; i++) {
        var oldkeys = oldKeys[i];
        var length = oldkeys.replace(/[^,]*/g,'').length - 1;
        if (length >= 5) continue; // don't get past p=5 for this O(n^p) algorithm
        var keys = oldkeys+touch.id+","; // no ",," should be present, thus not using this._key()
        var o = {
          x: (this._list[oldkeys].x * length + touch.x) / (length+1),
          y: (this._list[oldkeys].y * length + touch.y) / (length+1),
          x2: (this._list[oldkeys].x2 * length + Math.pow(touch.x,2)) / (length+1),
          y2: (this._list[oldkeys].y2 * length + Math.pow(touch.y,2)) / (length+1),
          dx: 0, dy: 0, dx2: 0, dy2: 0,
          dvarX: 0, dvarY: 0, dvarXY: 0,
          dstdX: 0, dstdY: 0, dstdXY: 0
        };
        o.varX = o.x2 - Math.pow(o.x,2);
        o.varY = o.y2 - Math.pow(o.y,2);
        o.varXY = o.varX + o.varY;
        o.stdX = Math.sqrt(o.varX);
        o.stdY = Math.sqrt(o.varY);
        o.stdXY = Math.sqrt(o.varXY);
        this._list[keys] = o;
      }
      this._list[this._key(touch.id)] = {
        x: touch.x,
        y: touch.y,
        x2: Math.pow(touch.x,2),
        y2: Math.pow(touch.y,2),
        varX: 0, varY: 0,
        stdX: 0, stdY: 0,
        dx: 0, dy: 0, dx2: 0, dy2: 0,
        dvarX: 0, dvarY: 0, dvarXY: 0,
        dstdX: 0, dstdY: 0, dstdXY: 0
      };
    },
  },

  receiveEvent: function(evt) {
    this.lastEvent = evt;
    this.lastEventTime = new Date().getTime();
    this.deltaTouches = {};
    if (evt.type == "touchstart") {
      for (var i = 0 ; i < evt.changedTouches.length ; i++) {
        var t = new Touchpad.Touch(evt.changedTouches[i]);
        this.touches[evt.changedTouches[i].identifier] = t;
        this.barycenters.newTouch(t);
      }
      this.touches.count += evt.changedTouches.length;
    } else if (evt.type == "touchmove") {
      for (var i = 0 ; i < evt.changedTouches.length ; i++) {
        var t = evt.changedTouches[i];
        var dt = new Touchpad.Touch(t);
        dt.x2 = Math.pow(dt.x,2);
        dt.y2 = Math.pow(dt.y,2);
        dt.x2 -= Math.pow(this.touches[t.identifier].x,2);
        dt.y2 -= Math.pow(this.touches[t.identifier].y,2);
        dt.x -= this.touches[t.identifier].x;
        dt.y -= this.touches[t.identifier].y;
        this.deltaTouches[t.identifier] = dt;
        this.touches[t.identifier] = new Touchpad.Touch(t);
      }
      this.barycenters.updateWithDeltaTouches(this.deltaTouches);
    } else if (evt.type == "touchend") {
      for (var i = 0 ; i < evt.changedTouches.length ; i++) {
        var id = evt.changedTouches[i].identifier;
        delete this.touches[id];
        this.barycenters.deleteWithId(id);
      }
      this.touches.count -= evt.changedTouches.length;
    }
    socket.send(JSON.stringify({type:"log",value:{
      type: evt.type,
      changedTouches: (function(ct){
        rtn = [];
        for (var i = 0 ; i < ct.length ; i++)
          rtn.push((function(t){
            return {identifier: t.identifier, screenX: t.screenX, screenY: t.screenY};
          })(ct[i]));
        return rtn;
      })(evt.changedTouches),
      fingerCount: this.touches.count
    }}));
    if (window.OverlayManager) {
      OverlayManager.clear();
      for (var id in this.touches)
        if (id != "count")
          OverlayManager.add(this.touches[id].x, this.touches[id].y, "overlay-finger", "");
      var list = this.barycenters.list();
      for (var i = 0 ; i < list.length ; i++)
        OverlayManager.add(list[i].x, list[i].y, "overlay-barycenter", list[i].ids.length+":"+Math.round(list[i].stdXY));
    }
    Touchpad.GestureManager.notify(this);
    // Reset delta properties of barycenters
    var propsToZeroOut = ["dx", "dy", "dx2", "dy2", "dvarX", "dvarY", "dvarXY", "dstdX", "dstdY", "dstdXY"];
    for (var id in this.barycenters._list)
      if (id != "count")
        for (var i = 0 ; i != propsToZeroOut.length ; i++)
          this.barycenters._list[id][propsToZeroOut[i]] = 0;
  },

};
