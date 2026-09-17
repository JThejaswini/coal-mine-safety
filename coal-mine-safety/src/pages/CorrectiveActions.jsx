import { useEffect, useState } from 'react'

function CorrectiveActions() {
  const [actions, setActions] = useState([])
  const [violations, setViolations] = useState([])
  const [reinspections, setReinspections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        actionsResponse,
        violationsResponse,
        reinspectionsResponse,
      ] = await Promise.all([
        fetch(
          'http://localhost:5000/api/corrective-actions',
          { headers }
        ),
        fetch(
          'http://localhost:5000/api/violations',
          { headers }
        ),
        fetch(
          'http://localhost:5000/api/reinspections',
          { headers }
        ),
      ])

      const actionsData =
        await actionsResponse.json()

      const violationsData =
        await violationsResponse.json()

      const reinspectionsData =
        await reinspectionsResponse.json()

      if (
        !actionsResponse.ok ||
        !violationsResponse.ok ||
        !reinspectionsResponse.ok
      ) {
        throw new Error(
          'Failed to load corrective action data'
        )
      }

      setActions(actionsData)
      setViolations(violationsData)
      setReinspections(reinspectionsData)
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

  const createAction = async (violation) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/corrective-actions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            violationId: violation.id,
            actionDescription:
              `Correct ${violation.type} at ${violation.zone}`,
            deadline: '2026-09-15',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to create corrective action'
        )
      }

      await fetchData()
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const completeAction = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/corrective-actions/${id}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to complete corrective action'
        )
      }

      await fetchData()
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const actionViolationIds = new Set(
    actions.map((action) =>
      Number(action.violation_id)
    )
  )

  const availableViolations =
    violations.filter(
      (violation) => {
        const hasFailedReinspection =
          reinspections.some(
            (inspection) =>
              inspection.result === 'Failed' &&
              Number(
                inspection.violation_id
              ) === Number(violation.id)
          )

        return (
          violation.status !== 'Resolved' &&
          !actionViolationIds.has(
            Number(violation.id)
          ) &&
          !hasFailedReinspection
        )
      }
    )

  const pendingCount = actions.filter(
    (action) => action.status === 'Pending'
  ).length

  const completedCount = actions.filter(
    (action) => action.status === 'Completed'
  ).length

  const failedReinspectionViolations =
    new Set(
      reinspections
        .filter(
          (inspection) =>
            inspection.result === 'Failed'
        )
        .map((inspection) => ({
          violationId: Number(
            inspection.violation_id
          ),
          actionId: Number(
            inspection.corrective_action_id
          ),
        }))
    )

  const failedViolations =
    violations.filter((violation) => {
      if (violation.status === 'Resolved') {
        return false
      }

      const failedInspection =
        reinspections
          .filter(
            (inspection) =>
              inspection.result === 'Failed' &&
              Number(
                inspection.violation_id
              ) === Number(violation.id)
          )
          .sort(
            (a, b) =>
              Number(b.id) - Number(a.id)
          )[0]

      if (!failedInspection) {
        return false
      }

      const oldActionId = Number(
        failedInspection.corrective_action_id
      )

      const newActionExists =
        actions.some(
          (action) =>
            Number(action.violation_id) ===
            Number(violation.id) &&
            Number(action.id) > oldActionId
        )

      return !newActionExists
    })

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading corrective actions...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Corrective Actions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track actions required to resolve safety violations
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Actions
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {actions.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedCount}
          </p>
        </div>
      </div>

      {failedViolations.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
          <h2 className="font-semibold text-orange-900">
            Re-inspection Failed
          </h2>

          <p className="mt-1 text-sm text-orange-700">
            Create a new corrective action for the failed violation.
          </p>

          <div className="mt-5 space-y-3">
            {failedViolations.map((violation) => (
              <div
                key={violation.id}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {violation.violation_code} —{' '}
                    {violation.type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {violation.zone} ·{' '}
                    {violation.severity}
                  </p>
                </div>

                <button
                  onClick={() =>
                    createAction(violation)
                  }
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Create New Action
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableViolations.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Violations Requiring Action
          </h2>

          <p className="mt-1 text-sm text-red-700">
            Create a corrective action for an open violation.
          </p>

          <div className="mt-5 space-y-3">
            {availableViolations.map((violation) => (
              <div
                key={violation.id}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {violation.violation_code} —{' '}
                    {violation.type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {violation.zone} ·{' '}
                    {violation.severity} ·{' '}
                    {violation.source}
                  </p>
                </div>

                <button
                  onClick={() =>
                    createAction(violation)
                  }
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Create Action
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Corrective Action Records
          </h2>
        </div>

        {actions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No corrective actions created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Action
                  </th>

                  <th className="px-6 py-4">
                    Violation
                  </th>

                  <th className="px-6 py-4">
                    Zone
                  </th>

                  <th className="px-6 py-4">
                    Assigned To
                  </th>

                  <th className="px-6 py-4">
                    Deadline
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody>
                {actions.map((action) => (
                  <tr
                    key={action.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      CA-{action.id}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {action.violation_code}

                      <div className="text-xs text-slate-500">
                        {action.violation}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {action.zone}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {action.assigned_to}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {action.deadline || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${action.status ===
                          'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}
                      >
                        {action.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {action.status === 'Pending' ? (
                        <button
                          onClick={() =>
                            completeAction(
                              action.id
                            )
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs text-green-600">
                          Ready for re-inspection
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CorrectiveActions