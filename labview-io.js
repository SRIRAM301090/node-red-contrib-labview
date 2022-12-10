module.exports = function (RED) {
  // var udp = require("dgram");
  // var socket = udp.createSocket("udp4");
  
  function lvConfig(n) {
    RED.nodes.createNode(this, n);
    this.listeningPort = n.listeningPort;
    this.host = n.host;
    this.port = n.port;

    // socket.on('message', function (msg, info){
    //     console.log(msg.toString());
    //  });
    
    // socket.on('listening', function(){
    //     var address = socket.address();
    //     console.log("listening on :" = address.address + ":" + address.port);
    // });
    
    // socket.bind(this.listeningPort);
  }
  RED.nodes.registerType("lv-config", lvConfig);

  function lvInput(n) {
    RED.nodes.createNode(this, n);

    this.lvConfig = RED.nodes.getNode(n.lvConfig);
    console.log(this.lvConfig);

    if(this.lvConfig) {
        console.log(this.lvConfig.listeningPort);
        console.log(this.lvConfig.host);
        console.log(this.lvConfig.port);
    }
  }
  RED.nodes.registerType("lv-input", lvInput);

};
