module.exports = function (RED) {
  const udp = require("dgram");
  const events = require("events");
  const eventEmitter = new events.EventEmitter();

  function labviewConfig(n) {
    RED.nodes.createNode(this, n);
    this.listeningPort = n.listeningPort;
    this.host = n.host;
    this.port = n.port;

    // creating a udp server
    const server = udp.createSocket("udp4");
    server.bind(this.listeningPort);

    // emits on new datagram msg
    server.on("message", function (msg, info) {
      const payload = JSON.parse(msg.toString());
      console.log(payload);
      eventEmitter.emit(payload.topic, payload);
    });

    //emits after the socket is closed using socket.close();
    server.on("close", function () {
      console.log("Socket is closed !");
    });
  }
  RED.nodes.registerType("labview-config", labviewConfig);

  function labviewInput(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.topic = n.topic;
    this.labviewConfig = RED.nodes.getNode(n.labviewConfig);
    var msg = {};

    if (this.labviewConfig) {
      eventEmitter.removeAllListeners(this.topic);
      eventEmitter.addListener(this.topic, function(data) {
        msg.payload = data.message;
        node.send(msg);
    })
    }

    node.on("close", function () {
      eventEmitter.removeListener(this.topic)
    });
  }
  RED.nodes.registerType("labview-input", labviewInput);
};
