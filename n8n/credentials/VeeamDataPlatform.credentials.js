class VeeamDataPlatform {
 constructor() {
   this.name = 'VeeamDataPlatform';
   this.displayName = 'Veeam Data Platform REST API';
   this.icon = 'file:VeeamDataPlatform.credentials.png';
   this.documentationUrl = 'https://github.com/yetanothermightytool/automation/blob/main/n8n/README.md';
   this.properties = [
     {
       displayName: 'URL of your Veeam Backup & Replication or Veeam ONE Server. Use port 1239 for Veeam ONE',
       name: 'url',
       type: 'string',
       default: 'https://veeam-server:9419',
     },
     {
       displayName: 'API Version - Use v2.3 for Veeam ONE',
       name: 'apiVersion',
       type: 'string',
       default: '1.3-rev1',
     },
     {
       displayName: 'Username',
       name: 'username',
       type: 'string',
       default: '',
     },
     {
       displayName: 'Password',
       name: 'password',
       type: 'string',
       typeOptions: { password: true },
       default: '',
     },
     {
       displayName: 'Ignore SSL Errors',
       name: 'ignoreSsl',
       type: 'boolean',
       default: true,
     }
   ];
 }
}

module.exports = { VeeamDataPlatform };
