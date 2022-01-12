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

async function admin(m) {
  let t = {
    token: "XK3REdHDS7mVkoI2DkK2L6Z6TMKn0ausUzq61Ss7NKf2WKT3Ji",
    project: "TpC4urUqG1bJzBMLrX3f",
    user: "6l6dtxlR9tiUwamXrmst",
    testName: m.testName,
    branch: "UI/UX 2_0"
  };

  console.log(`run "${t.testName}"`);

  //Test별로 분가기 필요한 경우
  // switch(m.testName) {
  //   case 'FFA - realtime(admin)': 
  //     ;
  //   break;
  //   case 'RR - realtime(admin)': 
  //     ;
  //   break;
  //   case 'SE - realtime(admin)': 
  //     ;
  //   break;
  // }

  Command({ exec: `testim --token "${t.token}" --project "${t.project}" --use-local-chrome-driver --user ${t.user} --name "${t.testName}" --branch "${t.branch}"`});
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
        branch: "UI/UX 2_0"
      };

      Command({ exec: `testim --token "${t.token}" --project "${t.project}" --use-local-chrome-driver --user ${t.user} --name "RR - realtime(user)" --params-file ${fileName} --branch "${t.branch}"`});
      resolve(1);
    }
  });
}).catch(errorHandler);}

function errorHandler(error) {
  console.error(error);
}



function Command(params) {
  let exec = require('child_process').exec;
  
  let child = exec(params.exec, function (error, stdout, stderr) {
      
    if (error !== null) {
      console.log('exec error: ' + error);
      return 'error';
    } else {
      console.log(`\nRun > ${params.exec}\n`);
      console.log(`Result >`);
      console.log(`${stdout}----------------------------------------------------------------`);
      return 1;
    }
  });
};