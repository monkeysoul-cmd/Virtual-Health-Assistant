'use client';

import { useState } from 'react';
import { doctors } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Search, Stethoscope } from 'lucide-react';
import { DoctorDetailsDialog } from './doctor-details-dialog';
import type { Doctor } from '@/lib/data';

export function DoctorDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full max-w-4xl mx-auto py-8 md:py-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
          Find a Doctor
        </h2>
        <p className="text-muted-foreground md:text-xl/relaxed">
          Search our directory of specialists in your area.
        </p>
      </div>
      <div className="mt-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by area (e.g., Downtown, Uptown)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search doctors by area"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredDoctors.map(doctor => (
          <Card
            key={doctor.id}
            className="bg-card/80 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer"
            onClick={() => setSelectedDoctor(doctor)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <doctor.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">{doctor.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span>{doctor.specialty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{doctor.area}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>{doctor.contact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDoctors.length === 0 && (
          <p className="text-center text-muted-foreground md:col-span-3">
            No doctors found for "{searchQuery}".
          </p>
        )}
      </div>
      {selectedDoctor && (
        <DoctorDetailsDialog
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </section>
  );
}
