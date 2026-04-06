"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import API from "@/services/api";
import Navbar from "@/components/Navbar";
import ItemTable from "@/components/ItemTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

type Item = {
  id: number;
  name: string;
  stock: number;
  description?: string;
  category_id?: number;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      Promise.all([checkAdmin(), fetchItems()]);
    }
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await API.get("/users/me");
      setIsAdmin(res.data.role === "admin");
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/items");
      setItems(res.data.items || res.data);
    } catch (err: any) {
      console.error("Fetch items error:", err);
      const errorMsg = err.response?.data?.error || "Failed to load items";
      setError(errorMsg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    // Refresh items after deletion
    fetchItems();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-gray-600">Loading items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Items Management</h1>
            <p className="text-gray-600 mt-1">Manage all inventory items</p>
          </div>
          {isAdmin && (
            <Link href="/items/create">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4" />
                Add New Item
              </Button>
            </Link>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No items found</p>
            <p className="text-gray-500 text-sm mt-1">Create your first item to get started</p>
          </div>
        ) : (
          <ItemTable items={items} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
