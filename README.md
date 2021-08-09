# RAD
An Discord bot that allows users to listen to radio stations and fetch song info from supported stations

## Setup
1. Install all Packages via `npm i` 
2. Setup an IBM Cloudant account (Free) 
3. Import Database.json into Cloudant (Tutorials for couchdb importing are available online) if Importing doesn't work then manual labor is needed 
4. Change the URL in the np command to your own song fetching api (can also be found in our organization) if you prefer to not set it up then you can keep the current URL in place. Song API: https://github.com/MXY-Group/rad-song-api
5. Compile the TS to JS 
6. Launch start file in terminal via `node start.js`
