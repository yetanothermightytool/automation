class ApiUser {
 constructor() {
   this.name = 'apiUser';
   this.displayName = 'Veeam Backup & Replication REST API';
   this.icon = 'file:ApiUser.credentials.png';
   this.documentationUrl = 'https://github.com/yetanothermightytool/automation/blob/main/n8n/README.md';
   this.properties = [
     {
       displayName: 'URL',
       name: 'url',
       type: 'string',
       default: 'https://vbr-server:9419',
     },
     {
       displayName: 'API-Version',
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

module.exports = { ApiUser };
