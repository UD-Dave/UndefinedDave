const Path = process.cwd();
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const Hapi = require('hapi');
const port = 3000;
const request = require('request');

let unitTest = ["All Unit Test"];
let PPTest = [];
let RTTest = [];

function getTestList() {
  const headers = {
    'accept': 'application/json',
    'Authorization': 'Bearer PAK-+VSC/eeChgVYbb-KSa9+5O17KRqWanO6OK4hU0cvk52xL7WgJ7+2vonDC/unl0c61ARyRaisTZGGsKc+T',
  };

  const options = {
    url: 'https://api.testim.io/tests',
    headers: headers
  };

  function callback(error, response, body) {
    if(!error && response.statusCode == 200) {
      const jsonDatas = JSON.parse(body);
      const dataLength = jsonDatas.tests.length;
      for(i=0; i<dataLength; i++) {
        const testName = jsonDatas.tests[i].name[0] + jsonDatas.tests[i].name[1];
        switch(testName) {
          case 'UT':
            unitTest.push(jsonDatas.tests[i].name);
            break;
          case 'PP':
            PPTest.push(jsonDatas.tests[i].name);
            break;
          case 'RT':
            RTTest.push(jsonDatas.tests[i].name);
            break;
        }
      }
    }
  }

  request(options, callback);
}

getTestList();

function getList(data) {
  let result = '';
  for(i=0;i<data.length;i++) {
    result += `<li style="margin-top:10px; ">${data[i]} <button onClick='run("${data[i]}")'>Run</button></li>`
  }
  return result;
}

let realtimeRun = cp.fork('./router/realtime.js');

realtimeRun.on('message', function(m) {
  console.log('PARENT got message:', m);
});

let webServer = new Hapi.server({
  port,
  routes: {
    cors: true
  }
});

let html_index = (item) => {
  return `
  <h1>iScrim Test List</h1>
  <p class="branch">The current branch is <strong></strong></p>
  <button onClick="changeBranch()">Change</button>
  <ul style="font-size:18px;">
    <h2>auto QA run <button onClick='run("autoRun")'>Run</button></h2>
    <h2>Realtime Test</h2>
      ${getList(RTTest)}
    <h2>P&P Test</h2>
      ${getList(PPTest)}
    <h2>Unit Test</h2>
      ${getList(unitTest)}
  </ul>
  <script>
    let branchText = document.querySelector('.branch > strong');
    let branch = 'master';
    branchText.innerText = branch;

    function run(testName) {
      location.href = "/realtime-admin?testName=" + testName + "&branch=" + branch;
    }

    function runUnitTest() {
      location.href = "/test-all-ut" + "?branch=" + branch;
    }

    function changeBranch() {
      alert("바꿀 수 있는 브랜치가 없습니다.");
      // let branchText = document.querySelector('.branch > strong');

      // if(branch === "master") {
      //   branch = "UI/UX 2_0";
      // } else {
      //   branch = "master";
      // };
      // branchText.innerText = branch;
    }
  </script>
  `
};

let html_sub1 = (item) => {
  return  `
  실행됨 : ${item.testName}
  <br><br>
  <a href="/">Back</a>`
};

 webServer.route({
  method: 'GET',
  path: '/',
  handler: async function (req, reply) {
    try{
      return html_index({});
    } catch(err){
      console.log(err);
      return 0;
    }
  }
});

webServer.route({
  method: 'GET',
  path: '/realtime-admin',
  handler: async function (req, reply) {
    try{
      let testName = req.query.testName;
      let branch = req.query.branch;

      console.log(`Run Testim Admin ${testName} of ${branch}`);
        
      realtimeRun.send({
        type: 'admin',
        testName: testName,
        branch: branch,
        "unitTest": unitTest
      });

      return html_sub1({testName});
    } catch(err){
      console.log(err);
      return 0;
    }
  }
});

 webServer.route({
  method: 'GET',
  path: '/realtime-user',
  handler: async function (req, reply) {
    try{
      let url = req.query.url;
        
      console.log("make json file..")
        
      realtimeRun.send({
        type: 'user', 
        url,
        testName: req.query.testName,
      });
      return 1;
    } catch(err){
          
      console.log(err);
      return 0;
    }
  }
});

// HTTP 서버 실행
async function start() {
  try {
    await webServer.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server running at: http://localhost:${port}`);
  return webServer;
};

// HTTP 서버 실행
start();;


module.exports = {
  start: start
}