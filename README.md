ReTouchPad
==========

ReTouchPad turns your touchscreen into a remote touchpad.
It enables you to use various touch gestures to control a remote computer.



How does it work?
-----------------

The controlled computer runs `node` to create a server that listens for WebSocket connections.
The controller opens a web page that connects to the server, records touch events, and sends orders.
The server then reads the orders and uses `xdotool` in order to execute them.



Installing
----------

You will need [Node.JS][nodejs-download], and `npm` to fetch the dependencies.

1. [Install Node.JS for your OS][nodejs-install] or [download it][nodejs-download], or [build it from source][nodejs-build].

2. Check if `npm` is provided with your version of Node.JS, otherwise [install it][npm-download].

3. Install the package system-wide, or install the dependencies locally:

        npm install -g   # installs the package and its dependencies system-wide
        # OR
        npm install      # installs the dependencies locally



Usage
-----

Start the server on the computer to control:

    # With a system-wide installation: either
    retouchpad
    npm start -g retouchpad
    # With a local installation, from the project folder: either
    npm start
    node server.js

On the controlling device, open http://the-controlled-computer:8080/.

Click the “Connect” button.

Use the blank area as a regular touchpad.



License
-------

This project is licensed under the 2-clause BSD license.
See LICENSE file.

[nodejs-install]: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
[nodejs-download]: http://nodejs.org/download/
[nodejs-build]: https://github.com/joyent/node#to-build

[npm-download]: https://npmjs.org/doc/README.html
