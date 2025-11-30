"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminAPIPage() {
  const [apiToken, setApiToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);

  const copyToken = () => {
    if (!apiToken) {
      alert("Please enter your API token first");
      return;
    }
    navigator.clipboard.writeText(apiToken);
    alert("Token copied!");
  };

  const testAPI = async () => {
    if (!apiToken) {
      alert("Please enter your API token first");
      return;
    }
    
    setTesting(true);
    setTestResult("");

    try {
      const response = await fetch("/api/students", {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-5 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-neutral-500 hover:text-neutral-900 mb-2 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
                Student Data API
              </h1>
              <p className="text-neutral-500 text-sm">
                Protected API for student usage statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            API Token
          </h2>
          <p className="text-sm text-neutral-600 mb-4">
            Enter your API token below. Contact HSU IT Department to obtain your secure token.
          </p>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type={showToken ? "text" : "password"}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter your API token..."
                className="flex-1 font-mono text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#86a349]"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="border border-neutral-200 rounded-lg px-3 py-2 hover:bg-neutral-50"
              >
                {showToken ? "Hide" : "Show"}
              </button>
              <button
                onClick={copyToken}
                className="border border-neutral-200 rounded-lg px-3 py-2 hover:bg-neutral-50"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            API Endpoint
          </h2>

          <div className="border-l-4 border-[#86a349] pl-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-mono bg-green-50 text-green-700 border border-green-200">
                GET
              </span>
              <code className="text-sm font-mono">/api/students</code>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Returns list of students with usage statistics
            </p>

            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 mb-3">
              <div className="text-xs text-neutral-500 mb-1">Request:</div>
              <code className="text-xs font-mono block">
                Authorization: Bearer YOUR_API_TOKEN
              </code>
            </div>

            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <div className="text-xs text-neutral-500 mb-1">Response (JSON):</div>
              <pre className="text-xs font-mono overflow-x-auto">
{`{
  "students": [
    {
      "studentId": "s123456",
      "name": "John Doe",
      "lastLogin": "2025-11-30T10:30:00Z",
      "totalOrders": 5
    }
  ]
}`}
              </pre>
            </div>
          </div>

          <button
            onClick={testAPI}
            disabled={testing}
            className="bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {testing ? "Testing..." : "Test API"}
          </button>
        </div>

        {testResult && (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Response
            </h2>
            <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                {testResult}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Usage Example
          </h2>

          <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
{`curl -H "Authorization: Bearer YOUR_API_TOKEN" \\
  https://your-domain.com/api/students`}
            </pre>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Security:</strong> Keep your API token confidential. The API is protected and requires authentication.
          </p>
        </div>
      </div>
    </main>
  );
}
