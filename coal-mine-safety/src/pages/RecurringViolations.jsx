import { useEffect, useState } from 'react'

function Metric({ label, value, detail }) {
  return (
    <div className="border-l border-[#d8ddd8] pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858e88]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#202823]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#7a837d]">
        {detail}
      </p>
    </div>
  )
}

function SeverityBadge({ severity }) {
  const high = severity === 'High'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${high ? 'text-[#b04438]' : 'text-[#9b6f21]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${high ? 'bg-[#c95b4e]' : 'bg-[#d6a84f]'
          }`}
      />

      {severity}
    </span>
  )
}

function StatusBadge({ status }) {
  const resolved = status === 'Resolved'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${resolved ? 'text-[#27734a]' : 'text-[#59635d]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${resolved ? 'bg-[#3b9a67]' : 'bg-[#8a938d]'
          }`}
      />

      {status}
    </span>
  )
}

function RecurrenceIndicator({ count }) {
  const intensity =
    count >= 5
      ? 'bg-[#b04438]'
      : count >= 3
        ? 'bg-[#d6a84f]'
        : 'bg-[#7d8a82]'

  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 min-w-7 items-center justify-center px-2 text-xs font-bold text-white ${intensity}`}
      >
        {count}
      </span>

      <span className="text-xs text-[#7a837d]">
        occurrences
      </span>
    </div>
  )
}

function RecurringViolations() {
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchViolations = async () => {
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

  const groupedViolations = violations.reduce(
    (groups, violation) => {
      const key = `${violation.type}-${violation.zone}`

      if (!groups[key]) {
        groups[key] = {
          type: violation.type,
          zone: violation.zone,
          severity: violation.severity,
          count: 0,
          latestStatus: violation.status,
          source: violation.source,
        }
      }

      groups[key].count += 1

      return groups
    },
    {}
  )

  const recurringViolations =
    Object.values(groupedViolations)
      .filter(
        (violation) => violation.count >= 2
      )
      .sort(
        (a, b) => b.count - a.count
      )

  const repeatedOccurrences =
    recurringViolations.reduce(
      (total, item) =>
        total + item.count,
      0
    )

  const highRiskPatterns =
    recurringViolations.filter(
      (violation) =>
        violation.severity === 'High'
    ).length

  const affectedZones = new Set(
    recurringViolations.map(
      (violation) => violation.zone
    )
  ).size

  if (loading) {
    return (
      <div className="min-h-[60vh]">
        <div className="border-b border-[#dfe3de] pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
            Safety Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#202823]">
            Recurring Violations
          </h1>

          <p className="mt-1 text-sm text-[#7a837d]">
            Loading violation pattern analysis...
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
              Safety Operations / Pattern Analysis
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Recurring Violations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Identify repeated safety violations by type
              and mine zone to expose persistent risk patterns.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-[#d9ded9] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#d6a84f]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#59635d]">
              Pattern monitoring active
            </span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-4">
        <Metric
          label="Total violations"
          value={violations.length}
          detail="All recorded incidents"
        />

        <Metric
          label="Recurring patterns"
          value={recurringViolations.length}
          detail="Two or more occurrences"
        />

        <Metric
          label="Repeated occurrences"
          value={repeatedOccurrences}
          detail="Across recurring patterns"
        />

        <Metric
          label="Affected zones"
          value={affectedZones}
          detail={`${highRiskPatterns} high-risk patterns`}
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 border border-[#e2c3bf] bg-[#fbf5f4] px-4 py-3">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c95b4e]" />

          <div>
            <p className="text-xs font-semibold text-[#9f3d34]">
              Pattern data unavailable
            </p>

            <p className="mt-1 text-xs text-[#9f5b54]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Pattern overview */}
      <section className="bg-[#202823] px-5 py-5 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d6a84f]">
              Pattern detection rule
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d5dad6]">
              A violation type is classified as recurring when
              the same violation occurs at least twice within
              the same mine zone.
            </p>
          </div>

          <div className="flex items-center gap-4 border-l border-[#465049] pl-5">
            <div>
              <p className="text-2xl font-semibold text-white">
                ≥ 2
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#9ea7a1]">
                Occurrences
              </p>
            </div>

            <div className="h-8 w-px bg-[#465049]" />

            <div>
              <p className="text-2xl font-semibold text-[#d6a84f]">
                {recurringViolations.length}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#9ea7a1]">
                Patterns detected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recurring patterns */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Pattern register
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Recurring Violation Patterns
            </h2>
          </div>

          <p className="text-xs text-[#7a837d]">
            {recurringViolations.length} recurring pattern
            {recurringViolations.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="overflow-hidden border-y border-[#dfe3de] bg-white">
          {recurringViolations.length === 0 ? (
            <div className="px-6 py-12">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d7ddd8] bg-[#f5f7f4] text-[#69736c]">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#303a34]">
                    No recurring violations detected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                    Repeated violations will appear here
                    automatically when the same type is recorded
                    multiple times in a zone.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full text-left text-sm">
                <thead className="border-b border-[#dfe3de] bg-[#f6f7f4]">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Violation
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Zone
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Recurrence
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Severity
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Latest status
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Source
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recurringViolations.map(
                    (violation) => (
                      <tr
                        key={`${violation.type}-${violation.zone}`}
                        className="border-b border-[#edf0ed] last:border-b-0 hover:bg-[#fafbf9]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#303a34]">
                            {violation.type}
                          </p>

                          <p className="mt-1 text-[11px] text-[#89918b]">
                            Repeated safety event
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-xs font-medium text-[#59635d]">
                            {violation.zone}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <RecurrenceIndicator
                            count={violation.count}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <SeverityBadge
                            severity={violation.severity}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={
                              violation.latestStatus
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

      {/* Interpretation footer */}
      <section className="border-t border-[#dfe3de] pt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Signal
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Higher occurrence counts indicate patterns
              appearing repeatedly in the same zone.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Review
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Use recurring patterns to identify areas
              requiring closer operational attention.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Safety Command
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Pattern analysis supports the wider detect,
              correct and verify workflow.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RecurringViolations