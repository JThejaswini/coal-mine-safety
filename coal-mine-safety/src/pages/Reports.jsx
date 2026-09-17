import { useEffect, useState } from 'react'

function Reports() {
  const [violations, setViolations] = useState([])
  const [inspections, setInspections] = useState([])
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          violationsResponse,
          inspectionsResponse,
          actionsResponse,
        ] = await Promise.all([
          fetch(
            'http://localhost:5000/api/violations',
            { headers }
          ),
          fetch(
            'http://localhost:5000/api/inspections',
            { headers }
          ),
          fetch(
            'http://localhost:5000/api/corrective-actions',
            { headers }
          ),
        ])

        const violationsData =
          await violationsResponse.json()

        const inspectionsData =
          await inspectionsResponse.json()

        const actionsData =
          await actionsResponse.json()

        if (
          !violationsResponse.ok ||
          !inspectionsResponse.ok ||
          !actionsResponse.ok
        ) {
          throw new Error(
            'Failed to load report data'
          )
        }

        setViolations(violationsData)
        setInspections(inspectionsData)
        setActions(actionsData)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const resolved = violations.filter(
    (v) => v.status === 'Resolved'
  ).length

  const open = violations.filter(
    (v) => v.status !== 'Resolved'
  ).length

  const highRisk = violations.filter(
    (v) =>
      v.severity === 'High' &&
      v.status !== 'Resolved'
  ).length

  const completedActions = actions.filter(
    (action) =>
      action.status === 'Completed'
  ).length

  const generateReport = () => {
    const report = `
COAL MINE SAFETY REPORT
=======================

Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Inspections: ${inspections.length}
Total Violations: ${violations.length}
Open Violations: ${open}
Resolved Violations: ${resolved}
High-Risk Issues: ${highRisk}
Corrective Actions: ${actions.length}
Completed Actions: ${completedActions}

VIOLATIONS
----------
${violations
  .map(
    (v) =>
      `${v.violation_code} | ${v.type} | ${v.zone} | ${v.severity} | ${v.status} | ${v.source}`
  )
  .join('\n')}

END OF REPORT
`

    const blob = new Blob([report], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'coal-mine-safety-report.txt'
    link.click()

    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading report data...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Generate mine safety and compliance reports
          </p>
        </div>

        <button
          onClick={generateReport}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Generate Report
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Inspections
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {inspections.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Violations
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {violations.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Corrective Actions
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {actions.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Violation Summary
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Open
              </span>

              <span className="font-semibold text-orange-600">
                {open}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Resolved
              </span>

              <span className="font-semibold text-green-600">
                {resolved}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                High Risk
              </span>

              <span className="font-semibold text-red-600">
                {highRisk}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Corrective Action Summary
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Total Actions
              </span>

              <span className="font-semibold text-slate-900">
                {actions.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Completed
              </span>

              <span className="font-semibold text-green-600">
                {completedActions}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Pending
              </span>

              <span className="font-semibold text-orange-600">
                {actions.length -
                  completedActions}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Report Contents
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          The generated report contains current inspection,
          violation, risk and corrective-action information
          from the system.
        </p>
      </div>
    </div>
  )
}

export default Reports