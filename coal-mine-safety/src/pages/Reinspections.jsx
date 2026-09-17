import { useEffect, useState } from 'react'

function Reinspections() {
  const [reinspections, setReinspections] = useState([])
  const [actions, setActions] = useState([])
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

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading re-inspections...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Re-inspections
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Verify corrective actions and close safety violations
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {readyActions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Ready for Re-inspection
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Verify completed corrective actions.
          </p>

          <div className="mt-5 space-y-4">
            {readyActions.map((action) => (
              <div
                key={action.id}
                className="flex flex-col gap-4 rounded-lg bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {action.violation_code} —{' '}
                    {action.violation}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {action.zone} · Corrective action CA-
                    {action.id}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      inspectAction(
                        action,
                        'Failed'
                      )
                    }
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Fail
                  </button>

                  <button
                    onClick={() =>
                      inspectAction(
                        action,
                        'Passed'
                      )
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Pass & Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Re-inspection History
          </h2>
        </div>

        {reinspections.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No re-inspections completed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Violation
                  </th>

                  <th className="px-6 py-4">
                    Zone
                  </th>

                  <th className="px-6 py-4">
                    Inspector
                  </th>

                  <th className="px-6 py-4">
                    Result
                  </th>

                  <th className="px-6 py-4">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                {reinspections.map(
                  (inspection) => (
                    <tr
                      key={inspection.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {inspection.violation_code}

                        <div className="text-xs text-slate-500">
                          {inspection.violation}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inspection.zone}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inspection.inspector}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            inspection.result ===
                            'Passed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {inspection.result}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inspection.remarks ||
                          '—'}
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

export default Reinspections