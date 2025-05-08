
import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { SubscriberProvider } from "./context/SubscriberContext";
import { SalesProvider } from "./context/SalesContext";

function App() {
  return (
    <SubscriberProvider>
      <SalesProvider>
        <Routes>
          <Route path="/*" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SalesProvider>
    </SubscriberProvider>
  );
}

export default App;
