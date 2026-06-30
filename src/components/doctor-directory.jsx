'use client';
import { useState, useEffect } from 'react';
import { doctors } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Search, Stethoscope, X, Sparkles, Loader2 } from 'lucide-react';
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

    // Load API Key on mount and sync with localStorage updates
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem('vha_gemini_key');
            if (savedKey) {
                setApiKey(savedKey);
            }
            
            const handleStorageUpdate = () => {
                const updatedKey = localStorage.getItem('vha_gemini_key');
                if (updatedKey !== null) {
                    setApiKey(updatedKey);
                }
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
            toast({
                variant: 'destructive',
                title: 'AI Search Failed',
                description: result.error,
            });
        } else if (result.doctors) {
            const doctorsWithIcons = result.doctors.map((doc, idx) => ({
                id: `ai-${idx}`,
                ...doc,
                icon: Stethoscope,
            }));
            setAiDoctors(doctorsWithIcons);
            toast({
                title: 'Search Completed',
                description: `Found ${result.doctors.length} doctors matching your search.`,
            });
        }
    };

    const filteredDoctors = doctors.filter(doctor => 
        doctor.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const doctorsToDisplay = isAiMode ? aiDoctors : filteredDoctors;

    return (<section className="w-full mx-auto py-8 md:py-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-gradient">
          Find a Doctor
        </h2>
        <p className="text-muted-foreground md:text-xl/relaxed font-medium">
          Search our directory of specialists in your area.
        </p>
      </div>

      {/* Tabs selection */}
      <div className="mt-8 flex justify-center gap-4">
        <Button 
          type="button" 
          variant={!isAiMode ? "default" : "outline"} 
          className="rounded-full"
          onClick={() => {
            setIsAiMode(false);
            setSearchQuery('');
          }}
        >
          Local Directory
        </Button>
        <Button 
          type="button" 
          variant={isAiMode ? "default" : "outline"} 
          className="rounded-full flex items-center gap-1.5"
          onClick={() => {
            setIsAiMode(true);
            setSearchQuery('');
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Finder
        </Button>
      </div>

      {/* Search Input Box */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
            <Input 
              type="text" 
              placeholder={isAiMode ? "Search any area in India (e.g. Noida Sector 62)" : "Search by area (e.g., Ghaziabad)"} 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && isAiMode) {
                  handleAiSearch();
                }
              }}
              className="pl-10 pr-10 bg-white/5 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200" 
              aria-label="Search doctors by area"
            />
            {searchQuery && (<Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-white/10" onClick={() => {
              setSearchQuery('');
              setAiDoctors([]);
            }} aria-label="Clear search">
                <X className="h-5 w-5 text-muted-foreground"/>
              </Button>)}
          </div>
          {isAiMode && (
            <Button 
              onClick={handleAiSearch} 
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-semibold"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search AI'}
            </Button>
          )}
        </div>
      </div>

      {/* Cards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isLoading ? (
          <div className="text-center py-12 md:col-span-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" />
            <p className="text-muted-foreground">Querying clinical directories near "{searchQuery}"...</p>
          </div>
        ) : (
          doctorsToDisplay.map(doctor => (<Card key={doctor.id} className="glass-card bg-card/40 border border-white/10 hover:border-emerald-500/30 transform hover:scale-[1.03] transition-all duration-300 shadow-xl cursor-pointer" onClick={() => setSelectedDoctor(doctor)}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  {doctor.icon ? (
                    <doctor.icon className="w-6 h-6 text-primary" />
                  ) : (
                    <Stethoscope className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <CardTitle className="font-headline">{doctor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Stethoscope className="w-4 h-4 text-primary"/>
                  <span>{doctor.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary"/>
                  <span>{doctor.area}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary"/>
                  <span>{doctor.contact}</span>
                </div>
              </CardContent>
            </Card>))
        )}
        {!isLoading && doctorsToDisplay.length === 0 && (
          <p className="text-center text-muted-foreground md:col-span-3 py-6">
            No doctors found. Try {isAiMode ? "broadening your search term (e.g. Delhi)" : `searching for another area`}.
          </p>
        )}
      </div>
      {selectedDoctor && (<DoctorDetailsDialog doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)}/>)}
    </section>);
}

