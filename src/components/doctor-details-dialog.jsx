'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { bookAppointmentAction } from '@/app/actions';
import { Loader2, CheckCircle2, User, Phone } from 'lucide-react';

const availableTimes = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
];

export function DoctorDetailsDialog({ doctor, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (!doctor) return null;

  const handleBooking = async () => {
    const isDateValid = selectedDate instanceof Date && !isNaN(selectedDate.getTime());
    if (!isDateValid || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description: 'Please select both a date and a time slot for your appointment.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bookAppointmentAction({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        patientName: patientName.trim() || 'Guest Patient',
        patientPhone: patientPhone.trim() || '+91 98765 43210',
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime
      });

      if (res.success) {
        toast({
          title: `Appointment Confirmed! (${res.booking.id})`,
          description: `Your appointment with ${doctor.name} is scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
        });
        onClose();
      } else {
        toast({
          variant: 'destructive',
          title: 'Booking Notice',
          description: res.error || 'The selected slot might already be occupied. Please choose another slot.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: 'An unexpected error occurred while booking. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={Boolean(doctor)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[440px] glass-dialog border border-white/10 shadow-2xl animate-fade-in-up">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-gradient">
            Book Appointment
          </DialogTitle>
          <DialogDescription className="font-medium text-foreground">
            {doctor.name} — {doctor.specialty}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5 py-3">
          {/* Calendar */}
          <div className="flex justify-center bg-slate-950/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-inner">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md bg-transparent text-foreground scale-95"
              disabled={{ before: startOfToday }}
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {availableTimes.map(time => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-emerald-500 text-xs">
                <SelectValue placeholder="Or choose time from dropdown..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-foreground">
                {availableTimes.map(time => (
                  <SelectItem key={time} value={time} className="focus:bg-emerald-500/20 focus:text-foreground">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Patient Name</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-8 pl-7"
                />
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Phone Number</label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="+91 98765 XXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-8 pl-7"
                />
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isSubmitting}
            className="border-white/10 hover:bg-white/10 text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                Scheduling...
              </>
            ) : (
              'Confirm Appointment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
