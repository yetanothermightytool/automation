# n8n Custom Integration for Veeam Backup & Replication

This custom n8n integration provides OAuth Password Grant authentication for the Veeam Backup & Replication REST API. It consists of a custom credential type and an authentication node that generates Bearer tokens for subsequent API calls.

## Version Information
~~~~
Version: 1.0
Requires: Veeam Backup & Replication & n8n
Author: Stephan "Steve" Herzig
~~~~

## Features
- **Custom Credential Type** Stores Veeam Backup & Replication REST API endpoint, API Revision level, authentication details, and SSL validation options
- **OAuth Token Node** Handles the Bearer token creation and passes the token and other details for further usage.
- **Seamless Integration** Generated Bearer token and API details are accessible in HTTP Request nodes

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
│   ├── ApiUser.credentials.js
│   └── ApiUser.credentials.png
└── nodes/
   └── OAuthToken.node.js
```
4. Set the custom extensions environment variable in the docker-compose.yml file

```yaml
export N8N_CUSTOM_EXTENSIONS=~/.n8n/custom
```
5. Restart
Restart n8n to load the custom node.

## Usage
1. In n8n, create a new credential of type “Veeam Backup & Replication REST API”
2. Configure the following fields:
   - Give the credential a name that refers to your endpoint (top left corner) 
   - URL: Your Veeam B&R server endpoint (e.g., https://vbr-server:9419)
   - API Version: API version (e.g., 1.3-rev1)
   - Username: Your username
   - Password: Your password
   - Ignore SSL Errors: Enable for self-signed certificates
4. Add the "Veeam Get Access Token" node to your workflow
5. Select your configured credential
6. The node will output the access token, URL, and API version for use in the follwing nodes.

## Usage in Workflows
Access the generated values in HTTP Request nodes using:

- {{$json.access_token}}  // Bearer token
- {{$json.url}}           // API base URL
- {{$json.apiVersion}}    // API version

## Sample Workflows
Coming soon

## Notes
Tested with n8n version 2.7.5

## Disclaimer
**This integration and workflows are not officially supported by Veeam Software. Use it at your own risk.**

## Version History
- 1.0 (February 2026 - Project start was in July 2025)
   - Initial version
