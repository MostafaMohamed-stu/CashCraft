"use client";

import { useEffect, useState } from "react";
import { apiGetPlans } from "@/lib/api";

export default function ApiTestPage() {
  const [status, setStatus] = useState("Loading...");
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    apiGetPlans()
      .then((data) => {
        setPlans(data);
        setStatus("OK");
      })
      .catch((err) => setStatus(`Error: ${err.message}`));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">API Test</h1>
      <div className="mb-2">Status: {status}</div>
      <pre className="text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded">
        {JSON.stringify(plans, null, 2)}
      </pre>
    </div>
  );
}


