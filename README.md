# node-red-contrib-labview

Easily integrate Node-RED with LabVIEW.

## Introduction

The `node-red-contrib-labview` node allows seamless data exchange between Node-RED and LabVIEW. By using this node, you can leverage the Node-RED dashboard as a front panel while keeping the logic within the LabVIEW block diagram. This integration simplifies the development process and enhances the capabilities of both platforms.

## Features

- **Data Exchange**: Efficiently transfer data between Node-RED and LabVIEW.
- **Dashboard Integration**: Use Node-RED Dashboard as the front panel for user interactions.
- **Seamless Logic Execution**: Maintain your logic in the LabVIEW block diagram.

## Installation

To install the `node-red-contrib-labview` node, use the following command:

```sh
npm install node-red-contrib-labview
```

## Usage

### Setting Up

1. **Add the Node**: Drag the `node-red-contrib-labview` node from the palette to your flow.
2. **Configure the Node**: Double-click the node to open the configuration panel. Specify the necessary parameters for LabVIEW communication.
3. **Deploy the Flow**: Click the Deploy button to apply your changes.

### Example

Here is an example of how to use the `node-red-contrib-labview` node:

1. **Create a Flow**: Design a flow in Node-RED that includes the `node-red-contrib-labview` node.
2. **Connect to LabVIEW**: Configure the node to connect to your LabVIEW application.
3. **Interact with the Dashboard**: Use the Node-RED dashboard to send and receive data from LabVIEW.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License.
