'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { getHealthAssessment, AssessmentState } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  AlertCircle,
  Sparkles,
  Stethoscope,
  FileText,
  User,
  PlusCircle,
  X,
  Award,
  MapPin,
  Phone,
  Calendar,
  BrainCircuit,
  Database,
} from 'lucide-react';
import { PrecautionaryAdvice } from './precautionary-advice';
import { TestSuggestions } from './test-suggestions';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { doctors, type Doctor } from '@/lib/data';
import { DoctorDetailsDialog } from './doctor-details-dialog';

function SubmitButton({ isAI }: { isAI: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : isAI ? (
        <BrainCircuit className="mr-2 h-4 w-4" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {pending ? 'Analyzing...' : isAI ? 'AI Analysis' : 'Standard Check'}
    </Button>
  );
}

const initialState: AssessmentState = {
  potentialConditions: [],
  error: null,
};

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Sore Throat', 'Congestion',
  'Stomach Pain', 'Nausea', 'Sneezing', 'Itching', 'Swelling',
  'Fatigue', 'Body Aches', 'Joint Pain', 'Chest Pain',
  'Breathing Difficulty', 'Excessive Thirst'
];

const conditionToSpecialty: { [key: string]: string } = {
  'common cold': 'General Practitioner',
  influenza: 'General Practitioner',
  'influenza (flu)': 'General Practitioner',
  migraine: 'Neurologist',
  'allergic rhinitis': 'General Practitioner',
  hypertension: 'Cardiologist',
  'type 2 diabetes': 'General Practitioner',
  asthma: 'General Practitioner',
  gastritis: 'General Practitioner',
  'anxiety disorder': 'Neurologist',
  osteoarthritis: 'Orthopedist',
  'acute bronchitis': 'General Practitioner',
  'typhoid fever': 'General Practitioner',
  pneumonia: 'General Practitioner',
  'acid reflux (gerd)': 'General Practitioner',
  malaria: 'General Practitioner',
  'dengue fever': 'General Practitioner',
  gastroenteritis: 'General Practitioner',
  allergy: 'General Practitioner',
  bronchitis: 'General Practitioner',
  'tension headache': 'Neurologist',
  sprain: 'Orthopedist',
  fracture: 'Orthopedist',
  'joint pain': 'Orthopedist',
  'chest pain': 'Cardiologist',
  'breathing difficulty': 'General Practitioner',
  'excessive thirst': 'General Practitioner',
};


export function SymptomCheckerForm() {
  const [state, formAction] = useFormState(getHealthAssessment, initialState);
  const [symptoms, setSymptoms] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Assessment Failed',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  const handleConsultClick = () => {
    document
      .getElementById('doctor-directory')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const addSymptom = (symptom: string) => {
    setSymptoms(prev => {
      const symptomList = prev ? prev.split(', ').filter(s => s) : [];
      if (!symptomList.map(s => s.toLowerCase()).includes(symptom.toLowerCase())) {
        symptomList.push(symptom);
      }
      return symptomList.join(', ');
    });
  };

  const mostProbableCondition = state.potentialConditions && state.potentialConditions[0];
  const otherConditions = state.potentialConditions && state.potentialConditions.slice(1);

  const recommendedDoctor = mostProbableCondition
    ? doctors.find(doctor => doctor.specialty === conditionToSpecialty[mostProbableCondition.condition.toLowerCase()])
    : null;

  return (
    <div className="w-full space-y-8 px-2 md:px-6">
      <Card className="bg-card/80 backdrop-blur-sm shadow-xl border-primary/20 w-full rounded-none md:rounded-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <FileText className="text-primary" />
                Symptom Checker
              </CardTitle>
              <CardDescription>
                Describe your symptoms below or select common ones.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
              <Database className={`h-4 w-4 ${!useAI ? 'text-primary' : 'text-muted-foreground'}`} />
              <Switch 
                id="ai-mode" 
                checked={useAI} 
                onCheckedChange={setUseAI}
              />
              <Label htmlFor="ai-mode" className="flex items-center gap-2 cursor-pointer font-semibold">
                <BrainCircuit className={`h-4 w-4 ${useAI ? 'text-primary' : 'text-muted-foreground'}`} />
                AI Analysis
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Quick Select
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(symptom => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  onClick={() => addSymptom(symptom)}
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="useAI" value={useAI.toString()} />
            <div className="relative">
              <Textarea
                name="symptoms"
                placeholder="Example: I've had a sharp headache and sensitivity to light for the past two days..."
                className="min-h-[140px] text-lg pr-12 focus-visible:ring-primary/50"
                required
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
              />
              {symptoms && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => setSymptoms('')}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <SubmitButton isAI={useAI} />
            </div>
          </form>
        </CardContent>
      </Card>

      {state.potentialConditions && state.potentialConditions.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-500 border-primary/30 w-full rounded-none md:rounded-lg">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Stethoscope className="text-primary" />
                Assessment Results
              </CardTitle>
              {state.isAI && (
                <Badge variant="default" className="bg-primary hover:bg-primary flex gap-1">
                  <BrainCircuit className="h-3 w-3" /> AI Generated
                </Badge>
              )}
            </div>
            <CardDescription className="text-foreground/70">
              Results based on {state.isAI ? 'Gemini AI intelligence' : 'local medical records'}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {mostProbableCondition && (
              <div className="space-y-6 rounded-xl border-2 border-primary/40 bg-background/40 p-6 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                   <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                      <Award className="h-6 w-6" />
                      Primary Assessment
                    </h3>
                  <Badge
                    variant="default"
                    className="flex items-center gap-2 text-lg px-4 py-1.5"
                  >
                    {mostProbableCondition.likelihood}% Confidence
                  </Badge>
                </div>
                <div className="py-2">
                  <span className="text-3xl font-black tracking-tight capitalize text-foreground">
                    {mostProbableCondition.condition}
                  </span>
                </div>
                <Separator className="bg-primary/10" />
                <PrecautionaryAdvice
                  conditions={[mostProbableCondition.condition.toLowerCase()]}
                />
                <TestSuggestions conditions={[mostProbableCondition.condition.toLowerCase()]} />
              </div>
            )}

            {otherConditions && otherConditions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                  Differential Considerations
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {otherConditions.map((item, index) => (
                    <div
                      key={index}
                      className="space-y-4 rounded-xl border bg-background/50 p-5 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold capitalize">
                          {item.condition}
                        </span>
                        <Badge variant="secondary" className="font-bold">
                          {item.likelihood}%
                        </Badge>
                      </div>
                      <PrecautionaryAdvice conditions={[item.condition.toLowerCase()]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Card className="bg-primary/5 border-dashed border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-xl">
                  <User className="text-primary h-6 w-6" />
                  Recommended Specialist
                </CardTitle>
                <CardDescription>
                  For a definitive diagnosis, we suggest scheduling a consultation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedDoctor ? (
                  <Card
                    className="bg-card shadow-md border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedDoctorForBooking(recommendedDoctor)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors">
                        <recommendedDoctor.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-headline text-xl">{recommendedDoctor.name}</CardTitle>
                        <p className="text-primary font-bold text-sm">{recommendedDoctor.specialty}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{recommendedDoctor.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{recommendedDoctor.contact}</span>
                      </div>
                       <div className="flex items-center justify-end text-sm font-bold text-primary gap-2 sm:col-start-3">
                        <Calendar className="w-4 h-4" />
                        <span>Book Visit</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-8 text-center border rounded-xl border-dashed">
                    <p className="text-muted-foreground mb-4">No specific specialist mapped for this rare result.</p>
                    <Button onClick={handleConsultClick} variant="outline">
                      Browse All Specialists
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert
              variant="destructive"
              className="bg-destructive/5 border-destructive/20 text-destructive-foreground"
            >
              <AlertCircle className="h-5 w-5 !text-destructive" />
              <AlertTitle className="font-bold text-lg mb-2">
                Medical Disclaimer
              </AlertTitle>
              <AlertDescription className="text-base">
                This AI-powered tool is for educational and informational purposes only. It is not a medical device or a substitute for professional diagnosis. If you are experiencing a medical emergency, please contact emergency services immediately.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {selectedDoctorForBooking && (
        <DoctorDetailsDialog
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
        />
      )}
    </div>
  );
}
