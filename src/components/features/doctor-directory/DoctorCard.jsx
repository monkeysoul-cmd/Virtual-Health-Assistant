import React from 'react';
import { Stethoscope, MapPin, Phone, Calendar } from 'lucide-react';
import { StarRating } from '@/components/common/StarRating';

/**
 * Interactive Doctor Card with Star Rating & Appointment Booking CTA
 */
export function DoctorCard({ doctor, index = 0, onClick }) {
  const numericId = typeof doctor.id === 'number'
    ? doctor.id
    : parseInt(String(doctor.id).replace(/\D/g, ''), 10);
  const safeId = Number.isFinite(numericId) ? numericId : index;
  const rating = 4 + (safeId % 2 === 0 ? 0 : 1); // alternates between 4 and 5 stars

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 55}ms` }}
      className="doctor-card animate-tile-pop group"
    >
      {/* Top section */}
      <div className="flex items-start gap-3.5 mb-4">
        {/* Avatar ring with status badge */}
        <div className="relative shrink-0">
          <div className="avatar-ring">
            <div className="avatar-inner">
              {doctor.icon
                ? <doctor.icon className="w-5 h-5 text-emerald-400" />
                : <Stethoscope className="w-5 h-5 text-emerald-400" />
              }
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

        {/* Name + rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="font-headline font-bold text-base text-white leading-snug">
              {doctor.name}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={rating} />
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="truncate">{doctor.specialty}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="truncate">{doctor.area}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="truncate">{doctor.contact}</span>
        </div>
      </div>

      {/* Book Appointment CTA */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Tap to book</span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-full transition-all duration-150">
          <Calendar className="w-3 h-3" />
          Book Appointment
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
