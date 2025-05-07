
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { Dashboard } from "./pages/Dashboard";
import SubscribersPage from "./pages/Subscribers";
import { NonSubscribers } from "./pages/NonSubscribers";
import { Castings } from "./pages/Castings";
import { Sales } from "./pages/Sales";
import { Plans } from "./pages/Plans";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import Projects from "./pages/Projects";
import Telegram from "./pages/Telegram";
import { Index } from "./pages/Index";
import { SubscriberProvider } from "./context/SubscriberContext";
import { SalesProvider } from "./context/SalesContext";

function App() {
  return (
    <SubscriberProvider>
      <SalesProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="flex h-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="flex-1 p-6 pb-20 max-w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subscribers" element={<SubscribersPage />} />
                  <Route path="/non-subscribers" element={<NonSubscribers />} />
                  <Route path="/castings" element={<Castings />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/telegram" element={<Telegram />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </SalesProvider>
    </SubscriberProvider>
  );
}

export default App;
