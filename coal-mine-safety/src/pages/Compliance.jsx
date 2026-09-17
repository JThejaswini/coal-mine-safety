import { useEffect, useState } from 'react'

function Compliance() {
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
            'Failed to load compliance data'
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

  const resolvedViolations =
    violations.filter(
      (violation) =>
        violation.status === 'Resolved'
    ).length

  const openViolations =
    violations.filter(
      (violation) =>
        violation.status !== 'Resolved'
    ).length

  const highRiskViolations =
    violations.filter(
      (violation) =>
        violation.severity === 'High' &&
        violation.status !== 'Resolved'
    ).length

  const compliancePercentage =
    totalViolations === 0
      ? 100
      : Math.round(
          (resolvedViolations /
            totalViolations) *
            100
        )

  const complianceStatus =
    compliancePercentage >= 80
      ? 'Good'
      : compliancePercentage >= 50
        ? 'Needs Attention'
        : 'Critical'

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading compliance data...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Compliance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor mine safety and regulatory compliance
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Overall Compliance
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {compliancePercentage}%
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

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {openViolations}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            High-Risk Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {highRiskViolations}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Compliance Score
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Based on recorded safety violations and their resolution status
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              compliancePercentage >= 80
                ? 'bg-green-100 text-green-700'
                : compliancePercentage >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {complianceStatus}
          </span>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${compliancePercentage}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm text-slate-500">
          <span>
            {resolvedViolations} of{' '}
            {totalViolations} violations resolved
          </span>

          <span>
            {compliancePercentage}%
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Compliance Issues
          </h2>
        </div>

        {violations.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No compliance issues recorded.
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

                      <td className="px-6 py-4 text-slate-700">
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

export default Compliance