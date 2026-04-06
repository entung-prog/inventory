"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, User, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import API from "@/services/api";

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await API.get("/users/me");
      setUserData(res.data);
    } catch (err) {
      console.error("Fetch user error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    router.push("/login");
  };

  const displayName = userName || userData?.name;
  const displayRole = userRole || userData?.role;
  const isAdmin = displayRole === "admin";

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Package className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Inventory</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link href="/items">
              <Button variant="ghost" size="sm">Items</Button>
            </Link>
            <Link href="/categories">
              <Button variant="ghost" size="sm">Categories</Button>
            </Link>
            {isAdmin && (
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Users
                </Button>
              </Link>
            )}
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            {displayName && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="text-gray-600 w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  {displayRole && (
                    <Badge variant={isAdmin ? "destructive" : "default"} className="text-xs mt-1">
                      {displayRole.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Logout Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
}