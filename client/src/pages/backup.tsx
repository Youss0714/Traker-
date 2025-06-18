import { useEffect } from 'react';
import { useAppContext } from '@/lib/context/AppContext';
import BackupPanel from '@/components/backup/BackupPanel';
import { useMobileDevice } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Backup() {
  const { setActivePage } = useAppContext();
  const { isMobileDevice } = useMobileDevice();

  useEffect(() => {
    setActivePage('backup');
  }, [setActivePage]);

  if (isMobileDevice) {
    return <BackupPanel />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Protection des données</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Système de sauvegarde automatique</CardTitle>
        </CardHeader>
        <CardContent>
          <BackupPanel />
        </CardContent>
      </Card>
    </div>
  );
}