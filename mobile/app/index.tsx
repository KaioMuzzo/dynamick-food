import { Redirect } from 'expo-router'

// Entry point: send users to the Welcome screen until auth-based routing exists.
export default function Index() {
  return <Redirect href="/welcome" />
}
