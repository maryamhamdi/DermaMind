"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem(
      "skinResult"
    );

    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-4xl font-bold">
        Skin Result
      </h1>

      <h2 className="text-3xl text-blue-500">
        {result?.skinType}
      </h2>

      <p>
        {result?.message}
      </p>
    </div>
  );
}