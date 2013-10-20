Touchpad.TouchEventTypes = {

  NULL: {
    type: null
  },

  DOWN: function(cb, totalFingerCount) {
    this.type = "DOWN";
    this.finished = false;
    this.cb = cb ? cb : function(){return true;};
    this.totalFingerCount = totalFingerCount;
    this.wouldTrigger = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchstart" && dispatcher.touches.count == this.totalFingerCount;
    };
    this.wouldCancel = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchstart" && dispatcher.touches.count > this.totalFingerCount;
    };
    this.notify = function(dispatcher) {
      if (this.finished) return true;
      if (this.wouldTrigger(dispatcher)) {
        rtn = this.cb();
        if (rtn) this.finished = true;
        return rtn;
      } else if (this.wouldCancel(dispatcher))
        this.finished = true;
      return false;
    };
    this.onStateEnter = function() {this.finished = false;};
    this.onStateLeave = function() {};
  },

  UP: function(cb, totalFingerCount) {
    this.type = "UP";
    this.finished = false;
    this.cb = cb ? cb : function(){return true;};
    this.totalFingerCount = totalFingerCount;
    this.wouldTrigger = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchend" && dispatcher.touches.count == this.totalFingerCount;
    };
    this.wouldCancel = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchend" && dispatcher.touches.count < this.totalFingerCount;
    };
    this.notify = function(dispatcher) {
      if (this.finished) return true;
      if (this.wouldTrigger(dispatcher)) {
        rtn = this.cb();
        if (rtn) this.finished = true;
        return rtn;
      } else if (this.wouldCancel(dispatcher))
        this.finished = true;
      return false;
    };
    this.onStateEnter = function() {this.finished = false;};
    this.onStateLeave = function() {};
  },

  MOVE: function(cb, totalFingerCount) {
    this.type = "MOVE";
    this.finished = false;
    this.cb = cb ? cb : function(){return true;};
    this.totalFingerCount = totalFingerCount;
    this.wouldTrigger = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchmove" && dispatcher.touches.count == this.totalFingerCount;
    };
    this.wouldCancel = function(dispatcher) {
      return dispatcher.lastEvent.type == "touchmove" && dispatcher.touches.count != this.totalFingerCount;
    };
    this.notify = function(dispatcher) {
      if (this.finished) return true;
      if (this.wouldTrigger(dispatcher)) {
        rtn = this.cb();
        if (rtn) this.finished = true;
        return rtn;
      } else if (this.wouldCancel(dispatcher))
        this.finished = true;
      return false;
    };
    this.onStateEnter = function() {this.finished = false;};
    this.onStateLeave = function() {};
  },

  TIME: function(cb, timeout, onlyAcceptedEvents) {
    this.type = "TIME";
    this.cb = cb ? cb : function(){return true;};
    this.timeout = timeout;
    this.timer = undefined;
    this.cancel = function() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    };
    this.onlyAcceptedEvents = onlyAcceptedEvents;
    for (var i = 0 ; i < this.onlyAcceptedEvents ; i++)
      this.onlyAcceptedEvents[i].cb = (function(that){return function() {that.cancel();};})(this);
    this.notify = function(dispatcher) {
      if (!this.timer) return true;
      for (var i = 0 ; i < this.onlyAcceptedEvents ; i++) {
        if (this.onlyAcceptedEvents[i].wouldCancel(dispatcher)) {
          this.onlyAcceptedEvents.splice(i,1);
          i--;
          continue;
        } else if (!this.onlyAcceptedEvents[i].wouldTrigger(dispatcher)) {
          return true;
        }
      }
    };
    this.onStateEnter = function() {
      this.timer = setTimeout(this.cb, this.timeout);
    };
    this.onStateLeave = function() {
      this.cancel();
    };
  },

};
