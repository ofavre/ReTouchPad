OverlayManager = {

  clear: function() {
    var elmt;
    while ((elmt = document.getElementsByClassName("overlay")[0]) != undefined)
      elmt.parentNode.removeChild(elmt);
  },

  add: function(x, y, classname, text) {
    var d = document.createElement("div");
    d.className = "overlay";
    d.style.left = x+'px';
    d.style.top = y+'px';
    var o = document.createElement("div");
    o.className = "overlay-outer";
    d.appendChild(o);
    var i = document.createElement("div");
    i.className = "overlay-inner "+classname;
    i.appendChild(document.createTextNode(text));
    o.appendChild(i);
    document.body.appendChild(d);
  },

};
