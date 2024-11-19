import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="167420843719-6qbd5c970js3uqr51c8a3oiu2ug790u3.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
