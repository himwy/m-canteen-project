"use client"

import Link from "next/link"
import { useState } from "react"

export default function AdminAPIPage() {
  const [apiToken, setApiToken] = useState("hsu_sk_1234567890abcdef");
  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);

  const copyToken = () => {
    navigator.clipboard.writeText(apiToken);
    alert("API token copied to clipboard!");
  };

  const testAPI = async (endpoint: string) => {
    setTesting(true);
    setTestResult("");
    
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
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
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-neutral-900 mb-1">API Access</h1>
              <p className="text-neutral-500 text-sm">Secure student data API</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">API Token</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Use this secure token to authenticate API requests. Keep it confidential.
          </p>

          <div className="space-y-3">
            <label htmlFor="api-token" className="text-sm text-neutral-700 font-medium">
              Your API Token
            </label>
            <div className="flex gap-2">
              <input
                id="api-token"
                type={showToken ? "text" : "password"}
                value={apiToken}
                readOnly
                className="w-full font-mono text-sm border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none"
              />
              <button 
                onClick={() => setShowToken(!showToken)}
                className="border border-neutral-200 rounded-xl bg-transparent px-3 py-2 hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button 
                onClick={copyToken}
                className="border border-neutral-200 rounded-xl bg-transparent px-3 py-2 hover:bg-neutral-50 transition-colors text-sm font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              Never share your API token publicly or commit it to version control
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">API Endpoints</h2>

          <div className="space-y-6">
            {/* Get Students List */}
            <div className="border-l-4 border-[#86a349] pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 font-mono">GET</span>
                <code className="text-sm font-mono text-neutral-700">/api/students</code>
              </div>
              <p className="text-sm text-neutral-600 mb-3">
                Returns a list of all HSU students using the app with usage statistics
              </p>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="text-xs text-neutral-500 mb-2 font-medium">Request Headers:</div>
                <code className="text-xs font-mono block text-neutral-800">Authorization: Bearer YOUR_API_TOKEN</code>
              </div>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 mt-3">
                <div className="text-xs text-neutral-500 mb-2 font-medium">Response (JSON):</div>
                <pre className="text-xs font-mono text-neutral-800 overflow-x-auto">
                  {`{
  "students": [
    {
      "id": "s123456",
      "name": "John Doe",
      "email": "john@example.com",
      "programme": "BA-AHCC",
      "yearOfEntrance": 2025,
      "lastLogin": "2025-01-15T10:30:00Z",
      "totalOrders": 12
    }
  ],
  "total": 156,
  "page": 1
}`}
                </pre>
              </div>

              <button
                onClick={() => testAPI('/api/students')}
                disabled={testing}
                className="mt-3 bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test API'}
              </button>
            </div>

            {/* Get Student Details */}
            <div className="border-l-4 border-blue-400 pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">GET</span>
                <code className="text-sm font-mono text-neutral-700">/api/students/:id</code>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Get detailed information about a specific student</p>

              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="text-xs text-neutral-500 mb-2 font-medium">Example Request:</div>
                <code className="text-xs font-mono block text-neutral-800">GET /api/students/s123456</code>
              </div>
            </div>

            {/* Get Usage Stats */}
            <div className="border-l-4 border-purple-400 pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 font-mono">GET</span>
                <code className="text-sm font-mono text-neutral-700">/api/stats</code>
              </div>
              <p className="text-sm text-neutral-600 mb-3">Get overall usage statistics for the app</p>

              <button
                onClick={() => testAPI('/api/stats')}
                disabled={testing}
                className="mt-3 bg-[#86a349] hover:bg-[#748f3e] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test API'}
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">API Response</h2>
            <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">{testResult}</pre>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Try it in your terminal</h2>
          
          <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
{`# Get all students
curl -H "Authorization: Bearer ${apiToken}" \\
  http://localhost:3000/api/students

# Get specific student
curl -H "Authorization: Bearer ${apiToken}" \\
  http://localhost:3000/api/students/YOUR_STUDENT_ID

# Get usage statistics
curl -H "Authorization: Bearer ${apiToken}" \\
  http://localhost:3000/api/stats`}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">JavaScript Usage Example</h2>

          <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
{`// Example: Fetch students list using JavaScript
const response = await fetch('/api/students', {
  headers: {
    'Authorization': 'Bearer ${apiToken}'
  }
});

const data = await response.json();
console.log(data.students);`}
            </pre>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Security & Compliance</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• All student data is stored securely and encrypted</li>
                <li>• API access is restricted to authorized HSU personnel only</li>
                <li>• Complies with data protection regulations and PDPO</li>
                <li>• All API requests are logged for security audit purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
