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
            if(jsonDatas.tests[i].name.split('(')[1] !== "user)") {
              RTTest.push(jsonDatas.tests[i].name);
            }
            break;
        }
      }
    }
  }

  request(options, callback);
};

getTestList();

function setTime(hour, minute) {
  if(hour < 0 || hour > 25) {
    alert("시간은 0 ~ 24 사이의 값을 입력해야 합니다.");
  } else if (minute < 0 || hour > 60) {
    alert("분은 0 ~ 60 사이의 값을 입력해야 합니다.");
  } else {
    autoQATime.hour = hour;
    autoQATime.hour = minute;
  }
}

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
  <span class="branch">The current branch is <strong></strong></span>
  <button onClick="changeBranch()">Change</button></br>
  <ul style="font-size:18px;">
    <h2>auto QA run <button onClick='run("autoRun")'>Run</button></h2>
    <span>
      <span id="hours"></span><span>시 </span>
      <span id="minutes"></span><span>분에 실행됩니다.</span>
    </span>
    <button onClick="changeTime()" id="changeTime_button" style="display: block;">시간 설정</button>
    <div class="changeTime" style="display: none;">
      <form>
        <input id="hour" type="number" name="hour" style="width: 60px;">시
        <input id="minute" type="number" name="minute">분
        <span>에 Auto QA 실행</span>
        <button onClick="changeTime()" id="changeTime_button">설정</button>
        <button onClick="Cancel()" id="cancel_button">취소</button>
      </form>
    </div>
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
    let localStorage = window.localStorage;
    let hours = document.getElementById("hours");
    let minutes = document.getElementById("minutes");
    if(localStorage.getItem("hour") === null || localStorage.getItem("minute") === null) {
      localStorage.setItem("hour", 6);
      localStorage.setItem("minute", 0);
    }

    hours.innerText = localStorage.getItem("hour");
    minutes.innerText = localStorage.getItem("minute");



    function run(testName) {
      let hours = document.getElementById("hours").textContent;
      let minutes = document.getElementById("minutes").textContent;
      location.href = "/realtime-admin?testName=" + testName + "&branch=" + branch + "&hours=" + hours + "&minutes=" + minutes;
    }

    function changeTime() {
      event.preventDefault();
      let changeButton = document.getElementById("changeTime_button").style;
      let settingButton = document.querySelector(".changeTime").style;
      let hour = document.getElementById("hour").value;
      let minute = document.getElementById("minute").value;

      if(changeButton.display == "block") {
        changeButton.display = "none";
        settingButton.display = "block";
      } else {
        if(hour < 0 || hour > 25) {
          window.alert("'시'에는 0 ~ 24 사이의 숫자만 입력 가능합니다.");
        } else if (minute < 0 || minute > 60) {
          window.alert("'분'에는 0 ~ 60 사이의 숫자만 입력 가능합니다.");
        } else {
          localStorage.setItem("hour", hour);
          localStorage.setItem("minute", minute);
          hours.innerText = localStorage.getItem("hour");
          minutes.innerText = localStorage.getItem("minute");
          changeButton.display = "block";
          settingButton.display = "none";
        }
      }
    }

    function cancel() {
      event.preventDefault();
      let changeButton = document.getElementById("changeTime_button").style;
      let settingButton = document.querySelector(".changeTime").style;

      changeButton.display = "block";
      settingButton.display = "none";
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
      return html_index();
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
      let hours = req.query.hours;
      let minutes = req.query.minutes;

      console.log(`Run Testim Admin ${testName} of ${branch}`);
      
      realtimeRun.send({
        type: 'admin',
        testName: testName,
        branch: branch,
        "unitTest": unitTest,
        hours,
        minutes
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