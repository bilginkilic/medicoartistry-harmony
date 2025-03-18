
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../config/api';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  type: 'initial' | 'follow-up' | 'control' | 'procedure';
  reason: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const startDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
      const { data } = await api.get('/appointments', {
        params: { startDate }
      });
      return data.appointments as Appointment[];
    }
  });

  const cancelAppointment = async (id: string) => {
    try {
      await api.delete(`/appointments/${id}`);
      toast({
        title: 'Appointment cancelled',
        description: 'The appointment has been cancelled successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel the appointment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <Button asChild>
          <a href="/appointments/new">Schedule Appointment</a>
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-[300px] bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-4">Select Date</h2>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className={cn("rounded-md border pointer-events-auto")}
          />
        </div>

        <div className="flex-1 space-y-4">
          {isLoading ? (
            <p>Loading appointments...</p>
          ) : appointments?.length === 0 ? (
            <p>No appointments found for the selected date.</p>
          ) : (
            appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>{format(new Date(appointment.dateTime), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{format(new Date(appointment.dateTime), 'p')}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{appointment.type}</p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    {
                      'bg-yellow-100 text-yellow-800': appointment.status === 'scheduled',
                      'bg-green-100 text-green-800': appointment.status === 'confirmed',
                      'bg-blue-100 text-blue-800': appointment.status === 'completed',
                      'bg-red-100 text-red-800': appointment.status === 'cancelled',
                      'bg-gray-100 text-gray-800': appointment.status === 'no-show',
                    }
                  )}>
                    {appointment.status}
                  </span>
                  {appointment.status !== 'cancelled' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
