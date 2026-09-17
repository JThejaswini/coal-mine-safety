import { useState } from 'react'

const initialContractors = [
  {
    id: 'CTR-001',
    company: 'ABC Mining Services',
    workers: 42,
    safetyStatus: 'Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-002',
    company: 'Eastern Equipment Works',
    workers: 18,
    safetyStatus: 'Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-003',
    company: 'SafeHaul Logistics',
    workers: 25,
    safetyStatus: 'Pending Review',
    contract: 'Active',
  },
  {
    id: 'CTR-004',
    company: 'Prime Industrial Services',
    workers: 31,
    safetyStatus: 'Non-Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-005',
    company: 'Southern Mining Support',
    workers: 14,
    safetyStatus: 'Compliant',
    contract: 'Expired',
  },
]

function Contractors() {
  const [contractors, setContractors] =
    useState(initialContractors)

  const compliant = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Compliant'
  ).length

  const pending = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Pending Review'
  ).length

  const nonCompliant = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Non-Compliant'
  ).length

  const updateStatus = (id) => {
    setContractors(
      contractors.map((contractor) =>
        contractor.id === id
          ? {
              ...contractor,
              safetyStatus: 'Compliant',
            }
          : contractor
      )
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Contractors
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor contractor safety and compliance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Compliant Contractors
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {compliant}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending Review
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-600">
            {pending}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Non-Compliant
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {nonCompliant}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Contractor Registry
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">
                  Contractor ID
                </th>

                <th className="px-6 py-4">
                  Company
                </th>

                <th className="px-6 py-4">
                  Workers
                </th>

                <th className="px-6 py-4">
                  Safety Status
                </th>

                <th className="px-6 py-4">
                  Contract
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {contractors.map(
                (contractor) => (
                  <tr
                    key={contractor.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {contractor.id}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {contractor.company}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {contractor.workers}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          contractor.safetyStatus ===
                          'Compliant'
                            ? 'bg-green-100 text-green-700'
                            : contractor.safetyStatus ===
                                'Non-Compliant'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {contractor.safetyStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {contractor.contract}
                    </td>

                    <td className="px-6 py-4">
                      {contractor.safetyStatus !==
                        'Compliant' && (
                        <button
                          onClick={() =>
                            updateStatus(
                              contractor.id
                            )
                          }
                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                        >
                          Mark Compliant
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Contractors