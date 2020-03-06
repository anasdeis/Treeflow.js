
# Treeflow.js

<p align="center">
  <img src="./doc/treeflow.png">
</p>


![](/doc/graph.gif)

## Introduction

TreeFlow is a generic visualization library that utilizes React.js, Mobx.js, Node.js and Socket.io to generate dynamic and synchronized front end view of JData. The main advantage of using this technology stack is that it utilizes the concept of one-way data flow (so-called one-way binding) and component hierarchy of React framework so that the view is synchronized with any JData flow and the user can dynamically change the view structure by reorganizing the components with standard APIs.

TreeFlow is a JSON-to-code compiler that takes a JSON configuration file and uses it to compile a data vizualisation application. Example of available configurations can be found in the wiki.


## Getting Started

To generate your first data vizualisation application, you can use one of our samples. There are 9 samples included in this repository. 
Start by cloning the repository then run the following commands:

```
// Install dependencies of the compiler
npm install 

// Run one of the samples below
npm run sample-1
npm run sample-2
npm run sample-3
npm run sample-4
npm run sample-5
npm run sample-6
npm run sample-7
npm run sample-8
npm run sample-9

// the above command will have generated an app folder
cd app

// install dependencies of the generated app
npm install

// Start the node server
node index.js 

// For sample 3, 4, 5, 6, you can use the included Data-Mocker to generate data for the graphs
// In a different shell while the server is running, run
node app/Data-Mocker.js
```

Your generated application should now be hosted on localhost:3000! 
 

