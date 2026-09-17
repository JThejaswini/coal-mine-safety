import { useState } from 'react'

const initialWorkers = [
  {
    id: 'W-001',
    name: 'Arun Kumar',
    role: 'Mining Operator',
    training: 'Completed',
    expiry: '20 Dec 2026',
  },
  {
    id: 'W-002',
    name: 'Suresh B',
    role: 'Safety Supervisor',
    training: 'Completed',
    expiry: '15 Jan 2027',
  },
  {
    id: 'W-003',
    name: 'Ravi Kumar',
    role: 'Equipment Operator',
    training: 'Pending',
    expiry: '—',
  },
  {
    id: 'W-004',
    name: 'Manoj P',
    role: 'Mining Operator',
    training: 'Expired',
    expiry: '10 Aug 2026',
  },
  {
    id: 'W-005',
    name: 'Vijay S',
    role: 'Maintenance Worker',
    training: 'Completed',
    expiry: '05 Mar 2027',
  },
]

function Workforce() {
  const [workers, setWorkers] =
    useState(initialWorkers)

  const completed = workers.filter(
    (worker) =>
      worker.training === 'Completed'
  ).length

  const pending = workers.filter(
    (worker) =>
      worker.training === 'Pending'
  ).length

  const expired = workers.filter(
    (worker) =>
      worker.training === 'Expired'
  ).length

  const updateTraining = (id) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === id
          ? {
              ...worker,
              training: 'Completed',
              expiry: '15 Sep 2027',
            }
          : worker
      )
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Workforce
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor workforce safety training and certification
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Training Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completed}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Training
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {pending}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Expired Training
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {expired}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Workforce Training
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">
                  Worker ID
                </th>

                <th className="px-6 py-4">
                  Name
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Training
                </th>

                <th className="px-6 py-4">
                  Valid Until
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {workers.map((worker) => (
                <tr
                  key={worker.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {worker.id}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {worker.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {worker.role}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        worker.training ===
                        'Completed'
                          ? 'bg-green-100 text-green-700'
                          : worker.training ===
                              'Expired'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {worker.training}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {worker.expiry}
                  </td>

                  <td className="px-6 py-4">
                    {worker.training !==
                      'Completed' && (
                      <button
                        onClick={() =>
                          updateTraining(
                            worker.id
                          )
                        }
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        Mark Trained
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Workforce