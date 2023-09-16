import { useEffect } from 'react'
import { type To, useLocation, useNavigate } from 'react-router'

export interface RedirectProps {
  to: To
}

// `react-router` doesn't have a client side redirect component.
// We need to do client side redirect here because there's no server so we
// implement one ourselves.
export function Redirect({ to }: RedirectProps): null {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    console.log(`Redirecting from ${location.pathname} to`, to)
    navigate(to)
  }, [navigate, to, location])
  return null
}
