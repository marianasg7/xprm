
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from "@/types/types";

interface SalesStatisticsProps {
  sales: Sale[];
}

export const SalesStatistics: React.FC<SalesStatisticsProps> = ({ sales }) => {
  // Calculate statistics
  const totalSales = sales.reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const paidSales = sales.filter(s => s.paymentStatus === "paid").reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const pendingSales = sales.filter(s => s.paymentStatus === "pending").reduce((sum, sale) => sum + (sale.price * (sale.quantity || 1)), 0);
  const totalQuantity = sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Paid Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${paidSales.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${pendingSales.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuantity}</div>
        </CardContent>
      </Card>
    </div>
  );
};
