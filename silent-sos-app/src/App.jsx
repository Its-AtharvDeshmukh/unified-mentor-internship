import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Location from "./pages/Location";
import History from "./pages/History";
import Delivery from "./pages/Delivery";
import MobileNavigation from "./components/MobileNavigation";
import useNavigation from "./hooks/useNavigation";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NeutralScreen from "./pages/NeutralScreen";
import Icon from "./components/Icon";
import PageTransition from "./components/PageTransition";
import { useSafety, SafetyProvider } from "./context/SafetyContext";
import { useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
function SafetyApp() {
  const { page, navigate: changePage } = useNavigation();
  const [menu, setMenu] = useState(false);
  const [addInitially, setAddInitially] = useState(false);
  const { neutral, toast, online, storageError } = useSafety();
  const navigate = (id, add = false) => {
    setAddInitially(add);
    setMenu(false);
    changePage(id);
  };
  if (neutral) return <NeutralScreen />;
  return (
    <div className="app-shell">
      <div className="workspace-backdrop" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar
        page={page}
        navigate={navigate}
        open={menu}
        close={() => setMenu(false)}
      />
      <div className="main-shell">
        <Header
          openMenu={() => setMenu(true)}
          menuOpen={menu}
          navigate={navigate}
        />
        <main id="main-content" className="main-content">
          {!online && (
            <div className="warning-banner" role="status">
              <Icon name="offline" size={18} />
              You’re offline. This demo remains local and sends no messages.
            </div>
          )}
          {storageError && (
            <div className="warning-banner" role="status">
              Browser storage is unavailable. Profile and contact changes may
              not survive a refresh.
            </div>
          )}
          <PageTransition page={page}>
            {page === "dashboard" && <Dashboard navigate={navigate} />}
            {page === "users" && <Contacts addInitially={addInitially} />}
            {page === "location" && <Location />}
            {page === "history" && <History navigate={navigate} />}
            {page === "delivery" && <Delivery navigate={navigate} />}
            {page === "settings" && <Settings />}
            {page === "help" && <Help navigate={navigate} />}
          </PageTransition>
        </main>
      </div>
      <MobileNavigation page={page} navigate={navigate} />
      {toast && (
        <div className="toast" role="status">
          <Icon name="info" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
export default function App() {
  const { user } = useAuth();
  return user ? (
    <SafetyProvider key={user.id} account={user}>
      <SafetyApp />
    </SafetyProvider>
  ) : (
    <Auth />
  );
}
