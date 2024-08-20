import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ClerkProvider } from "@clerk/clerk-react";
import StatusAd from "./components/StatusAd";

const PUBLISHABLE_KEY = process.env.REACT_APP_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="App">
        <StatusAd />
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </ClerkProvider>
  );
}

export default App;
