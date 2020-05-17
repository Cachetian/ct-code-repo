// poc.js

// pri server end
// establish ssh connection
const { exec } = require("child_process");
var ssh = exec("ssh cachetian.com", {}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  // on establish
  // send node ID (client ID)

  // listen on stdout&stderr messages
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  // forward message to internal handler
});
console.log(`ssh pid: ${ssh.pid}`);

// pub server end
// listen ssh connections 
// get ssh conn pid list ps -ef | grep ssh
// hook for comming messages
function pubserver_onReceiveSshMessage(stdout, stderr) {
  // get each client Id via reg message

  // add client to clients map for push message
}

// listen for internet HTTP request forward to internal handlers
function pubserver_onHTTPRequest(HTTPReqest, HTTPResponse) {

  // get a live handler from client map (accrod to load balance policy)
  // forword message to client
  var client = {};
  var resp = client.sendSshTextMessage(HTTPReqest.serialize);
  HTTPResponse.setResp(resp);
}
