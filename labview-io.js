module.exports = function(RED) {
    function LabVIEWConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.listeningPort = n.listeningPort;
        this.host = n.host;
        this.port = n.port;
    }
    RED.nodes.registerType("lv-config",LabVIEWConfigNode);
}

