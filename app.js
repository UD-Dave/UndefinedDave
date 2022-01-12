const Path = process.cwd();
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const Hapi = require('hapi');
const port = 3000;
let realtimeTest = {
  FFA: "FFA - realtime(admin)",
  RR: "RR - realtime(admin)",
  SE: "SE - realtime(admin)"
};

let pingpongTest = {
  FFA: "FFA - pingpongTest",
  RR: "RR - pingpongTest",
  SE: "SE - pingpongTest"
};

let unitTest = [
  {allTest: "All Unit Test"},
  {test1: "UT - Admin -> User 정지하기"},
  {test2: "UT - Change Profile"},
  {test3: "UT - SA Admin 지정 및 삭제"},
  {test4: "UT - User 대회 -> 하단블럭 fixed 검증"},
  {test5: "UT - login"},
  {test6: "UT - 대진표 생성 to 발표"},
  {test7: "UT - 대회생성"},
  {test8: "UT - 대회정보 수정"},
  {test9: "UT - 상금 지정하기"},
  {test10: "UT - 선수 리스트 더보기 검증"},
  {test11: "UT - 언어변경 테스트"},
  {test12: "UT - 접수 및 초대코드"},
  {test13: "UT - 접수팀 관리"},
  {test14: "UT - 직접추가"},
  {test15: "UT - 초대코드"},
  {test16: "UT - 출석"},
  {test17: "UT - 팀 리스트 더보기 검증"},
  {test18: "UT - 플랫폼 설정 수정"},
  {test19: "UT - 회원가입"}
];

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
    <h2>Realtime Test</h2>
      <li style="margin-top:10px; ">${realtimeTest.FFA} <button onClick='run("${realtimeTest.FFA}"'>Run</button></li>
      <li style="margin-top:10px; ">${realtimeTest.RR} <button onClick='run("${realtimeTest.RR}")'>Run</button></li>
      <li style="margin-top:10px; ">${realtimeTest.SE} <button onClick='run("${realtimeTest.SE}")'>Run</button></li>
    <h2>P&P Test</h2>
      <li style="margin-top:10px; ">${pingpongTest.FFA} <button onClick='run("${pingpongTest.FFA}")'>Run</button></li>
      <li style="margin-top:10px; ">${pingpongTest.RR} <button onClick='run("${pingpongTest.RR}")'>Run</button></li>
      <li style="margin-top:10px; ">${pingpongTest.SE} <button onClick='run("${pingpongTest.SE}")'>Run</button></li>
    <h2>Unit Test</h2>
      <li style="margin-top:10px; ">${unitTest[0].allTest} <button onClick='run("${unitTest[0].allTest}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[1].test1} <button onClick='run("${unitTest[1].test1}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[2].test2} <button onClick='run("${unitTest[2].test2}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[3].test3} <button onClick='run("${unitTest[3].test3}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[4].test4} <button onClick='run("${unitTest[4].test4}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[5].test5} <button onClick='run("${unitTest[5].test5}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[6].test6} <button onClick='run("${unitTest[6].test6}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[7].test7} <button onClick='run("${unitTest[7].test7}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[8].test8} <button onClick='run("${unitTest[8].test8}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[9].test9} <button onClick='run("${unitTest[9].test9}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[10].test10} <button onClick='run("${unitTest[10].test10}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[11].test11} <button onClick='run("${unitTest[11].test11}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[12].test12} <button onClick='run("${unitTest[12].test12}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[13].test13} <button onClick='run("${unitTest[13].test13}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[14].test14} <button onClick='run("${unitTest[14].test14}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[15].test15} <button onClick='run("${unitTest[15].test15}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[16].test16} <button onClick='run("${unitTest[16].test16}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[17].test17} <button onClick='run("${unitTest[17].test17}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[18].test18} <button onClick='run("${unitTest[18].test18}")'>Run</button></li>
      <li style="margin-top:10px; ">${unitTest[19].test19} <button onClick='run("${unitTest[19].test19}")'>Run</button></li>
  </ul>
  <script>
    let branchText = document.querySelector('.branch > strong');
    let branch = 'auto-detect';
    branchText.innerText = branch;

    let realtimeTest = {
      FFA: "${realtimeTest.FFA}",
      RR: "${realtimeTest.RR}",
      SE: "${realtimeTest.SE}"
    };

    let pingpongTest = {
      FFA: "${pingpongTest.FFA}",
      RR: "${pingpongTest.RR}",
      SE: "${pingpongTest.SE}",
    };

    let unitTest = {
      test1: "${unitTest[1].test1}",
      test2: "${unitTest[2].test2}",
      test3: "${unitTest[3].test3}",
      test4: "${unitTest[4].test4}",
      test5: "${unitTest[5].test5}",
      test6: "${unitTest[6].test6}",
      test7: "${unitTest[7].test7}",
      test8: "${unitTest[8].test8}",
      test9: "${unitTest[9].test9}",
      test10: "${unitTest[10].test10}",
      test11: "${unitTest[11].test11}",
      test12: "${unitTest[12].test12}",
      test13: "${unitTest[13].test13}",
      test14: "${unitTest[14].test14}",
      test15: "${unitTest[15].test15}",
      test16: "${unitTest[16].test16}",
      test17: "${unitTest[17].test17}",
      test18: "${unitTest[18].test18}",
      test19: "${unitTest[19].test19}",
    }

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