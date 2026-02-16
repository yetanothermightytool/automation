const qs = require('querystring');

class VeeamONEToken {
 description = {
   displayName: 'Veeam ONE Get Access Token',
   name: 'VeeamONEToken',
   icon: 'file:bearer.png',
   group: ['transform'],
   version: 1,
   description: 'OAuth Token Request',
   defaults: { name: 'Get Bearer Token' },
   inputs: ['main'],
   outputs: ['main'],
   credentials: [
     {
       name: 'VeeamDataPlatform',
       required: true,
     },
   ],
   properties: [],
 };

 async execute() {
   const creds = await this.getCredentials('VeeamDataPlatform');

   const body = qs.stringify({
     grant_type: 'Password',
     username: creds.username,
     password: creds.password,
   });

   const response = await this.helpers.httpRequest({
     method: 'POST',
     url: `${creds.url}/api/token`,
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'x-api-version': creds.apiVersion,
     },
     body,
     json: true,
     skipSslCertificateValidation: creds.ignoreSsl,
   });

   return [[{ 
     json: {
       access_token: response.access_token,
       url: creds.url,
       apiVersion: creds.apiVersion
     }
   }]];
 }
}

module.exports = { VeeamONEToken };
