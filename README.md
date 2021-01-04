# Running the App

Run `yarn` in client and server folders
Run `ngrok http 8080`

Run `yarn build` in server folder

Change socket in App.js in client to the ngrok url
Import images in App.js (refer to "configuration" below)
Run `yarn build` in client folder

Edit the options.ts (refer to "configuration" below)
Run `node index.js` in the build folder

# Configuration

Use `require` to import any used images in `client/src/App.js`. Refer to the current code for Placeholder.js for this

Add your own options in `server/src/controllers/options.ts`
