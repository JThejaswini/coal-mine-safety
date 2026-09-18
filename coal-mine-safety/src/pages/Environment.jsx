import { useEffect, useState } from 'react'

function Metric({ label, value, detail, emphasis = 'normal' }) {
  const valueClass =
    emphasis === 'success'
      ? 'text-[#27734a]'
      : emphasis === 'attention'
        ? 'text-[#9b6f21]'
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

function StatusBadge({ status }) {
  const resolved = status === 'Resolved'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${resolved ? 'text-[#27734a]' : 'text-[#b04438]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${resolved ? 'bg-[#3b9a67]' : 'bg-[#c95b4e]'
          }`}
      />

      {status}
    </span>
  )
}

function SeverityBadge({ severity }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9b6f21]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

      {severity}
    </span>
  )
}

function Environment() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

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

  const complianceStatus =
    compliance >= 80
      ? 'Good'
      : compliance >= 50
        ? 'Needs Attention'
        : 'Critical'

  const complianceTone =
    compliance >= 80
      ? 'success'
      : compliance >= 50
        ? 'attention'
        : 'danger'

  const affectedZones = new Set(
    violations.map(
      (violation) => violation.zone
    )
  ).size

  if (loading) {
    return (
      <div className="min-h-[60vh]">
        <div className="border-b border-[#dfe3de] pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
            Governance
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#202823]">
            Environment
          </h1>

          <p className="mt-1 text-sm text-[#7a837d]">
            Loading environmental monitoring data...
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
              Governance / Environment
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Environment
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Monitor dust-related environmental issues
              and track their resolution across mine zones.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-[#d9ded9] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#3b9a67]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#59635d]">
              Environmental monitoring active
            </span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-4">
        <Metric
          label="Environmental compliance"
          value={`${compliance}%`}
          detail={complianceStatus}
          emphasis={
            complianceTone === 'danger'
              ? 'attention'
              : complianceTone
          }
        />

        <Metric
          label="Total issues"
          value={totalIssues}
          detail="Dust threshold violations"
        />

        <Metric
          label="Open issues"
          value={openIssues}
          detail="Require resolution"
          emphasis="attention"
        />

        <Metric
          label="Affected zones"
          value={affectedZones}
          detail="Zones with recorded issues"
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 border border-[#e2c3bf] bg-[#fbf5f4] px-4 py-3">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c95b4e]" />

          <div>
            <p className="text-xs font-semibold text-[#9f3d34]">
              Environmental data unavailable
            </p>

            <p className="mt-1 text-xs text-[#9f5b54]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Environmental status */}
      <section className="border-y border-[#dfe3de] bg-white">
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="border-b border-[#e3e6e3] px-5 py-6 lg:border-b-0 lg:border-r lg:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                  Environmental status
                </p>

                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                  Dust threshold compliance
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-[#7a837d]">
                  Based on recorded dust threshold violations
                  and their current resolution status.
                </p>
              </div>

              <span
                className={`w-fit border px-3 py-1.5 text-[11px] font-semibold ${complianceTone === 'success'
                    ? 'border-[#c7ddd0] bg-[#f2f8f4] text-[#27734a]'
                    : complianceTone === 'attention'
                      ? 'border-[#e5d6b5] bg-[#fcf8ef] text-[#9b6f21]'
                      : 'border-[#e2c3bf] bg-[#fbf5f4] text-[#b04438]'
                  }`}
              >
                {complianceStatus}
              </span>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-[#202823]">
                    {compliance}%
                  </span>

                  <span className="ml-2 text-xs text-[#7a837d]">
                    compliance
                  </span>
                </div>

                <span className="text-xs text-[#7a837d]">
                  {resolvedIssues} of {totalIssues}{' '}
                  resolved
                </span>
              </div>

              <div className="mt-4 h-3 w-full bg-[#e5e8e5]">
                <div
                  className={`h-full transition-all ${complianceTone === 'success'
                      ? 'bg-[#3b9a67]'
                      : complianceTone === 'attention'
                        ? 'bg-[#d6a84f]'
                        : 'bg-[#c95b4e]'
                    }`}
                  style={{
                    width: `${compliance}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-[#8a938d]">
                <span>0</span>
                <span>50</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f7f8f5] px-5 py-6 lg:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#858e88]">
              Environmental exposure
            </p>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Total dust issues
                </span>

                <span className="text-lg font-semibold text-[#202823]">
                  {totalIssues}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Open exposure
                </span>

                <span className="text-lg font-semibold text-[#9b6f21]">
                  {openIssues}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#69736c]">
                  Resolved
                </span>

                <span className="text-lg font-semibold text-[#27734a]">
                  {resolvedIssues}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental register */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Environmental register
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Environmental Violations
            </h2>
          </div>

          <p className="text-xs text-[#7a837d]">
            Dust threshold events
          </p>
        </div>

        <div className="overflow-hidden border-y border-[#dfe3de] bg-white">
          {violations.length === 0 ? (
            <div className="px-6 py-12">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#c7ddd0] bg-[#f2f8f4] text-[#27734a]">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#303a34]">
                    No environmental violations recorded
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                    Dust-related violations will appear here
                    when detected.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-left text-sm">
                <thead className="border-b border-[#dfe3de] bg-[#f6f7f4]">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      ID
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Zone
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Severity
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Status
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {violations.map(
                    (violation) => (
                      <tr
                        key={violation.id}
                        className="border-b border-[#edf0ed] last:border-b-0 hover:bg-[#fafbf9]"
                      >
                        <td className="px-5 py-4">
                          <span className="font-semibold text-[#59635d]">
                            {violation.violation_code}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-xs font-medium text-[#59635d]">
                          {violation.zone}
                        </td>

                        <td className="px-5 py-4">
                          <SeverityBadge
                            severity={
                              violation.severity
                            }
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              violation.status
                            }
                          />
                        </td>

                        <td className="px-5 py-4">
                          <span className="border border-[#dfe3de] bg-[#f6f7f4] px-2 py-1 text-[10px] font-medium text-[#68726b]">
                            {violation.source}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-[#dfe3de] pt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Monitoring scope
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              This register currently tracks recorded
              Dust Threshold Exceeded violations.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Resolution
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Environmental compliance increases as recorded
              dust issues are resolved.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Safety Command
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Environmental status forms part of the mine-wide
              governance and compliance view.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Environment