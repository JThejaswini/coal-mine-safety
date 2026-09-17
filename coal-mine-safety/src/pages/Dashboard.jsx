import { useEffect, useState } from 'react'

function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Failed to load dashboard'
          )
        }

        setData(result)
      } catch (error) {
        console.error(error)
        setError(error.message)
      }
    }

    fetchDashboard()
  }, [token])

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  const stats = [
    {
      label: 'Inspections',
      value: data.inspections,
      description: 'Safety inspections recorded',
    },
    {
      label: 'Open Violations',
      value: data.openViolations,
      description: 'Issues requiring attention',
    },
    {
      label: 'High-Risk Issues',
      value: data.highRiskIssues,
      description: 'Unresolved high-risk findings',
    },
    {
      label: 'Pending Actions',
      value: data.pendingActions,
      description: 'Corrective actions pending',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Mine Operations
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Safety Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Real-time overview of mine safety, compliance and corrective actions
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Compliance + Resolution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Compliance Score
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current overall safety compliance
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                data.compliance >= 80
                  ? 'bg-green-100 text-green-700'
                  : data.compliance >= 50
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {data.compliance >= 80
                ? 'Good'
                : data.compliance >= 50
                  ? 'Needs Attention'
                  : 'Critical'}
            </span>
          </div>

          <p className="mt-6 text-5xl font-bold text-slate-900">
            {data.compliance}%
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${data.compliance}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Based on resolved versus total recorded violations
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Violation Resolution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Safety issues successfully resolved
          </p>

          <p className="mt-6 text-5xl font-bold text-slate-900">
            {data.resolvedViolations}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${
                    data.inspections === 0
                      ? 0
                      : Math.min(
                          data.resolvedViolations /
                            Math.max(
                              data.openViolations +
                                data.resolvedViolations,
                              1
                            ),
                          1
                        ) * 100
                  }%`,
                }}
              />
            </div>

            <span className="text-sm font-medium text-green-600">
              Resolved
            </span>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Risk Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current unresolved safety risks
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
              <div>
                <p className="text-sm font-medium text-red-800">
                  High-Risk Issues
                </p>

                <p className="mt-1 text-xs text-red-600">
                  Immediate attention required
                </p>
              </div>

              <span className="text-2xl font-bold text-red-700">
                {data.highRiskIssues}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Open Violations
                </p>

                <p className="mt-1 text-xs text-orange-600">
                  Pending resolution
                </p>
              </div>

              <span className="text-2xl font-bold text-orange-700">
                {data.openViolations}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Pending Actions
                </p>

                <p className="mt-1 text-xs text-yellow-600">
                  Corrective action required
                </p>
              </div>

              <span className="text-2xl font-bold text-yellow-700">
                {data.pendingActions}
              </span>
            </div>
          </div>
        </div>

        {/* Violations by Zone */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Violations by Zone
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of recorded safety violations
          </p>

          <div className="mt-6 space-y-4">
            {data.violationsByZone.length === 0 ? (
              <p className="text-sm text-slate-500">
                No violation data available.
              </p>
            ) : (
              data.violationsByZone.map(
                (item) => (
                  <div key={item.zone}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.zone}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-700"
                        style={{
                          width: `${Math.min(
                            item.count * 20,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Monitoring System
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Centralized safety and compliance monitoring is active
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <span className="text-sm font-medium text-green-700">
              System Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard