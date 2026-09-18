import { useEffect, useState } from 'react'

function Metric({
  label,
  value,
  detail,
  emphasis = 'normal',
}) {
  const valueClass =
    emphasis === 'success'
      ? 'text-[#27734a]'
      : emphasis === 'attention'
        ? 'text-[#9b6f21]'
        : emphasis === 'danger'
          ? 'text-[#b04438]'
          : 'text-[#202823]'

  return (
    <div className="border-l border-[#d8ddd8] pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858e88]">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-semibold tracking-[-0.03em] ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-[#7a837d]">
        {detail}
      </p>
    </div>
  )
}

function ReportRow({
  label,
  value,
  emphasis = 'normal',
}) {
  const valueClass =
    emphasis === 'success'
      ? 'text-[#27734a]'
      : emphasis === 'attention'
        ? 'text-[#9b6f21]'
        : emphasis === 'danger'
          ? 'text-[#b04438]'
          : 'text-[#303a34]'

  return (
    <div className="flex items-center justify-between border-b border-[#e4e7e4] py-3 last:border-b-0">
      <span className="text-xs text-[#69736c]">
        {label}
      </span>

      <span
        className={`text-sm font-semibold ${valueClass}`}
      >
        {value}
      </span>
    </div>
  )
}

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

  const pendingActions =
    actions.length - completedActions

  const resolutionRate =
    violations.length === 0
      ? 100
      : Math.round(
        (resolved / violations.length) * 100
      )

  const actionCompletionRate =
    actions.length === 0
      ? 100
      : Math.round(
        (completedActions / actions.length) *
        100
      )

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
      <div className="min-h-[60vh]">
        <div className="border-b border-[#dfe3de] pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
            Governance
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#202823]">
            Reports
          </h1>

          <p className="mt-1 text-sm text-[#7a837d]">
            Loading report data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="border-b border-[#dfe3de] pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
              Governance / Reports
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Generate a consolidated snapshot of mine
              inspections, violations, risks, and corrective
              actions.
            </p>
          </div>

          <button
            type="button"
            onClick={generateReport}
            className="flex items-center justify-center gap-2 border border-[#334039] bg-[#334039] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#202823]"
          >
            <span className="text-sm">↓</span>
            Generate Report
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 border border-[#e2c3bf] bg-[#fbf5f4] px-4 py-3">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c95b4e]" />

          <div>
            <p className="text-xs font-semibold text-[#9f3d34]">
              Report data unavailable
            </p>

            <p className="mt-1 text-xs text-[#9f5b54]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Overview metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-4">
        <Metric
          label="Inspections"
          value={inspections.length}
          detail="Recorded inspections"
        />

        <Metric
          label="Violations"
          value={violations.length}
          detail={`${open} currently open`}
          emphasis={
            open > 0 ? 'attention' : 'success'
          }
        />

        <Metric
          label="High-risk issues"
          value={highRisk}
          detail="Unresolved high severity"
          emphasis={
            highRisk > 0 ? 'danger' : 'success'
          }
        />

        <Metric
          label="Corrective actions"
          value={actions.length}
          detail={`${completedActions} completed`}
        />
      </section>

      {/* Operational position */}
      <section className="border-y border-[#dfe3de] bg-white">
        <div className="grid lg:grid-cols-2">
          {/* Violations */}
          <div className="border-b border-[#e3e6e3] px-5 py-6 lg:border-b-0 lg:border-r lg:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                  Incident position
                </p>

                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                  Violation Summary
                </h2>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[#202823]">
                  {resolutionRate}%
                </p>

                <p className="text-[10px] uppercase tracking-[0.1em] text-[#858e88]">
                  resolution rate
                </p>
              </div>
            </div>

            <div className="mt-5">
              <ReportRow
                label="Open violations"
                value={open}
                emphasis={
                  open > 0
                    ? 'attention'
                    : 'success'
                }
              />

              <ReportRow
                label="Resolved violations"
                value={resolved}
                emphasis="success"
              />

              <ReportRow
                label="High-risk issues"
                value={highRisk}
                emphasis={
                  highRisk > 0
                    ? 'danger'
                    : 'success'
                }
              />

              <ReportRow
                label="Total violations"
                value={violations.length}
              />
            </div>

            <div className="mt-5 h-2 bg-[#e5e8e5]">
              <div
                className={`h-full transition-all ${resolutionRate >= 80
                    ? 'bg-[#3b9a67]'
                    : resolutionRate >= 50
                      ? 'bg-[#d6a84f]'
                      : 'bg-[#c95b4e]'
                  }`}
                style={{
                  width: `${resolutionRate}%`,
                }}
              />
            </div>
          </div>

          {/* Corrective actions */}
          <div className="px-5 py-6 lg:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                  Response position
                </p>

                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                  Corrective Action Summary
                </h2>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[#202823]">
                  {actionCompletionRate}%
                </p>

                <p className="text-[10px] uppercase tracking-[0.1em] text-[#858e88]">
                  completion rate
                </p>
              </div>
            </div>

            <div className="mt-5">
              <ReportRow
                label="Total actions"
                value={actions.length}
              />

              <ReportRow
                label="Completed"
                value={completedActions}
                emphasis="success"
              />

              <ReportRow
                label="Pending"
                value={pendingActions}
                emphasis={
                  pendingActions > 0
                    ? 'attention'
                    : 'success'
                }
              />
            </div>

            <div className="mt-5 h-2 bg-[#e5e8e5]">
              <div
                className="h-full bg-[#3b9a67] transition-all"
                style={{
                  width: `${actionCompletionRate}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Report contents */}
      <section>
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
            Report definition
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
            Report Contents
          </h2>
        </div>

        <div className="border-y border-[#dfe3de] bg-white">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-b border-[#e3e6e3] px-5 py-5 sm:border-r lg:border-b-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858e88]">
                01 / Inspections
              </p>

              <p className="mt-2 text-sm font-semibold text-[#303a34]">
                {inspections.length} records
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                Recorded field safety inspections.
              </p>
            </div>

            <div className="border-b border-[#e3e6e3] px-5 py-5 lg:border-b-0 lg:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858e88]">
                02 / Violations
              </p>

              <p className="mt-2 text-sm font-semibold text-[#303a34]">
                {violations.length} records
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                Incident type, zone, severity, status, and source.
              </p>
            </div>

            <div className="border-b border-[#e3e6e3] px-5 py-5 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858e88]">
                03 / Risk
              </p>

              <p className="mt-2 text-sm font-semibold text-[#303a34]">
                {highRisk} high-risk issues
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                Unresolved high-severity violations.
              </p>
            </div>

            <div className="px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858e88]">
                04 / Response
              </p>

              <p className="mt-2 text-sm font-semibold text-[#303a34]">
                {actions.length} actions
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                Corrective actions and completion status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report workflow */}
      <section className="border-t border-[#dfe3de] pt-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Reporting workflow
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              The generated text report consolidates current
              operational records into a portable safety summary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#69736c]">
            <span className="border border-[#dfe3de] bg-[#f7f8f5] px-3 py-2">
              Inspect
            </span>

            <span className="text-[#a5ada7]">→</span>

            <span className="border border-[#dfe3de] bg-[#f7f8f5] px-3 py-2">
              Detect
            </span>

            <span className="text-[#a5ada7]">→</span>

            <span className="border border-[#dfe3de] bg-[#f7f8f5] px-3 py-2">
              Correct
            </span>

            <span className="text-[#a5ada7]">→</span>

            <span className="border border-[#dfe3de] bg-[#f7f8f5] px-3 py-2">
              Report
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reports