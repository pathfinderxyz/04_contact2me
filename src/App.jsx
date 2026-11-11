import { Navigate, Route, Routes } from "react-router-dom";
import { useStore } from "./store";
import Shell from "./shell";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import CampaignForm from "./pages/CampaignForm";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import CardEditor from "./pages/CardEditor";
import More from "./pages/More";
import Academy from "./pages/Academy";
import Users from "./pages/Users";
import Reportes from "./pages/Reportes";
import Integraciones from "./pages/Integraciones";
import Chat from "./pages/Chat";
import PublicPage from "./pages/PublicPage";

function Private({ children }) {
  const { ready, user } = useStore();
  if (!ready) return <div className="boot">Cargando el panel…</div>;
  if (!user) return <Navigate to="/" replace />;
  return <Shell>{children}</Shell>;
}

function Guest({ children }) {
  const { ready, user } = useStore();
  if (!ready) return <div className="boot">Cargando el panel…</div>;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Guest>
            <Login />
          </Guest>
        }
      />
      <Route
        path="/app"
        element={
          <Private>
            <Home />
          </Private>
        }
      />
      <Route
        path="/app/campanas"
        element={
          <Private>
            <Campaigns />
          </Private>
        }
      />
      <Route
        path="/app/campanas/nueva"
        element={
          <Private>
            <CampaignForm />
          </Private>
        }
      />
      <Route
        path="/app/campanas/:id"
        element={
          <Private>
            <CampaignForm />
          </Private>
        }
      />
      <Route
        path="/app/leads"
        element={
          <Private>
            <Leads />
          </Private>
        }
      />
      <Route
        path="/app/leads/:id"
        element={
          <Private>
            <LeadDetail />
          </Private>
        }
      />
      <Route
        path="/app/datos"
        element={
          <Private>
            <CardEditor />
          </Private>
        }
      />
      <Route path="/app/tarjeta" element={<Navigate to="/app/datos" replace />} />
      <Route
        path="/app/reportes"
        element={
          <Private>
            <Reportes />
          </Private>
        }
      />
      <Route
        path="/app/integraciones"
        element={
          <Private>
            <Integraciones />
          </Private>
        }
      />
      <Route
        path="/app/chat"
        element={
          <Private>
            <Chat />
          </Private>
        }
      />
      <Route
        path="/app/mas"
        element={
          <Private>
            <More />
          </Private>
        }
      />
      <Route
        path="/app/academia"
        element={
          <Private>
            <Academy />
          </Private>
        }
      />
      <Route
        path="/app/usuarios"
        element={
          <Private>
            <Users />
          </Private>
        }
      />
      <Route path="/c/:slug" element={<PublicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
