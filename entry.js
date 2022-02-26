import registerRootComponent from "expo/build/launch/registerRootComponent";
import App from "./src/App";
import { register } from "./src/serviceWorkerRegistration";
import "regenerator-runtime/runtime.js";

registerRootComponent(App);

register();
