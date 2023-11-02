# zupass-react-native-example
Example showing how to integrate with Zupass.org via React Native

|iOS|Android|Web|
|---|---|---|
|![Demo using Zupass auth on iOS](<demo/Zupass demo iOS.gif>)|![Demo using Zupass auth on Android](<demo/Zupass demo android.gif>)|![Demo using Zupass auth on Web](<demo/Zupass demo web.gif>)|

---

## How to run the example

1. Clone the repo
2. `cd zupass-verify-server; npm install; npm run dev`
3. `cd zupass-react-native-example; npm install`
4. `npm run ios` or `npm run android` or `npm run web`

NOTE: for Android, localhost won't work, so use something like ngrok to expose your local server to the internet. Then change the VERIFY_SERVICE_URL to point to your ngrok url.
