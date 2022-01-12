const Path = process.cwd();
const path = require('path');
const fs = require('fs');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/',
    handler: async function (req, reply) {
      try{
        console.log('healthCheck');
        return 1;
      } catch(err){
          
        console.log(err);
        return 0;
      }
    }
  });
};
