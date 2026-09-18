import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'userRole',
        data.user.role
      )
      localStorage.setItem(
        'userName',
        data.user.name
      )

      navigate('/dashboard')
    } catch (error) {
      console.error(error)

      setError(
        'Unable to connect to the server'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#202823] text-[#202823]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* Left: Product identity */}
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[#202823]" />

          {/* Industrial grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(#d6a84f 1px, transparent 1px), linear-gradient(90deg, #d6a84f 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-[#d6a84f]/50 bg-[#26312b]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-[#d6a84f]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M4 20V9l8-5 8 5v11" />
                    <path d="M8 20v-7h8v7" />
                    <path d="M12 4v4" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-white">
                    COALMINE
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium tracking-[0.22em] text-[#aab2ac]">
                    SAFETY COMMAND
                  </p>
                </div>
              </div>

              <div className="mt-24 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d6a84f]">
                  Mine safety & governance
                </p>

                <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-white xl:text-6xl">
                  One command center
                  <br />
                  for safer mines.
                </h1>

                <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#b5bdb7]">
                  Monitor safety conditions, manage inspections,
                  track violations and coordinate corrective action
                  across the mine from a single operational platform.
                </p>
              </div>
            </div>

            <div className="grid max-w-xl grid-cols-3 border-t border-[#465049] pt-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8f9992]">
                  Monitoring
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Real-time
                </p>
              </div>

              <div className="border-l border-[#465049] pl-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8f9992]">
                  Compliance
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Centralized
                </p>
              </div>

              <div className="border-l border-[#465049] pl-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8f9992]">
                  Response
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Traceable
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Login */}
        <section className="flex min-h-screen items-center justify-center bg-[#f4f5f2] px-5 py-10 sm:px-8">
          <div className="w-full max-w-[430px]">

            {/* Mobile brand */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center bg-[#202823]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-[#d6a84f]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M4 20V9l8-5 8 5v11" />
                  <path d="M8 20v-7h8v7" />
                  <path d="M12 4v4" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.16em] text-[#202823]">
                  COALMINE
                </p>

                <p className="text-[9px] font-semibold tracking-[0.2em] text-[#7d857f]">
                  SAFETY COMMAND
                </p>
              </div>
            </div>

            <div className="mb-9">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 bg-[#d6a84f]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a918c]">
                  Authorized access
                </span>
              </div>

              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-[#202823]">
                Sign in to command center
              </h2>

              <p className="mt-2.5 text-sm leading-6 text-[#737b76]">
                Access your mine safety and compliance workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#59635d]">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="name@coalminesafety.com"
                  className="mt-2.5 w-full border border-[#d3d8d4] bg-white px-4 py-3.5 text-sm text-[#202823] outline-none transition placeholder:text-[#a7ada9] focus:border-[#9b6f21] focus:ring-1 focus:ring-[#d6a84f]/40"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#59635d]">
                    Password
                  </label>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="mt-2.5 w-full border border-[#d3d8d4] bg-white px-4 py-3.5 text-sm text-[#202823] outline-none transition placeholder:text-[#a7ada9] focus:border-[#9b6f21] focus:ring-1 focus:ring-[#d6a84f]/40"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 border border-[#e5caca] bg-[#fff7f7] px-4 py-3.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#a33a3a]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5" />
                    <path d="M12 16h.01" />
                  </svg>

                  <p className="text-sm leading-5 text-[#9b3d3d]">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-between bg-[#202823] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2b352f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {loading ? 'Authenticating...' : 'Sign in'}
                </span>

                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[#d6a84f] transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </form>

            <div className="mt-10 border-t border-[#dfe3de] pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7d857f]">
                    System operational
                  </span>
                </div>

                <span className="text-[10px] text-[#9aa19c]">
                  Safety Command v1.0
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login