"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, AlertTriangle, CheckCircle2, Activity, Users,
  BarChart3, TrendingUp
} from "lucide-react";
import API from "@/services/api";
import Navbar from "@/components/Navbar";
import ItemTable from "@/components/ItemTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Item = {
  id: number;
  name: string;
  stock: number;
  description?: string;
  category_id?: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      initializeData();
    }
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([fetchUser(), fetchItems()]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to load data";
      setError(errorMsg);
      console.error("Initialize error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Fetch user error:", err);
      localStorage.removeItem("token");
      router.push("/login");
      throw err;
    }
  };

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.items || res.data);
    } catch (err) {
      console.error("Fetch items error:", err);
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await fetchItems();
    } catch (err: any) {
      console.error("Refresh error:", err);
    }
  };

  // Calculate statistics
  const totalItems = items.length;
  const lowStockCount = items.filter(item => item.stock <= 5).length;
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
  const avgStock = totalItems > 0 ? Math.round(totalStock / totalItems) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} userRole={user?.role} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Profile Card */}
        <Card className="mb-6 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Welcome back, {user?.name}!</CardTitle>
                <CardDescription>
                  Here's your inventory overview
                </CardDescription>
              </div>
              <Badge variant={user?.role === "admin" ? "destructive" : "default"}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Items */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Total Items
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-gray-500 mt-1">in inventory</p>
            </CardContent>
          </Card>

          {/* Total Stock */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Total Stock
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-gray-500 mt-1">units available</p>
            </CardContent>
          </Card>

          {/* Average Stock */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Avg Stock
                <Activity className="w-4 h-4 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgStock}</div>
              <p className="text-xs text-gray-500 mt-1">per item</p>
            </CardContent>
          </Card>

          {/* Low Stock */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Low Stock
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <p className="text-xs text-gray-500 mt-1">&le; 5 units</p>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Manage and track all inventory items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemTable
              items={items}
              onDelete={user?.role === "admin" ? handleDelete : undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}