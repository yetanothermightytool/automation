const qs = require('querystring');

class OAuthToken {
 description = {
   displayName: 'Veeam Get Access Token',
   name: 'oauthToken',
   group: ['transform'],
   version: 1,
   description: 'OAuth Token Request (Password Grant)',
   defaults: { name: 'Get Bearer Token' },
   inputs: ['main'],
   outputs: ['main'],
   credentials: [
     {
       name: 'apiUser',
       required: true,
     },
   ],
   properties: [],
 };

 async execute() {
   const creds = await this.getCredentials('apiUser');

   const body = qs.stringify({
     grant_type: 'Password',
     username: creds.username,
     password: creds.password,
   });

   const response = await this.helpers.httpRequest({
     method: 'POST',
     url: `${creds.url}/api/oauth2/token`,
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

module.exports = { OAuthToken };
