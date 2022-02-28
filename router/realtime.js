const Path = process.cwd();
const path = require('path');
const fs = require('fs');
// const request = require('request');
// const Slack = require("@slack/web-api");

// const API_TOKEN = "xoxb-1045511020183-3160266767956-OfzQVTJ0VsKpctuayv5U9VaB";
// // const slack = new Slack(API_TOKEN);
// Slack.event('chat.postMessage', async ({ event, client, logger }) => {
//   try {
//     // Call chat.postMessage with the built-in client
//     const result = await client.chat.postMessage({
//       channel: welcomeChannelId,
//       text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
//     });
//     logger.info(result);
//   }
//   catch (error) {
//     logger.error(error);
//   }
// });

// function post_message(token, channel, text) {
//   response = request.post("https://slack.com/api/chat.postMessage",
//     headers = {
//       "Authorization": "Bearer" + token
//     },
//     data = {
//       "channel": channel,
//       "text": text
//     }
//   );
//   console.log(response);
// };

// post_message(API_TOKEN, "", "hello");

process.on('message', async (m) => {

  switch(m.type) {
    case 'admin':
      admin(m);
    break;
    case 'user': 
      player(m);
    break;
  }
});

function pause(sec) {
  return new Promise((resolve, reject) => {
    let a = setTimeout(()=>{
      resolve(1);
    }, sec);
  }).catch(errorHandler);
}

async function testAll(testList) {
  let successCount = 0;
  let failCount = 0;
  let failTestNameArr = [];

  //첫번째 테스트testList.unitTest.length - 18
  console.log('첫번째 테스트를 진행합니다.');
  for(let i = 1; i < testList.unitTest.length; i++) {
    let testName = testList.unitTest[i];
    console.log(`run ${testName}`);
    let sw = await asyncCommand({ exec: `testim --token "${testList.token}" --project "${testList.project}" --use-local-chrome-driver --user ${testList.user} --name "${testName}" --branch "${testList.branch}"`});
    if(sw === "resolve") {
      successCount += 1;
    } else {
      failCount += 1;
      failTestNameArr.push(testName);
    }
  }

  console.log('첫번째 테스트 결과 ---------------------------------');
  console.log(`successCount is ${successCount}`);
  console.log(`failCount is ${failCount}`);
  console.log(`------------------------------------------------------------`);
  console.log(`실패한 테스트 👇`);
  console.log(failTestNameArr);
  console.log(`------------------------------------------------------------`);
  //두번째 테스트
  console.log('두번째 테스트를 진행합니다.');
  let testLength = failTestNameArr.length;
  console.log(testLength);
  successCount = 0;
  failCount = 0;
  let secondFailTestNameArr = [];
  for(let i = 0; i < testLength; i++) {
    let testName = failTestNameArr[i];
    console.log(`run ${testName}`);
    let sw = await asyncCommand({ exec: `testim --token "${testList.token}" --project "${testList.project}" --use-local-chrome-driver --user ${testList.user} --name "${testName}" --branch "${testList.branch}"`});
    if(sw === "resolve") {
      successCount += 1;
    } else {
      failCount += 1;
      secondFailTestNameArr.push(testName);
    }
  }
  console.log('두번째 테스트 결과 ---------------------------------');
  console.log(`successCount is ${successCount}`);
  console.log(`failCount is ${failCount}`);
  console.log(`------------------------------------------------------------`);
  console.log(`실패한 테스트 👇`);
  console.log(secondFailTestNameArr);
  console.log(`------------------------------------------------------------`);

  //세번째 테스트
  console.log('세번째 테스트를 진행합니다.');
  testLength = secondFailTestNameArr.length;
  console.log(testLength);
  successCount = 0;
  failCount = 0;
  let thirdFailTestNameArr = [];
  for(let i = 0; i < testLength; i++) {
    let testName = secondFailTestNameArr[i];
    console.log(`run ${testName}`);
    let sw = await asyncCommand({ exec: `testim --token "${testList.token}" --project "${testList.project}" --use-local-chrome-driver --user ${testList.user} --name "${testName}" --branch "${testList.branch}"`});
    if(sw === "resolve") {
      successCount += 1;
    } else {
      failCount += 1;
      thirdFailTestNameArr.push(testName);
    }
  }
  console.log('세번째 테스트 결과 ---------------------------------');
  console.log(`successCount is ${successCount}`);
  console.log(`failCount is ${failCount}`);
  console.log(`------------------------------------------------------------`);
  console.log(`실패한 테스트 👇`);
  console.log(thirdFailTestNameArr);
  console.log(`------------------------------------------------------------`);
}

async function admin(m) {
  let t = {
    token: "XK3REdHDS7mVkoI2DkK2L6Z6TMKn0ausUzq61Ss7NKf2WKT3Ji",
    project: "TpC4urUqG1bJzBMLrX3f",
    user: "tyYtRktrZgykCJ5oHzNS",
    testName: m.testName,
    branch: m.branch,
    unitTest: m.unitTest
  };

  // Unit Test와 개별 Test 분기
  if(t.testName === "All Unit Test") {
    testAll(t);
  } else if(t.testName === "autoRun") {
    const runHour = 6;
    const runMinute = 0;
    console.log(`매일 오전 ${runHour}시 ${runMinute}분에 실행 될 예정입니다.`)
    setInterval(() => {
      let time = new Date();
      let hour = time.getHours();
      let minute = time.getMinutes();
      if(hour === runHour && minute === runMinute) {
        testAll(t);
      }
    }, 60000);
  } else {
    Command({ exec: `testim --token "${t.token}" --project "${t.project}" --use-local-chrome-driver --user ${t.user} --name "${t.testName}" --branch "${t.branch}"`});
  }
}



async function player(m) {
  let userLength = 6;

  if(m.testName === 'SE - realtime(user)') {
    userLength = 8;
  };

  for(let i = 0; i < userLength; i++) {
    console.log(`Starting ${m.testName} user ${i}..`)
    await playerStart(i+1, m);
    await pause(50000);
  }
}



function playerStart(idx, m) {return new Promise((resolve, reject) => {    	
  let userName = `user_${idx}`;
  let userFormat = {
    "user" : userName,
    "url" : m.url,
    "testName": m.testName
  };

  console.log(userFormat);
  let fileName = `./players/${userName}.json`;
  userFormat = JSON.stringify(userFormat); 

  let test = fs.writeFile(fileName, userFormat, 'utf8', async (err) => {
    if(err) {
      console.log(`파일 생성 오류 ${fileName}`);
      reject(-1);
    } else {
      console.log(`파일 생성 성공 ${fileName}`);

      let t = {
        token: "XK3REdHDS7mVkoI2DkK2L6Z6TMKn0ausUzq61Ss7NKf2WKT3Ji",
        project: "TpC4urUqG1bJzBMLrX3f",
        user: "tyYtRktrZgykCJ5oHzNS",
        testName: m.testName,
        branch: "master"
      };

      Command({ 
        exec: `testim --token "${t.token}" --project "${t.project}" --use-local-chrome-driver --user ${t.user} --name "FFA - realtime(user)" --params-file ${fileName} --branch "${t.branch}"`
      });
      resolve(1);
    }
  });
}).catch(errorHandler);}

function errorHandler(error) {
  console.error(error);
}



function Command(params) {
  let exec = require('child_process').exec;
  
  let child = exec(params.exec, (error, stdout, stderr) => {
    if (error !== null) {
      console.log(error);
      console.log('테스트가 실패하였습니다. 🙀');
    } else {
      console.log('테스트가 성공하였습니다. 👍');
    }
  });
};

function asyncCommand(params) {
  return new Promise((resolve, reject) => {
    let exec = require('child_process').exec;
    let child = exec(params.exec, (error, stdout, stderr) => {
      if (error !== null) {
        console.log('테스트가 실패하였습니다. 🙀');
        reject('error');
      } else {
        console.log('테스트가 성공하였습니다. 👍');
        resolve('resolve');
      }
    });
  }).catch(console.error);
}