
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewMetrics from "@/components/metrics/OverviewMetrics";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">XPRM Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your subscriber management system
        </p>
      </div>

      <OverviewMetrics />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Subscriber Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to XPRM, your subscriber management platform. Use the sidebar navigation to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>View and manage active subscribers</li>
              <li>Track unsubscribed users</li>
              <li>Create recovery plans for inactive subscribers</li>
              <li>Analyze subscriber metrics and trends</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
