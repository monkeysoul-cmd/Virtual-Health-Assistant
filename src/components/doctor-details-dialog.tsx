'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Doctor } from '@/lib/data';
import { format } from 'date-fns';

interface DoctorDetailsDialogProps {
  doctor: Doctor;
  onClose: () => void;
}

const availableTimes = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
];

export function DoctorDetailsDialog({
  doctor,
  onClose,
}: DoctorDetailsDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const { toast } = useToast();

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      toast({
        title: 'Appointment Confirmed!',
        description: `Your appointment with ${
          doctor.name
        } is set for ${format(selectedDate, 'PPP')} at ${selectedTime}.`,
      });
      onClose();
    } else {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description: 'Please select both a date and a time for your appointment.',
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {doctor.name}
          </DialogTitle>
          <DialogDescription>{doctor.specialty}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={{ before: new Date() }}
            />
          </div>
          <div>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBooking}>Confirm Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
