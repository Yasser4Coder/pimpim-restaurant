import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";

const PUBLISHABLE_KEY = process.env.REACT_APP_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return <AppRoutes />;
}

export default App;
