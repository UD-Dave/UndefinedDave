const Path = process.cwd();
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const Hapi = require('hapi');
const port = 3000;

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
  
  let realtimeTest = {
    FFA: "FFA - realtime(admin)",
    RR: "RR - realtime(admin)",
    SE: "SE - realtime(admin)"
  };

  let pingpongTest = {
    FFA: "[Live]FFA P&P 시나리오",
    RR: "[Live]R.R P&P 시나리오",
    SE: "[Live]S.E P&P 시나리오"
  };
  
  return `
  <h1>iScrim Test List</h1>
  <p></p>
  <a href="#" onClick="test()">hahah</a>
 <ul style="font-size:18px;">
    <h2>Realtime Test</h2>
    <li style="margin-top:10px">${realtimeTest.FFA}<a href="/realtime-admin?testName=${realtimeTest.FFA}">Run</a></li>
    <li style="margin-top:10px">${realtimeTest.RR}<a href="/realtime-admin?testName=${realtimeTest.RR}">Run</a></li>
    <li style="margin-top:10px">${realtimeTest.SE}<a href="/realtime-admin?testName=${realtimeTest.SE}">Run</a></li>
    <h2>P&P Test</h2>
    <li style="margin-top:10px">${pingpongTest.FFA}<a href="/realtime-admin?testName=${pingpongTest.FFA}">Run</a></li>
    <li style="margin-top:10px">${pingpongTest.RR}<a href="/realtime-admin?testName=${pingpongTest.RR}">Run</a></li>
    <li style="margin-top:10px">${pingpongTest.SE}<a href="/realtime-admin?testName=${pingpongTest.SE}">Run</a></li>
  </ul>
  <script>
  
  function run() {

    
  }

  function test() {
    alert('hi');
  }
  </script>
  `
};

let html_sub1 = (item) => {return  `
실행됨 : ${item.testName}
<br><br>
<a href="/">Back</a>
`};

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

        console.log(`Run Testim Admin ${testName}`)
        
        realtimeRun.send({
          type: 'admin',
          testName: testName
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
          url
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
start();


module.exports = {
  start: start
}