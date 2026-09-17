import { useEffect, useState } from 'react'

function Environment() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        'http://localhost:5000/api/violations',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load environment data'
        )
      }

      setViolations(
        data.filter(
          (violation) =>
            violation.type ===
            'Dust Threshold Exceeded'
        )
      )
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalIssues = violations.length

  const resolvedIssues =
    violations.filter(
      (violation) =>
        violation.status === 'Resolved'
    ).length

  const openIssues =
    violations.filter(
      (violation) =>
        violation.status !== 'Resolved'
    ).length

  const compliance =
    totalIssues === 0
      ? 100
      : Math.round(
          (resolvedIssues / totalIssues) * 100
        )

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading environmental data...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Environment
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor environmental compliance and dust-related risks
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Environmental Compliance
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {compliance}%
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalIssues}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Environmental Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {openIssues}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Environmental Status
        </h2>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${compliance}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Based on recorded dust threshold violations and their resolution status.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Environmental Violations
          </h2>
        </div>

        {violations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-green-700">
              No environmental violations recorded
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Dust-related violations will appear here when detected.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                </tr>
              </thead>

              <tbody>
                {violations.map((violation) => (
                  <tr
                    key={violation.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {violation.violation_code}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {violation.zone}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                        {violation.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          violation.status ===
                          'Resolved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {violation.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {violation.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Environment