
export async function checkAuth(): Promise<{ authenticated: boolean; user?: any }> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const res = await fetch(`${backendUrl}/auth/check`, { credentials: 'include' });
  if (res.ok) {
    const data = await res.json();
    return { authenticated: data.authenticated, user: data.user };
  }
  return { authenticated: false };
}
