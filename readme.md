# OneDrive File Management App

## Description
This Node.js application connects to OneDrive to list files, download files, and list all users who have access to a specific file.

## Setup Guide
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with your Microsoft Graph credentials copy .env.sample Add the credentials from ur Azure account
[ref: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade] - App registrations

- `CLIENT_ID=XXXXX-3eea-4787-a586-XXXXX`
- `CLIENT_SECRET=XXXX~H8Wpqim7~y1.EEpIT.XXXXX`
- `REDIRECT_URI=http://localhost:3030/auth/callback`
- `PORT=3030`
- MS_BASE_URL=https://graph.microsoft.com/v1.0
- WEBHOOK_URL=https://f553-49-37-178-222.ngrok-free.app/webhook

## Running the Application
1. Start the server with `npm start`.
2. Use the following endpoints:
   - LOGIN USER: `GET http://localhost:3030/login`
   - USER PROFILE INFO: `GET http://localhost:3030/profile`
   - CREATE SUBSCRIPTION NOT WORKING: `POST http://localhost:3030/create/subscription`
   - List files: `GET http://localhost:3030/list/files`
   - Download file: `GET http://localhost:3030/download/file/:itemId` // pass the fileId attribute fetched from list files 
   - List users with access to a file: `GET http://localhost:3030/file/access/:itemId`
   - Handle Webhook : `POST http://localhost:3030/webhook`

## Note
Real-time updates for file access changes are not implemented in this version.


## API Ref

- https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http#code-try-1

- https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0&tabs=http#code-try-1

- https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=http