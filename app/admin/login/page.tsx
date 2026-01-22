'use client'

import { useFormState } from 'react-dom'
import { login } from '../actions'

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  // @ts-ignore
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg border border-gray-700">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Puzzio Admin</h1>
        
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-500 text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
