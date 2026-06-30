'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
const availableTimes = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
];
export function DoctorDetailsDialog({ doctor, onClose, }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState();
    const { toast } = useToast();
    const handleBooking = () => {
        if (selectedDate && selectedTime) {
            toast({
                title: 'Appointment Confirmed!',
                description: `Your appointment with ${doctor.name} is set for ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
            });
            onClose();
        }
        else {
            toast({
                variant: 'destructive',
                title: 'Incomplete Information',
                description: 'Please select both a date and a time for your appointment.',
            });
        }
    };
    return (<Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card border border-white/10 shadow-2xl animate-fade-in-up">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-gradient">
            Book Appointment
          </DialogTitle>
          <DialogDescription className="font-medium text-foreground">{doctor.name} - {doctor.specialty}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center bg-slate-950/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md bg-transparent text-foreground" disabled={{ before: new Date() }}/>
          </div>
          <div>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-emerald-500">
                <SelectValue placeholder="Select a time"/>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-foreground">
                {availableTimes.map(time => (<SelectItem key={time} value={time} className="focus:bg-emerald-500/20 focus:text-foreground">
                    {time}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/10 text-foreground">
            Cancel
          </Button>
          <Button onClick={handleBooking} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold">Confirm Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
