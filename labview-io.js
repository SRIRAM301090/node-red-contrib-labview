module.exports = function (RED) {
  const udp = require("dgram");
  const events = require("events");
  const eventEmitter = new events.EventEmitter();

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
          eventEmitter.emit(payload.topic, payload);
        });

        //emits after the socket is closed using socket.close();
        server.on("close", function () {
          console.log("Socket is closed !");
        });
      } catch (err) {
        node.error(err);
      }
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
        eventEmitter.removeAllListeners(this.topic);
        eventEmitter.addListener(this.topic, function (data) {
          msg.payload = RED.util.getMessageProperty(data, form);
          node.send(msg);
        });
      } catch (err) {
        console.log("ErrorMessage", err);
        node.error(err);
      }
    }

    node.on("close", function () {
      eventEmitter.removeListener(this.topic);
    });
  }
  RED.nodes.registerType("labview-input", labviewInput);

  function labviewOutput(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    this.topic = n.topic;
    this.labviewConfig = RED.nodes.getNode(n.labviewConfig);
    const host = this.labviewConfig.host;
    const port = this.labviewConfig.port;

    client = udp.createSocket("udp4");
    this.on("input", function (msg, send, done) {
      if (this.labviewConfig) {
        try {
          msg.topic = this.topic;
          const bufferData = Buffer(JSON.stringify(msg));
          
          //sending msg
          client.send(bufferData, port, host, function (error) {
            if (error) {
              client.close();
            } else {
              done();
            }
          });
        } catch (err) {
          console.log("ErrorMessage", err);
          done(err);
        }
      }
    });
  }
  RED.nodes.registerType("labview-output", labviewOutput);
};
