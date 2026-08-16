'use client';
import { useState, useEffect } from 'react';
import { doctors } from '@/lib/data';
import { Input } from '@/components/ui/input';
import {
  MapPin, Phone, Search, Stethoscope, X, Sparkles, Loader2,
  UserCheck, Star, Users, Calendar,
} from 'lucide-react';
import { DoctorDetailsDialog } from './doctor-details-dialog';
import { useToast } from '@/hooks/use-toast';
import { getDoctorsInArea } from '@/app/actions';

/* ── Star Rating ── */
function StarRating({ rating = 4 }) {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating}.0</span>
    </div>
  );
}

/* ── Doctor Card ── */
function DoctorCard({ doctor, index, onClick }) {
  const rating = 4 + (doctor.id % 2 === 0 ? 0 : 1); // alternates between 4 and 5 stars
  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 55}ms` }}
      className="doctor-card animate-tile-pop group"
    >
      {/* Top section */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar ring */}
        <div className="avatar-ring shrink-0">
          <div className="avatar-inner">
            {doctor.icon
              ? <doctor.icon className="w-5 h-5 text-emerald-400" />
              : <Stethoscope className="w-5 h-5 text-emerald-400" />
            }
          </div>
        </div>

        {/* Name + rating */}
        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-bold text-base text-white leading-tight truncate">
            {doctor.name}
          </h3>
          <StarRating rating={rating} />
        </div>

        {/* Availability dot */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="avail-dot" />
            <span className="text-[10px] text-emerald-400 font-semibold">Available</span>
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
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Tap to book</span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-full transition-all duration-150">
          <Calendar className="w-3 h-3" />
          Book Appointment
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Card ── */
function SkeletonCard({ index }) {
  return (
    <div className="skeleton h-52 rounded-2xl" style={{ animationDelay: `${index * 80}ms` }} />
  );
}

export function DoctorDirectory() {
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAiMode, setIsAiMode]         = useState(false);
  const [aiDoctors, setAiDoctors]       = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiKey, setApiKey]             = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('vha_gemini_key');
      if (savedKey) setApiKey(savedKey);
      const handleStorageUpdate = () => {
        const updatedKey = localStorage.getItem('vha_gemini_key');
        if (updatedKey !== null) setApiKey(updatedKey);
      };
      window.addEventListener('vha_storage_update', handleStorageUpdate);
      return () => window.removeEventListener('vha_storage_update', handleStorageUpdate);
    }
  }, []);

  const handleAiSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      toast({ variant: 'destructive', title: 'Query Too Short', description: 'Please enter at least 3 characters.' });
      return;
    }
    setIsLoading(true);
    const result = await getDoctorsInArea(searchQuery, apiKey);
    setIsLoading(false);
    if (result.error) {
      toast({ variant: 'destructive', title: 'AI Search Failed', description: result.error });
    } else if (result.doctors) {
      const doctorsWithIcons = result.doctors.map((doc, idx) => ({
        id: `ai-${idx}`, ...doc, icon: Stethoscope,
      }));
      setAiDoctors(doctorsWithIcons);
      toast({
        title: '✅ Search Complete',
        description: `Found ${result.doctors.length} doctor${result.doctors.length !== 1 ? 's' : ''}.`,
      });
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const doctorsToDisplay = isAiMode ? aiDoctors : filteredDoctors;

  return (
    <section className="w-full mx-auto">

      {/* ── Section Header ── */}
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="section-badge mb-4 inline-flex">
          <Users className="w-3 h-3" />
          Verified Specialists
        </span>
        <h2 className="mt-4 font-headline font-bold text-3xl sm:text-4xl text-white tracking-tight">
          Find a <span className="text-gradient">Doctor</span>
        </h2>
        <p className="mt-3 text-slate-400 max-w-lg mx-auto text-sm">
          Search our directory of verified specialists, or use AI Finder to locate doctors anywhere across India.
        </p>
      </div>

      {/* ── Mode Segmented Control ── */}
      <div className="flex justify-center mb-6 animate-fade-in-up [animation-delay:60ms]">
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/8 gap-1">
          <button
            type="button"
            onClick={() => { setIsAiMode(false); setSearchQuery(''); setAiDoctors([]); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 btn-press ${
              !isAiMode
                ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Local Directory
          </button>
          <button
            type="button"
            onClick={() => { setIsAiMode(true); setSearchQuery(''); setAiDoctors([]); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 btn-press ${
              isAiMode
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Finder
          </button>
        </div>
      </div>

      {/* ── Search Input ── */}
      <div className="max-w-lg mx-auto mb-8 animate-fade-in-up [animation-delay:120ms]">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder={isAiMode ? 'Search any area in India (e.g. Noida Sector 62)…' : 'Search by area, specialty, or name…'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && isAiMode) handleAiSearch(); }}
              className="pl-10 pr-10 py-3 bg-white/5 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 transition-all duration-200 rounded-xl"
              aria-label="Search doctors"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-white/10 transition-all duration-150 flex items-center justify-center"
                onClick={() => { setSearchQuery(''); setAiDoctors([]); }}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            )}
          </div>
          {isAiMode && (
            <button
              onClick={handleAiSearch}
              disabled={isLoading}
              className="cta-btn-primary py-2.5 px-4 text-sm shimmer-btn disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Search</>}
            </button>
          )}
        </div>
      </div>

      {/* ── Doctor Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)
        ) : (
          doctorsToDisplay.map((doctor, i) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              index={i}
              onClick={() => setSelectedDoctor(doctor)}
            />
          ))
        )}

        {!isLoading && doctorsToDisplay.length === 0 && (
          <div className="col-span-full py-16 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">No doctors found.</p>
            <p className="text-slate-600 text-sm mt-1">
              {isAiMode
                ? 'Try broadening your search (e.g. "Delhi").'
                : 'Try a different area, specialty, or name.'}
            </p>
          </div>
        )}
      </div>

      {selectedDoctor && (
        <DoctorDetailsDialog doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}
    </section>
  );
}
