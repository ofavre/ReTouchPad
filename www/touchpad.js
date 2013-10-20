Touchpad = {

  Touch: function(touch) {
    this.id = touch.identifier;
    this.x  = touch.screenX;
    this.y  = touch.screenY;
  },

  GestureManager: {

    restartEvents: true,

    gestures: [],

    registerGesture: function(gesture) {
      this.gestures.push(gesture);
    },

    notify: function(dispatcher) {
      if (this.restartEvents)
        for (var i = 0 ; i < this.gestures.length ; i++)
          if (this.gestures[i].currentState == null)
            this.gestures[i].start();
      for (var i = 0 ; i < this.gestures.length ; i++)
        this.gestures[i].notify(dispatcher);
      this.restartEvents = dispatcher.touches.count == 0;
    },

  },

  Gesture: function(name, setupCb) {
    this.name = name;
    this.states = {};
    this.startState = null;
    this.currentState = null;
    this.fromState = null;
    this.toState = null;
    this.firedEvent = null;

    this.notify = function(dispatcher) {
      if (this.currentState) {
        var s = this.states[this.currentState];
        var transitioned = false;
        for (var i = 0 ; i < s.links.length ; i++) {
          var e = s.links[i];
          if (e.event.notify(dispatcher)) {
            console.log(this.name+" "+this.currentState+" -> "+e.toState);
            transitioned = true;
            this.transitionTo(e.toState, e.event);
            break;
          }
        }
        if (!transitioned) {
          console.log(this.name+" "+this.currentState+" -> (stopped)");
          this.stop();
        }
      }
    };

    this.transitionTo = function(name, event) {
      event = event || Touchpad.TouchEventTypes.NULL;
      this.fromState = this.currentState;
      this.toState = (name && name in this.states) ? name : null;
      this.firedEvent = event;
      if (this.currentState)
        this.states[this.currentState].leave();
      this.currentState = this.toState;
      if (this.currentState)
        this.states[this.currentState].enter();
    };

    this.start = function() {
      if (this.currentState != null) return;
      this.transitionTo(this.startState);
    };

    this.stop = function() {
      if (this.currentState == null) return;
      this.transitionTo(null);
    };

    this.reset = function() {
      this.stop();
      this.start();
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
        this.onLeave = undefined;
        this.enter = function() {
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.onStateEnter();
          if (this.onEnter)
            this.onEnter();
        };
        this.leave = function() {
          if (this.onLeave)
            this.onLeave();
          for (var i = 0 ; i < this.links.length ; i++)
            this.links[i].event.onStateLeave();
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
