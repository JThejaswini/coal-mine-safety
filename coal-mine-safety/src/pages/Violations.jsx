import { useEffect, useState } from 'react'

function Violations() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchViolations = async () => {
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
            'Failed to load violations'
        )
      }

      setViolations(data)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchViolations()
  }, [])

  const totalViolations = violations.length

  const openViolations = violations.filter(
    (violation) =>
      violation.status !== 'Resolved'
  ).length

  const highRiskViolations =
    violations.filter(
      (violation) =>
        violation.severity === 'High' &&
        violation.status !== 'Resolved'
    ).length

  const resolvedViolations =
    violations.filter(
      (violation) =>
        violation.status === 'Resolved'
    ).length

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading violations...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Violations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor and track recorded mine safety violations
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Violations
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalViolations}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {openViolations}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            High Risk
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {highRiskViolations}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Resolved
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {resolvedViolations}
          </p>
        </div>
      </div>

      {/* Violations Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Violation Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            All safety violations recorded by the system
          </p>
        </div>

        {violations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-green-700">
              No violations recorded
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Detected and manually recorded violations will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Violation
                  </th>

                  <th className="px-6 py-4">
                    Zone
                  </th>

                  <th className="px-6 py-4">
                    Severity
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Source
                  </th>

                  <th className="px-6 py-4">
                    Detected At
                  </th>
                </tr>
              </thead>

              <tbody>
                {violations.map(
                  (violation) => (
                    <tr
                      key={violation.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {violation.violation_code}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {violation.type}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {violation.zone}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            violation.severity ===
                            'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {violation.severity}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            violation.status ===
                            'Resolved'
                              ? 'bg-green-100 text-green-700'
                              : violation.status ===
                                  'Under Review'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {violation.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {violation.source}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {new Date(
                          violation.detected_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Violations