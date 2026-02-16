# n8n Custom Integration for the Veeam Data Platform

This custom n8n integration provides n8n nodes that use a custom credential configuration to generate Bearer tokens via the Password Grant method for Veeam Backup & Replication and Veeam ONE REST APIs.

## Version Information
~~~~
Version: 1.0
Requires: Veeam Backup & Replication & n8n
Author: Stephan "Steve" Herzig
~~~~

## Features
- **Custom Credential Type**
     - Stores the Veeam Backup & Replication or the Veeam ONE REST API endpoint, API Revision level, authentication details, and SSL validation options
- **OAuth Token Node**
    - Handles the Bearer token creation and passes the token and other details for further usage
- **Seamless Integration**
    -  Generated Bearer token and API details are accessible in HTTP Request nodes

## Docker Setup
1. Add the custom extensions path to your `docker-compose.yml`:

```yaml
environment:
 - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

2. n8n_data mounted to /home/node/.n8n - Adjust if needed
```yaml
   volumes:
     - ./n8n_data:/home/node/.n8n
```
3. Create the directory structure and place the files accordingly
```
~/.n8n/custom/
├── credentials/
│   ├── VeeamDataPlatform.credentials.js
│   └── VeeamDataPlatform.credentials.png
└── nodes/
   └── VeeamToken.node.js
   └── VeeamONEToken.node.js
   └── bearer.png

```
4. Set the custom extensions environment variable in the docker-compose.yml file

```yaml
environment:
   - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```
5. Restart
Restart n8n to load the custom node.

## Usage
1. In n8n, create a new credential of type “Veeam Data Platofrm”
   ![alt text](https://github.com/yetanothermightytool/automation/blob/main/n8n/images/Add_Credentials.png)

2. Configure the following fields:
   ![alt text](https://github.com/yetanothermightytool/automation/blob/main/n8n/images/Configure_Credentials.png)

   - Give the credential a name that refers to your endpoint (top left corner) 
   - URL: Your Veeam B&R server endpoint (e.g., https://vbr-server:9419 - Veeam ONE https://vone-server:1239)
   - API Version: API version (e.g., 1.3-rev1 for Veeam Backup & Replication or v2.3 for Veeeam ONE)
   - Username: Your username
   - Password: Your password
   - Ignore SSL Errors: Enable for self-signed certificates

3. Create a new workflow
4. Add the "Veeam Get Access Token" or "Veeam ONE get Access Token" node to your workflow
   ![alt text](https://github.com/yetanothermightytool/automation/blob/main/n8n/images/Add_Node.png)

5. Select your configured credential and click 'Execute step' to check if a Bearer token can be retrieved
   ![alt text](https://github.com/yetanothermightytool/automation/blob/main/n8n/images/Node_Parameters.png)

6. The node will output the access token, URL, and API version for use in the follwing nodes.

## Usage in Workflows
Access the generated values in HTTP Request nodes using:

- {{$json.access_token}}  // Bearer token
- {{$json.url}}           // API base URL
- {{$json.apiVersion}}    // API version

## Sample Workflows
[See here](https://github.com/yetanothermightytool/automation/blob/main/n8n/workflows/README.md)

## Notes
n8h self-hosting setup only
Tested with n8n version 2.7.5

## Disclaimer
**This integration and workflows are not officially supported by Veeam Software. Use it at your own risk.**

## Version History
- 1.0 (February 16th 2026)
   - Initial version
