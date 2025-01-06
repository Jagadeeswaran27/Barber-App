import { Clock } from 'lucide-react';

interface WorkingHours {
  [key: string]: { open: string; close: string; closed: boolean } | null;
}

interface WorkingHoursDisplayProps {
  hours: WorkingHours;
}

export function WorkingHoursDisplay({ hours }: WorkingHoursDisplayProps) {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-2">
      {days.map(day => {
        const dayHours = hours[day];
        const isClosed = !dayHours || dayHours.closed;

        return (
          <div key={day} className="flex items-center justify-between py-2">
            <span className="font-medium">{day}</span>
            <span className="text-gray-600">
              {isClosed ? (
                'Closed'
              ) : (
                `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}