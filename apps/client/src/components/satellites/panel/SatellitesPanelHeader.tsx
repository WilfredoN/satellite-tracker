import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useAuthStore } from '../../../store';
import { usersService } from '../../../services/usersService';

type SatellitesPanelHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export const SatellitesPanelHeader = ({
  search,
  onSearchChange,
  onAddClick,
}: SatellitesPanelHeaderProps) => {
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogout = async () => {
    await usersService.logout();
    setUser(null);
  };

  return (
    <header className="flex flex-row items-stretch gap-2">
      <Input
        placeholder="SEARCH..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      <Button onClick={onAddClick}>Add</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
};
