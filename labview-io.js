module.exports = function (RED) {
  const udp = require("dgram");
  const events = require("events");
  const serverEmitter = new events.EventEmitter();
  const clientEmittter = new events.EventEmitter();

  function labviewConfig(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    this.listeningPort = n.listeningPort;
    this.host = n.host;
    this.port = n.port;

    // creating a udp server
    const server = udp.createSocket("udp4");
    if (this.listeningPort) {
      try {
        server.bind(this.listeningPort);

        // emits on new datagram msg
        server.on("message", function (msg, info) {
          const payload = JSON.parse(msg.toString());
          console.log(payload);
          serverEmitter.emit(payload.topic, payload);
        });

        //emits after the socket is closed using socket.close();
        server.on("close", function () {
          console.log("Socket is closed !");
        });
      } catch (err) {
        node.error(err);
      }
    }

    // creating a udp client
    const client = udp.createSocket("udp4");
    if (n.host && n.port) {
      console.log(n.host, n.port);
      clientEmittter.removeAllListeners("toClient");
      clientEmittter.addListener("toClient", function (data) {
        try {
          //sending msg
          client.send(data, n.port, n.host, function (error) {
            if (error) {
              client.close();
            }
          });
        } catch (err) {
          console.log("ErrorMessage", err);
          node.error(err);
        }
      });
    }
  }
  RED.nodes.registerType("labview-config", labviewConfig);

  function labviewInput(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    this.topic = n.topic;
    this.format = n.format;
    this.labviewConfig = RED.nodes.getNode(n.labviewConfig);
    let msg = {};

    let form =
      this.format.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") ||
      "_zzz_zzz_zzz_";
    form = form.split("|")[0];

    if (this.labviewConfig) {
      try {
        serverEmitter.removeAllListeners(this.topic);
        serverEmitter.addListener(this.topic, function (data) {
          msg.payload = RED.util.getMessageProperty(data, form);
          node.send(msg);
        });
      } catch (err) {
        console.log("ErrorMessage", err);
        node.error(err);
      }
    }

    node.on("close", function () {
      serverEmitter.removeListener(this.topic);
    });
  }
  RED.nodes.registerType("labview-input", labviewInput);

  function labviewOutput(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    this.topic = n.topic;
    this.labviewConfig = RED.nodes.getNode(n.labviewConfig);

    this.on("input", function (msg, send, done) {
      if (this.labviewConfig) {
        msg.topic = this.topic;
        console.log("toClient", msg);
        const bufferData = Buffer(JSON.stringify(msg));
        clientEmittter.emit("toClient", bufferData);
      }
    });
  }
  RED.nodes.registerType("labview-output", labviewOutput);
};
