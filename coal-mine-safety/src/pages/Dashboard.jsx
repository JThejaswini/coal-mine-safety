import { useEffect, useState } from 'react'

function StatIcon({ type }) {
  const icons = {
    inspections: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    violations: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v5M12 17.5h.01" />
      </>
    ),
    risk: (
      <>
        <path d="M12 3 20 6v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3Z" />
        <path d="M12 8v5M12 16h.01" />
      </>
    ),
    actions: (
      <>
        <path d="M20 7 10 17l-5-5" />
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      {icons[type]}
    </svg>
  )
}

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
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-[#737d76]">
          Loading safety data...
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Inspections',
      value: data.inspections,
      description: 'Recorded inspections',
      type: 'inspections',
      tone: 'neutral',
    },
    {
      label: 'Open Violations',
      value: data.openViolations,
      description: 'Require resolution',
      type: 'violations',
      tone: 'amber',
    },
    {
      label: 'High-Risk Issues',
      value: data.highRiskIssues,
      description: 'Immediate attention',
      type: 'risk',
      tone: 'red',
    },
    {
      label: 'Pending Actions',
      value: data.pendingActions,
      description: 'Awaiting completion',
      type: 'actions',
      tone: 'blue',
    },
  ]

  const complianceStatus =
    data.compliance >= 80
      ? 'Good standing'
      : data.compliance >= 50
        ? 'Needs attention'
        : 'Critical attention'

  const resolutionTotal =
    data.openViolations +
    data.resolvedViolations

  const resolutionPercentage =
    resolutionTotal === 0
      ? 0
      : Math.min(
        data.resolvedViolations /
        resolutionTotal,
        1
      ) * 100

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Intro */}
      <section className="flex flex-col justify-between gap-5 border-b border-[#dfe3de] pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7650]">
              Mine-wide overview
            </span>
          </div>

          <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-[#202823]">
            Safety operations
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737d76]">
            Monitor inspections, violations, risk exposure and
            corrective activity across the mine.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#737d76]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live operational data
        </div>
      </section>

      {/* Key metrics */}
      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#dfe3de] bg-[#dfe3de] sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const toneClasses = {
            neutral: {
              icon: 'bg-[#edf0ed] text-[#4e5a52]',
              value: 'text-[#202823]',
            },
            amber: {
              icon: 'bg-[#f6eedc] text-[#a27629]',
              value: 'text-[#8a641f]',
            },
            red: {
              icon: 'bg-[#f8e7e5] text-[#b24d43]',
              value: 'text-[#a9443b]',
            },
            blue: {
              icon: 'bg-[#e7eef0] text-[#48656e]',
              value: 'text-[#405d65]',
            },
          }

          const tone = toneClasses[stat.tone]

          return (
            <div
              key={stat.label}
              className="bg-white p-5 transition hover:bg-[#fcfcfa]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${tone.icon}`}
                >
                  <StatIcon type={stat.type} />
                </div>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#9aa29d]">
                  KPI
                </span>
              </div>

              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#89928b]">
                {stat.label}
              </p>

              <p
                className={`mt-1 text-[30px] font-semibold tracking-[-0.035em] ${tone.value}`}
              >
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-[#8a938d]">
                {stat.description}
              </p>
            </div>
          )
        })}
      </section>

      {/* Main status row */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Compliance */}
        <div className="rounded-lg border border-[#dfe3de] bg-white p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938d]">
                Compliance position
              </p>

              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                Overall safety compliance
              </h3>

              <p className="mt-1 text-sm text-[#7a837d]">
                Calculated from recorded and resolved violations.
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${data.compliance >= 80
                  ? 'bg-emerald-50 text-emerald-700'
                  : data.compliance >= 50
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${data.compliance >= 80
                    ? 'bg-emerald-500'
                    : data.compliance >= 50
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
              />

              {complianceStatus}
            </span>
          </div>

          <div className="mt-8 flex items-end gap-3">
            <span className="text-[54px] font-semibold leading-none tracking-[-0.05em] text-[#202823]">
              {data.compliance}
            </span>

            <span className="mb-1.5 text-lg text-[#89928b]">
              %
            </span>
          </div>

          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-[#edf0ed]">
              <div
                className={`h-full rounded-full transition-all ${data.compliance >= 80
                    ? 'bg-[#5b8067]'
                    : data.compliance >= 50
                      ? 'bg-[#c4933b]'
                      : 'bg-[#b6534a]'
                  }`}
                style={{
                  width: `${Math.min(
                    Math.max(data.compliance, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-[#9aa29d]">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Resolution */}
        <div className="rounded-lg border border-[#dfe3de] bg-[#26312b] p-6 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Resolution activity
          </p>

          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
            Violations resolved
          </h3>

          <div className="mt-8 flex items-end justify-between gap-4">
            <span className="text-[50px] font-semibold leading-none tracking-[-0.05em]">
              {data.resolvedViolations}
            </span>

            <span className="mb-1 rounded-md bg-white/[0.08] px-2.5 py-1 text-[11px] text-white/60">
              {Math.round(resolutionPercentage)}% resolved
            </span>
          </div>

          <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#d6a84f]"
              style={{
                width: `${resolutionPercentage}%`,
              }}
            />
          </div>

          <div className="mt-4 flex justify-between text-[11px] text-white/40">
            <span>Total tracked</span>
            <span>{resolutionTotal}</span>
          </div>
        </div>
      </section>

      {/* Risk + zones */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Risk overview */}
        <div className="rounded-lg border border-[#dfe3de] bg-white p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938d]">
              Risk exposure
            </p>

            <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Current unresolved issues
            </h3>
          </div>

          <div className="mt-6 divide-y divide-[#edf0ed]">
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#b6534a]" />

                <div>
                  <p className="text-sm font-medium text-[#303a34]">
                    High-risk issues
                  </p>

                  <p className="mt-0.5 text-xs text-[#8a938d]">
                    Immediate attention required
                  </p>
                </div>
              </div>

              <span className="text-xl font-semibold text-[#a9443b]">
                {data.highRiskIssues}
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#c4933b]" />

                <div>
                  <p className="text-sm font-medium text-[#303a34]">
                    Open violations
                  </p>

                  <p className="mt-0.5 text-xs text-[#8a938d]">
                    Pending resolution
                  </p>
                </div>
              </div>

              <span className="text-xl font-semibold text-[#8a641f]">
                {data.openViolations}
              </span>
            </div>

            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#58727a]" />

                <div>
                  <p className="text-sm font-medium text-[#303a34]">
                    Pending actions
                  </p>

                  <p className="mt-0.5 text-xs text-[#8a938d]">
                    Corrective action required
                  </p>
                </div>
              </div>

              <span className="text-xl font-semibold text-[#4c6870]">
                {data.pendingActions}
              </span>
            </div>
          </div>
        </div>

        {/* Zones */}
        <div className="rounded-lg border border-[#dfe3de] bg-white p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938d]">
              Geographic exposure
            </p>

            <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Violations by zone
            </h3>

            <p className="mt-1 text-sm text-[#7a837d]">
              Distribution of recorded violations across operational areas.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            {data.violationsByZone.length === 0 ? (
              <p className="text-sm text-[#89928b]">
                No violation data available.
              </p>
            ) : (
              data.violationsByZone.map((item) => {
                const maxZoneCount = Math.max(
                  ...data.violationsByZone.map(
                    (zone) => zone.count
                  ),
                  1
                )

                const width =
                  (item.count / maxZoneCount) * 100

                return (
                  <div key={item.zone}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-[#4b554e]">
                        {item.zone}
                      </span>

                      <span className="text-xs font-semibold text-[#303a34]">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#edf0ed]">
                      <div
                        className="h-full rounded-full bg-[#59685e]"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* System status */}
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-[#dfe3de] bg-[#eef1ed] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-[#506359]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 3 20 6v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3Z" />
              <path d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#303a34]">
              Central monitoring system
            </p>

            <p className="mt-0.5 text-xs text-[#7a837d]">
              Safety and compliance monitoring services are active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-[#4e6c58]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          All services operational
        </div>
      </section>
    </div>
  )
}

export default Dashboard