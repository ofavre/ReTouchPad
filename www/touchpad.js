Touchpad = {

  Touch: function(touch) {
    this.id = touch.identifier;
    this.x  = touch.screenX;
    this.y  = touch.screenY;
  },

  GestureManager: {

    gestures: [],

    registerGesture: function(gesture) {
      this.gestures.push(gesture);
      gesture.reset();
    },

    notify: function(dispatcher) {
      for (var i = 0 ; i < this.gestures.length ; i++)
        this.gestures[i].notify(dispatcher);
      if (dispatcher.touches.count == 0)
        for (var i = 0 ; i < this.gestures.length ; i++)
          this.gestures[i].reset();
    },

  },

  Gesture: function(name, setupCb) {
    this.name = name;
    this.states = {};
    this.startState = null;
    this.currentState = null;

    this.notify = function(dispatcher) {
      if (this.currentState) {
        var s = this.states[this.currentState];
        for (var i = 0 ; i < s.links.length ; i++) {
          var e = s.links[i];
          if (e.event.notify(dispatcher)) {
              console.log(this.name+" "+this.currentState+" -> "+e.toState);
            this.transitionTo(e.toState);
            break;
          }
        }
      }
    };

    this.transitionTo = function(name) {
      this.fromState = this.currentState;
      this.toState = (name && name in this.states) ? name : null;
      if (this.currentState)
        this.states[this.currentState].leave();
      this.currentState = this.toState;
      if (this.currentState)
        this.states[this.currentState].enter();
    };

    this.reset = function() {
      this.transitionTo(null);
      for (var state in this.states) this.states[state].reset();
      this.transitionTo(this.startState);
    };

    var setup = new (function(gesture) {

      function State(gesture,name) {
        this.gesture = gesture;
        this.name = name;
        this.links = [];
        this.forbidEvents = function(touchEvents) {
          for (var i = 0 ; i < touchEvents.length ; i++)
            this.links.push({event: touchEvents[i], toState: null});
        };
        this.addLink = function(touchEvent, toStateName) {
          this.links.push({event: touchEvent, toState: toStateName});
        };
        this.onEnter = undefined;
        this.onStay = undefined;
        this.onLeave = undefined;
        this.onReset = undefined;
        this.enter = function() {
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.onStateEnter();
          if (this.onEnter)
            this.onEnter();
        };
        this.stay = function() {
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.onStateStay();
          if (this.onStay)
            this.onStay();
        };
        this.leave = function() {
          if (this.onLeave)
            this.onLeave();
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.onStateLeave();
        };
        this.reset = function() {
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.reset();
          if (this.onReset) return this.onReset();
        };
      };

      this.gesture = gesture;
      this.setStartState = function(name) {
        this.gesture.startState = name;
      };
      this.addState = function(name) {
        if (this.gesture.states[name] != undefined)
          throw "State already defined!";
        return this.gesture.states[name] = new State(this.gesture,name);
      };

      this.setup = function(setupCb) {
        setupCb.call(this);
        Touchpad.GestureManager.registerGesture(this.gesture);
      };

    })(this);
    setup.setup(setupCb);

  },

};
