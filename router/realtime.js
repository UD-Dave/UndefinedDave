const Path = process.cwd();
const path = require('path');
const fs = require('fs');

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

//process.send({ foo: 'bar' });

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
  for(let i = 1; i < testList.unitTest.length - 16; i++) {
    let testName = Object.values(testList.unitTest[i])
    console.log(`run ${testName}`);
    let sw = await asyncCommand({ exec: `testim --token "${testList.token}" --project "${testList.project}" --use-local-chrome-driver --user ${testList.user} --name "${testName}" --branch "${testList.branch}"`});
    if(sw === "resolve") {
      successCount += 1;
    } else {
      failCount += 1;
    }
  }
  console.log(`successCount is ${successCount}`);
  console.log(`failCount is ${failCount}`);
}

async function admin(m) {
  let t = {
    token: "XK3REdHDS7mVkoI2DkK2L6Z6TMKn0ausUzq61Ss7NKf2WKT3Ji",
    project: "TpC4urUqG1bJzBMLrX3f",
    user: "6l6dtxlR9tiUwamXrmst",
    testName: m.testName,
    branch: m.branch,
    unitTest: m.unitTest
  };

  console.log(t);

  // Unit Test와 개별 Test 분기
  if(t.testName === "All Unit Test") {
    testAll(t);
  } else {
    Command({ exec: `testim --token "${t.token}" --project "${t.project}" --use-local-chrome-driver --user ${t.user} --name "${t.testName}" --branch "${t.branch}"`});
  }
}



async function player(m) {
  console.log(m);
  let userLength = 6;

  if(m.testName === 'SE - realtime(admin)') {
    userLength = 8;
  };

  for(let i = 0; i < userLength; i++) {
    console.log(`Starting single elimination user${i}..`)
    await playerStart(i+1, m);
    await pause(50000);
  }
}



function playerStart(idx, m) {return new Promise((resolve, reject) => {    	
  let userName = `user_${idx}`;
  let userFormat = {
    "user" : userName,
    "url " : m.url,
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
        user: "6l6dtxlR9tiUwamXrmst",
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
        console.log(stdout);
        reject('error');
      } else {
        console.log('테스트가 성공하였습니다. 👍');
        resolve('resolve');
      }
    });
  }).catch(console.error);
}