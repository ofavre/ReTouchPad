var sys = require("sys");
var ws = require("./node_modules/websocket-server");
var exec = require("child_process").exec;

function error(data){
  sys.log("\033[0;31m"+data+"\033[0m");
}
function log(data){
  sys.log("\033[0;32m"+data+"\033[0m");
}
function notice(data){
  sys.log("\033[0;33m"+data+"\033[0m");
}

var server = ws.createServer();//{debug:true});
server.listen(3400);

server.addListener("connection", function(connection){
  notice("connection");
  connection.addListener("message", function(msgstr){
    var buttonToNum = { 'left': 1, 'middle': 2, 'right': 3 };
    var scrollAxisToNum = { 'y': [4,5], 'x': [6,7] };
    var zoomToNum = [4,5];
    msg = JSON.parse(msgstr);
    if (msg.type == "log") {
      error(msgstr);
      return;
    } else {
      log(msgstr);
    }
    if (msg.type == "move") {
      exec('xdotool mousemove_relative -- '+msg.relx+' '+msg.rely, exec_cb);
    } else if (msg.type == "down") {
      exec('xdotool mousedown '+buttonToNum[msg.button], exec_cb);
    } else if (msg.type == "up") {
      exec('xdotool mouseup '+buttonToNum[msg.button], exec_cb);
    } else if (msg.type == "click") {
      exec('xdotool click '+buttonToNum[msg.button], exec_cb);
    } else if (msg.type == "pagescroll") {
      var child = exec('xdotool -', exec_cb);
      if (msg.axis == "x")
        child.stdin.write('keydown Ctrl\n');
      var key = msg.amount<0 ? "Page_Up" : "Page_Down";
      for (var i = 0 ; i < Math.abs(msg.amount) ; i++)
        child.stdin.write('key '+key+'\n');
      if (msg.axis == "x")
        child.stdin.write('keyup Ctrl\n');
    } else if (msg.type == "desktopchange") {
      var child = exec('xdotool -', exec_cb);
      //child.stdin.write('keydown Ctrl+Alt\n');
      var key = (msg.axis=="x"?["Left","Right"]:["Up","Down"])[msg.amount<0?0:1];
      log("KEY = "+key);
      for (var i = 0 ; i < Math.abs(msg.amount) ; i++)
        child.stdin.write('key Ctrl+Alt+'+key+'\n');
      //child.stdin.write('keyup Ctrl+Alt\n');
    } else if (msg.type == "scroll") {
      for (var i = 0 ; i < Math.abs(msg.amount) ; i++)
        exec('xdotool click '+scrollAxisToNum[msg.axis][msg.amount<0?0:1], exec_cb);
    } else if (msg.type == "zoom") {
      var child = exec('xdotool -', exec_cb);
      child.stdin.write('keydown Ctrl\n');
      var btn = zoomToNum[msg.amount<0?0:1];
      for (var i = 0 ; i < Math.abs(msg.amount) ; i++)
        child.stdin.write('click '+btn+'\n');
      child.stdin.write('keyup Ctrl\n');
    }
  });
  connection.addListener("close", function(){
    notice("close");
  });
});

function exec_cb(error, stdout, stderr) {
  //log("\nerror="+error+"\nstdout="+stdout+"\nstderr="+stderr);
}

  /*
server.addListener("request", function(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("okay");
  res.end();
});

server.addListener("client", function(conn){
  log(conn._id + ": new connection");
  conn.addListener("readyStateChange", function(readyState){
    log("stateChanged: "+readyState);
  });

  conn.addListener("open", function(){
    log(conn._id + ": onOpen");
    server.clients.forEach(function(client){
      client.write("New Connection: "+conn._id);
    });
  });

  conn.addListener("close", function(){
    var c = this;
    log(c._id + ": onClose");
    server.clients.forEach(function(client){
      client.write("Connection Closed: "+c._id);
    });
  });

  conn.addListener("message", function(message){
    log(conn._id + ": "+JSON.stringify(message));

    server.clients.forEach(function(client){
      client.write(conn._id + ": "+message);
    });
  });
});*/
