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

      {detail && (
        <p className="mt-1 text-xs text-[#7a837d]">
          {detail}
        </p>
      )}
    </div>
  )
}

function ResultBadge({ result }) {
  const passed = result === 'Passed'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${passed ? 'text-[#27734a]' : 'text-[#b04438]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${passed ? 'bg-[#3b9a67]' : 'bg-[#c95b4e]'
          }`}
      />

      {result}
    </span>
  )
}

function ReadyAction({ action, onInspect }) {
  return (
    <div className="grid gap-5 border-b border-[#e2e5e1] py-5 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-[#202823]">
            {action.violation_code}
          </span>

          <span className="text-[#a0a7a2]">/</span>

          <span className="text-sm text-[#59635d]">
            {action.violation}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7b847e]">
          <span>{action.zone}</span>
          <span>Corrective action CA-{action.id}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onInspect(action, 'Failed')}
          className="border border-[#d7bbb8] bg-white px-4 py-2 text-xs font-semibold text-[#a64035] transition hover:border-[#c98c86] hover:bg-[#fbf5f4]"
        >
          Fail
        </button>

        <button
          type="button"
          onClick={() => onInspect(action, 'Passed')}
          className="bg-[#26312b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#18211c]"
        >
          Pass & Resolve
        </button>
      </div>
    </div>
  )
}

function WorkflowStep({ number, title, active }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-bold ${active
            ? 'bg-[#d6a84f] text-[#202823]'
            : 'border border-[#59635d] text-[#aeb5b0]'
          }`}
      >
        {number}
      </span>

      <span
        className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${active ? 'text-white' : 'text-[#9ea7a1]'
          }`}
      >
        {title}
      </span>
    </div>
  )
}

function Reinspections() {
  const [reinspections, setReinspections] = useState([])
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        reinspectionsResponse,
        actionsResponse,
      ] = await Promise.all([
        fetch(
          'http://localhost:5000/api/reinspections',
          { headers }
        ),
        fetch(
          'http://localhost:5000/api/corrective-actions',
          { headers }
        ),
      ])

      const reinspectionsData =
        await reinspectionsResponse.json()

      const actionsData =
        await actionsResponse.json()

      if (
        !reinspectionsResponse.ok ||
        !actionsResponse.ok
      ) {
        throw new Error(
          'Failed to load re-inspection data'
        )
      }

      setReinspections(reinspectionsData)
      setActions(actionsData)
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

  const inspectAction = async (
    action,
    result
  ) => {
    try {
      setError('')

      const response = await fetch(
        'http://localhost:5000/api/reinspections',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            correctiveActionId: action.id,
            result,
            remarks:
              result === 'Passed'
                ? 'Corrective action verified successfully.'
                : 'Corrective action requires additional work.',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to create re-inspection'
        )
      }

      await fetchData()
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const inspectedActionIds = new Set(
    reinspections.map((inspection) =>
      Number(
        inspection.corrective_action_id
      )
    )
  )

  const readyActions = actions.filter(
    (action) =>
      action.status === 'Completed' &&
      !inspectedActionIds.has(
        Number(action.id)
      )
  )

  const passedCount = reinspections.filter(
    (inspection) =>
      inspection.result === 'Passed'
  ).length

  const failedCount = reinspections.filter(
    (inspection) =>
      inspection.result !== 'Passed'
  ).length

  const passRate =
    reinspections.length > 0
      ? Math.round(
        (passedCount / reinspections.length) *
        100
      )
      : 0

  if (loading) {
    return (
      <div className="min-h-[60vh]">
        <div className="border-b border-[#dfe3de] pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
            Safety Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#202823]">
            Re-inspections
          </h1>

          <p className="mt-1 text-sm text-[#7a837d]">
            Loading verification records...
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
              Safety Operations / Verification
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Re-inspections
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Verify completed corrective actions before
              a safety violation is considered resolved.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-[#d9ded9] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#3b9a67]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#59635d]">
              Verification workflow active
            </span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-4">
        <Metric
          label="Ready"
          value={readyActions.length}
          detail="Awaiting inspection"
        />

        <Metric
          label="Completed"
          value={reinspections.length}
          detail="Verification records"
        />

        <Metric
          label="Passed"
          value={passedCount}
          detail="Actions verified"
        />

        <Metric
          label="Pass rate"
          value={`${passRate}%`}
          detail={
            reinspections.length > 0
              ? `${failedCount} failed`
              : 'No results yet'
          }
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 border border-[#e2c3bf] bg-[#fbf5f4] px-4 py-3">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c95b4e]" />

          <div>
            <p className="text-xs font-semibold text-[#9f3d34]">
              Verification request failed
            </p>

            <p className="mt-1 text-xs text-[#9f5b54]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Workflow strip */}
      <section className="bg-[#202823] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d6a84f]">
              Closure protocol
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              Corrective action must be verified before closure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <WorkflowStep
              number="01"
              title="Violation"
              active={false}
            />

            <span className="hidden text-[#59635d] sm:block">
              →
            </span>

            <WorkflowStep
              number="02"
              title="Correction"
              active={false}
            />

            <span className="hidden text-[#59635d] sm:block">
              →
            </span>

            <WorkflowStep
              number="03"
              title="Re-inspect"
              active={true}
            />

            <span className="hidden text-[#59635d] sm:block">
              →
            </span>

            <WorkflowStep
              number="04"
              title="Resolve"
              active={false}
            />
          </div>
        </div>
      </section>

      {/* Ready queue */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Verification queue
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Ready for Re-inspection
            </h2>
          </div>

          <span className="text-xs text-[#7a837d]">
            {readyActions.length} awaiting review
          </span>
        </div>

        <div className="border-y border-[#dfe3de] bg-white px-5 sm:px-6">
          {readyActions.length === 0 ? (
            <div className="py-10">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d7ddd8] bg-[#f5f7f4] text-[#69736c]">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#303a34]">
                    Verification queue is clear
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#7a837d]">
                    No completed corrective actions are
                    currently waiting for re-inspection.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            readyActions.map((action) => (
              <ReadyAction
                key={action.id}
                action={action}
                onInspect={inspectAction}
              />
            ))
          )}
        </div>
      </section>

      {/* History */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Audit trail
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Re-inspection History
            </h2>
          </div>

          <p className="text-xs text-[#7a837d]">
            {reinspections.length} verification
            {reinspections.length === 1 ? '' : 's'} recorded
          </p>
        </div>

        <div className="overflow-hidden border-y border-[#dfe3de] bg-white">
          {reinspections.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-[#59635d]">
                No re-inspections completed yet.
              </p>

              <p className="mt-1 text-xs text-[#89918b]">
                Completed corrective actions will appear here
                after verification.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="border-b border-[#dfe3de] bg-[#f6f7f4]">
                  <tr>
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Violation
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Zone
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Inspector
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Result
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reinspections.map(
                    (inspection) => (
                      <tr
                        key={inspection.id}
                        className="border-b border-[#edf0ed] last:border-b-0 hover:bg-[#fafbf9]"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#303a34]">
                            {inspection.violation_code}
                          </div>

                          <div className="mt-1 max-w-[260px] text-xs leading-5 text-[#7a837d]">
                            {inspection.violation}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs text-[#59635d]">
                          {inspection.zone}
                        </td>

                        <td className="px-5 py-4 text-xs text-[#59635d]">
                          {inspection.inspector}
                        </td>

                        <td className="px-5 py-4">
                          <ResultBadge
                            result={inspection.result}
                          />
                        </td>

                        <td className="max-w-[320px] px-5 py-4 text-xs leading-5 text-[#69736c]">
                          {inspection.remarks || '—'}
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
        <div className="flex flex-col gap-2 text-xs text-[#7a837d] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Re-inspection records provide the verification
            layer for corrective-action closure.
          </p>

          <p className="font-medium text-[#59635d]">
            Safety Command / Verification Register
          </p>
        </div>
      </section>
    </div>
  )
}

export default Reinspections