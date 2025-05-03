
import { Subscriber } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscribers } from "@/context/SubscriberContext";
import { formatDate } from "@/lib/utils";

export function OverviewMetrics() {
  const { subscribers } = useSubscribers();

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === "active"
  );
  const inactiveSubscribers = subscribers.filter(
    (subscriber) => subscriber.status === "inactive"
  );

  const recentSubscribers = [...subscribers]
    .sort(
      (a, b) =>
        new Date(b.subscriptionDate).getTime() -
        new Date(a.subscriptionDate).getTime()
    )
    .slice(0, 3);

  // Calculate metrics
  const totalActive = activeSubscribers.length;
  const totalInactive = inactiveSubscribers.length;
  
  // Calculate plans
  const planCounts = activeSubscribers.reduce((acc, subscriber) => {
    acc[subscriber.plan] = (acc[subscriber.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate average subscription duration for active subscribers
  const avgDuration = activeSubscribers.length 
    ? activeSubscribers.reduce((sum, sub) => sum + sub.planDuration, 0) / activeSubscribers.length
    : 0;

  // Calculate recovery notes
  const totalRecoveryNotes = inactiveSubscribers.reduce(
    (sum, subscriber) => sum + subscriber.recoveryNotes.length,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalActive}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((totalActive / (totalActive + totalInactive)) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Inactive Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalInactive}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {inactiveSubscribers.length > 0 
              ? `${totalRecoveryNotes} recovery notes`
              : "No recovery plans yet"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{avgDuration.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            months per active subscriber
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Plan Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(planCounts).map(([plan, count]) => (
              <div key={plan} className="flex flex-col">
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{plan}</p>
              </div>
            ))}
            {Object.keys(planCounts).length === 0 && (
              <p className="text-sm text-muted-foreground">No active plans</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSubscribers.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center text-sm">
                <span>{sub.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(sub.subscriptionDate)}
                </span>
              </div>
            ))}
            {recentSubscribers.length === 0 && (
              <p className="text-sm text-muted-foreground">No subscribers yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OverviewMetrics;
