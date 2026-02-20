import { useState } from 'react';

import { API_URL } from '../../services';
import { type AuthState,useAuthStore } from '../../store';
import { Button, Input } from '../ui';

export function LoginModal() {
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const setError = useAuthStore((state: AuthState) => state.setError);
  const error = useAuthStore((state: AuthState) => state.error);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loginUrl = API_URL ? `${API_URL}/login` : '/login';
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-(--background)/90 fixed inset-0 z-50 flex items-center justify-center font-mono">
      <form
        className="border-(--foreground) bg-(--panel-bg) shadow-(--glow-strong) animate-fade-in flex w-full max-w-sm flex-col gap-5 rounded-lg border-2 p-8"
        onSubmit={handleSubmit}
        aria-modal="true"
        role="dialog"
      >
        <h2 className="text-(--foreground) drop-shadow-(--glow) mb-2 select-none text-center text-2xl font-bold tracking-widest">
          Login Required
        </h2>
        <Input
          className="select-none"
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          autoFocus
          required
        />
        <Input
          className="select-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div className="text-(--destructive) animate-pulse text-center text-sm">{error}</div>
        )}
        <Button
          className="shadow-(--glow) mt-2 w-full select-none text-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <div className="text-(--muted) mt-2 select-none text-center text-xs">
          Registration is only available via the bot.
        </div>
      </form>
    </div>
  );
}
