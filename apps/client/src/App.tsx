import './App.css';

import { SatellitesPanel } from './components/satellites/panel/SatellitesPanel';
import { LoginModal } from './components/users/LoginModal';
import { Globe } from './features/globe/components/Globe';
import { useAuthInit } from './hooks/useAuthInit';
import { useAuthStore } from './store/authStore';

const App = () => {
  useAuthInit();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <div className="bg-(--background) flex h-full w-full flex-row gap-2 p-2">
      {!user && !isLoading && <LoginModal />}
      <SatellitesPanel />
      <Globe />
    </div>
  );
};

export default App;
