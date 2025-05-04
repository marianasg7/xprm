
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import { SubscriberProvider } from "@/context/SubscriberContext";
import Dashboard from "@/pages/Dashboard";
import SubscribersPage from "@/pages/Subscribers";
import NonSubscribersPage from "@/pages/NonSubscribers";
import AnalyticsPage from "@/pages/Analytics";
import SettingsPage from "@/pages/Settings";
import CastingsPage from "@/pages/Castings";
import PlansPage from "@/pages/Plans";
import SalesPage from "@/pages/Sales";

export default function Index() {
  return (
    <SubscriberProvider>
      <SidebarProvider>
        <div className="h-screen flex w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container py-6">
              <SidebarTrigger className="mb-6 ml-2 block md:hidden" />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/subscribers" element={<SubscribersPage />} />
                <Route path="/subscribers/:id" element={<SubscribersPage />} />
                <Route path="/non-subscribers" element={<NonSubscribersPage />} />
                <Route path="/non-subscribers/:id" element={<NonSubscribersPage />} />
                <Route path="/castings" element={<CastingsPage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </SubscriberProvider>
  );
}
