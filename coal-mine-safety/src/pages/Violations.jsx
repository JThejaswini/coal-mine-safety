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
      setError('')
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

  const resolutionRate =
    totalViolations > 0
      ? Math.round(
        (resolvedViolations /
          totalViolations) *
        100
      )
      : 0

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#dfe3de] border-t-[#9b6f21]" />

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#858e88]">
            Loading violation records
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 border-b border-[#d9ddd8] pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b6f21]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />
            Safety incident register
          </div>

          <h2 className="text-[28px] font-semibold tracking-[-0.035em] text-[#202823] sm:text-[32px]">
            Violations
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7872]">
            Central record of detected and manually logged
            safety non-conformances across the mine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-[#dfe3de] bg-white px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#89918c]">
              Active register
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-[#303a34]">
                Live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="border-l-4 border-red-500 bg-[#fff7f5] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
            Data retrieval error
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Operational summary */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b938d]">
              Operational summary
            </p>

            <p className="mt-1 text-xs text-[#737c76]">
              Current violation exposure
            </p>
          </div>

          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#a0a7a2]">
            Mine-wide
          </span>
        </div>

        <div className="grid grid-cols-1 border border-[#dfe3de] bg-white sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total violations"
            value={totalViolations}
            detail="All recorded incidents"
            numberClass="text-[#202823]"
          />

          <Metric
            label="Open"
            value={openViolations}
            detail="Require follow-up"
            numberClass="text-[#a66d16]"
            bordered
          />

          <Metric
            label="High risk"
            value={highRiskViolations}
            detail="Unresolved high severity"
            numberClass="text-[#b13d32]"
            bordered
          />

          <Metric
            label="Resolved"
            value={resolvedViolations}
            detail={`${resolutionRate}% resolution rate`}
            numberClass="text-[#3f7354]"
            bordered
          />
        </div>
      </section>

      {/* Risk strip */}
      <section className="grid grid-cols-1 gap-px border border-[#dfe3de] bg-[#dfe3de] md:grid-cols-3">
        <RiskStrip
          label="Open exposure"
          value={openViolations}
          description="Violations awaiting closure"
          tone="amber"
        />

        <RiskStrip
          label="High severity"
          value={highRiskViolations}
          description="Priority safety concerns"
          tone="red"
        />

        <RiskStrip
          label="Resolution progress"
          value={`${resolutionRate}%`}
          description="Share of recorded cases resolved"
          tone="green"
        />
      </section>

      {/* Records */}
      <section className="border border-[#dfe3de] bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-[#dfe3de] px-5 py-5 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#d6a84f]" />

              <h3 className="text-sm font-semibold text-[#27312b]">
                Violation register
              </h3>
            </div>

            <p className="mt-1.5 text-xs text-[#7d8680]">
              Recorded incidents and their current response status
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8a938d]">
            <span>
              {violations.length} record
              {violations.length !== 1 ? 's' : ''}
            </span>

            <span className="text-[#c1c6c2]">•</span>

            <span>System recorded</span>
          </div>
        </div>

        {violations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#dfe3de] bg-[#f6f7f4]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>

            <p className="mt-5 text-sm font-semibold text-[#354039]">
              No violations recorded
            </p>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#858d88]">
              Detected and manually recorded safety violations
              will appear in this register.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left">
              <thead>
                <tr className="border-b border-[#dfe3de] bg-[#f7f8f5]">
                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Code
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Violation
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Zone
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Severity
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Source
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Detected
                  </th>
                </tr>
              </thead>

              <tbody>
                {violations.map(
                  (violation, index) => (
                    <tr
                      key={violation.id}
                      className={`border-b border-[#ecefeb] transition hover:bg-[#fafbf8] ${index % 2 === 1
                          ? 'bg-[#fcfcfa]'
                          : 'bg-white'
                        }`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-[11px] font-semibold text-[#5d6861]">
                          {violation.violation_code}
                        </span>
                      </td>

                      <td className="max-w-[260px] px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${violation.severity ===
                                'High'
                                ? 'bg-red-500'
                                : 'bg-[#d6a84f]'
                              }`}
                          />

                          <span className="text-xs font-semibold leading-5 text-[#354039]">
                            {violation.type}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-[#68726c]">
                          {violation.zone}
                        </span>
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
                        <span className="inline-flex items-center border border-[#e0e4df] bg-[#f8f9f7] px-2.5 py-1 text-[10px] font-medium text-[#68726c]">
                          {violation.source}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="text-xs font-medium text-[#4a554e]">
                            {new Date(
                              violation.detected_at
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#929a95]">
                            {new Date(
                              violation.detected_at
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Workflow footer */}
      <section className="border border-[#303a34] bg-[#202823] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6a84f]">
                Safety response workflow
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#b8c0ba]">
              Recorded violations feed the corrective-action and
              re-inspection workflow for closure.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.12em] text-[#7f8982]">
            <span>Detect</span>
            <span className="text-[#4f5b53]">→</span>
            <span>Assign</span>
            <span className="text-[#4f5b53]">→</span>
            <span>Correct</span>
            <span className="text-[#4f5b53]">→</span>
            <span>Re-inspect</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
  numberClass,
  bordered = false,
}) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${bordered
          ? 'border-t border-[#e2e5e1] sm:border-l sm:border-t-0'
          : ''
        }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#89918c]">
        {label}
      </p>

      <p
        className={`mt-3 text-[30px] font-semibold tracking-[-0.04em] ${numberClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#919994]">
        {detail}
      </p>
    </div>
  )
}

function RiskStrip({
  label,
  value,
  description,
  tone,
}) {
  const toneClasses = {
    amber: {
      dot: 'bg-[#d6a84f]',
      value: 'text-[#9b6f21]',
    },
    red: {
      dot: 'bg-red-500',
      value: 'text-[#b13d32]',
    },
    green: {
      dot: 'bg-emerald-500',
      value: 'text-[#3f7354]',
    },
  }

  const currentTone =
    toneClasses[tone]

  return (
    <div className="bg-white px-5 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${currentTone.dot}`}
          />

          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
            {label}
          </p>
        </div>

        <span
          className={`text-sm font-semibold ${currentTone.value}`}
        >
          {value}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-[#929a95]">
        {description}
      </p>
    </div>
  )
}

function SeverityBadge({ severity }) {
  const isHigh = severity === 'High'

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${isHigh
          ? 'border-red-200 bg-[#fff5f3] text-[#b13d32]'
          : 'border-[#ead9ad] bg-[#fffbef] text-[#9b6f21]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isHigh
            ? 'bg-red-500'
            : 'bg-[#d6a84f]'
          }`}
      />

      {severity}
    </span>
  )
}

function StatusBadge({ status }) {
  const styles =
    status === 'Resolved'
      ? 'border-emerald-200 bg-[#f3faf5] text-[#3f7354]'
      : status === 'Under Review'
        ? 'border-blue-200 bg-[#f3f7fc] text-[#416b91]'
        : 'border-orange-200 bg-[#fff8ef] text-[#a66d16]'

  const dot =
    status === 'Resolved'
      ? 'bg-emerald-500'
      : status === 'Under Review'
        ? 'bg-blue-500'
        : 'bg-orange-500'

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] ${styles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dot}`}
      />

      {status}
    </span>
  )
}

export default Violations