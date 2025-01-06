import { useState } from 'react';
import { LoadingButton } from './LoadingButton';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface WorkingHours {
  [key: string]: { open: string; close: string; closed: boolean } | null;
}

interface WorkingHoursEditorProps {
  hours: WorkingHours;
  onSave: (hours: WorkingHours) => Promise<void>;
}

export function WorkingHoursEditor({ hours, onSave }: WorkingHoursEditorProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(hours);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(workingHours);
    } catch (err) {
      setError('Failed to update working hours');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        {DAYS.map(day => (
          <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-28">
              <span className="font-medium">{day}</span>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!workingHours[day]?.closed}
                onChange={(e) => handleChange(day, 'closed', !e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm">Open</span>
            </label>
            {!workingHours[day]?.closed && (
              <>
                <input
                  type="time"
                  value={workingHours[day]?.open || '09:00'}
                  onChange={(e) => handleChange(day, 'open', e.target.value)}
                  className="rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
                <span>to</span>
                <input
                  type="time"
                  value={workingHours[day]?.close || '17:00'}
                  onChange={(e) => handleChange(day, 'close', e.target.value)}
                  className="rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </>
            )}
          </div>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <LoadingButton type="submit" loading={loading}>
        Save Working Hours
      </LoadingButton>
    </form>
  );
}