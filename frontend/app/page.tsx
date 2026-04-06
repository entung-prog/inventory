"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ItemTable from "@/components/ItemTable";

type Item = {
  id: number;
  name: string;
  stock: number;
};


export default function HomePage() {
  const router = useRouter();

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
  } else {
    fetchItems();
  }
}, []);
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/items/${id}`);
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <Navbar />
      <ItemTable items={items} onDelete={handleDelete} />
    </div>
  );
} 