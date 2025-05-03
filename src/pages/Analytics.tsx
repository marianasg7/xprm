
import React from "react";
import { useSubscribers } from "@/context/SubscriberContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics: React.FC = () => {
  const { subscribers } = useSubscribers();

  // Status distribution
  const statusData = [
    {
      name: "Active",
      value: subscribers.filter((sub) => sub.status === "active").length,
    },
    {
      name: "Inactive",
      value: subscribers.filter((sub) => sub.status === "inactive").length,
    },
  ];

  // Plan distribution
  const planData = subscribers
    .filter((sub) => sub.status === "active")
    .reduce((acc, sub) => {
      const existingPlan = acc.find((item) => item.name === sub.plan);
      if (existingPlan) {
        existingPlan.value++;
      } else {
        acc.push({ name: sub.plan, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Duration distribution
  const durationData = subscribers
    .filter((sub) => sub.status === "active")
    .reduce((acc, sub) => {
      const existingDuration = acc.find(
        (item) => item.name === `${sub.planDuration} months`
      );
      if (existingDuration) {
        existingDuration.value++;
      } else {
        acc.push({ name: `${sub.planDuration} months`, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  // Tags distribution
  const tagsData = subscribers
    .flatMap((sub) => sub.tags)
    .reduce((acc, tag) => {
      const existingTag = acc.find((item) => item.name === tag.name);
      if (existingTag) {
        existingTag.value++;
      } else {
        acc.push({ name: tag.name, value: 1 });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Recovery notes per inactive subscriber
  const recoveryNotesData = subscribers
    .filter((sub) => sub.status === "inactive")
    .map((sub) => ({
      name: sub.name,
      value: sub.recoveryNotes.length,
    }));

  // Colors
  const COLORS = ["#0070D2", "#005FB2", "#004487", "#0088FF", "#66B3FF"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights about your subscribers
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {planData.length > 0 ? (
                <BarChart
                  data={planData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0070D2" name="Subscribers" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No active plans</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Duration</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {durationData.length > 0 ? (
                <BarChart
                  data={durationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#005FB2" name="Subscribers" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No active plans</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Tags</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {tagsData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={tagsData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagsData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No tags found</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recovery Notes by Unsubscribed User</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {recoveryNotesData.length > 0 ? (
                <BarChart
                  data={recoveryNotesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#004487" name="Notes" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No recovery notes yet</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
