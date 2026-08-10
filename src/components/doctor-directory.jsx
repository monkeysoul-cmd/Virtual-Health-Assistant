'use client';
import { useState, useEffect } from 'react';
import { doctors } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Search, Stethoscope, X, Sparkles, Loader2, UserCheck } from 'lucide-react';
import { DoctorDetailsDialog } from './doctor-details-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDoctorsInArea } from '@/app/actions';

export function DoctorDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiDoctors, setAiDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
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
      toast({
        variant: 'destructive',
        title: 'Query Too Short',
        description: 'Please enter a search query with at least 3 characters.',
      });
      return;
    }
    setIsLoading(true);
    const result = await getDoctorsInArea(searchQuery, apiKey);
    setIsLoading(false);

    if (result.error) {
      toast({ variant: 'destructive', title: 'AI Search Failed', description: result.error });
    } else if (result.doctors) {
      const doctorsWithIcons = result.doctors.map((doc, idx) => ({
        id: `ai-${idx}`,
        ...doc,
        icon: Stethoscope,
      }));
      setAiDoctors(doctorsWithIcons);
      toast({
        title: '✅ Search Completed',
        description: `Found ${result.doctors.length} doctor${result.doctors.length !== 1 ? 's' : ''} matching your search.`,
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
    <section className="w-full mx-auto py-8 md:py-12">

      {/* Header */}
      <div className="space-y-4 text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-gradient">
          Find a Doctor
        </h2>
        <p className="text-muted-foreground md:text-xl/relaxed font-medium">
          Search our directory of specialists in your area.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="mt-8 flex justify-center gap-3 animate-fade-in-up [animation-delay:80ms]">
        <Button
          type="button"
          variant={!isAiMode ? 'default' : 'outline'}
          className={`rounded-full transition-all duration-150 btn-press ${!isAiMode ? 'shadow-lg shadow-emerald-500/20 hover:scale-[1.03]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          onClick={() => { setIsAiMode(false); setSearchQuery(''); setAiDoctors([]); }}
        >
          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
          Local Directory
        </Button>
        <Button
          type="button"
          variant={isAiMode ? 'default' : 'outline'}
          className={`rounded-full flex items-center gap-1.5 transition-all duration-150 btn-press ${isAiMode ? 'shadow-lg shadow-emerald-500/20 hover:scale-[1.03]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          onClick={() => { setIsAiMode(true); setSearchQuery(''); setAiDoctors([]); }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Finder
        </Button>
      </div>

      {/* Search Input */}
      <div className="mt-6 max-w-md mx-auto animate-fade-in-up [animation-delay:160ms]">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isAiMode ? 'Search any area in India (e.g. Noida Sector 62)' : 'Search by area, specialty, or name…'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && isAiMode) handleAiSearch(); }}
              className="pl-10 pr-10 bg-white/5 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-150"
              aria-label="Search doctors"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-150"
                onClick={() => { setSearchQuery(''); setAiDoctors([]); }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          {isAiMode && (
            <Button
              onClick={handleAiSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold transition-all duration-150 btn-press hover:scale-[1.03]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search AI'}
            </Button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {isLoading ? (
          /* Loading skeleton cards */
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
          ))
        ) : (
          doctorsToDisplay.map((doctor, i) => (
            <Card
              key={doctor.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="glass-card bg-card/40 border border-white/10 hover:border-emerald-500/40 card-hover shadow-xl cursor-pointer group animate-card-reveal"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <div className="bg-primary/20 p-3 rounded-full transition-all duration-200 group-hover:bg-primary/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                  {doctor.icon
                    ? <doctor.icon className="w-6 h-6 text-primary" />
                    : <Stethoscope className="w-6 h-6 text-primary" />
                  }
                </div>
                <div>
                  <CardTitle className="font-headline text-base leading-tight">{doctor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{doctor.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{doctor.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{doctor.contact}</span>
                </div>
                <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>View Details →</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {!isLoading && doctorsToDisplay.length === 0 && (
          <div className="md:col-span-3 py-12 text-center animate-fade-in-up">
            <Stethoscope className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No doctors found.{' '}
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
