"use client";

import { useState } from "react";
import { apiCreatePlan } from "@/lib/api";

export default function ApiProtectedTestPage() {
  const [name, setName] = useState("My Plan");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleCreate() {
    setError("");
    setResult("");
    try {
      const created = await apiCreatePlan(name);
      setResult(JSON.stringify(created));
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Protected API Test</h1>
      <div className="flex items-center gap-2">
        <input className="border px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="px-3 py-1 bg-black text-white" onClick={handleCreate}>Create Plan</button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {result && <pre className="text-sm bg-gray-100 p-3">{result}</pre>}
      <div className="text-sm text-gray-600">Note: login/register first so tokens are in localStorage.</div>
    </div>
  );
}


