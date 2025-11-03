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
} from 'lucide-react';
import { PrecautionaryAdvice } from './precautionary-advice';
import { TestSuggestions } from './test-suggestions';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Sparkles className="mr-2" />
      )}
      Assess Symptoms
    </Button>
  );
}

const initialState: AssessmentState = {
  potentialConditions: [],
  error: null,
};

const commonSymptoms = [
  'Fever',
  'Cough',
  'Headache',
  'Sore Throat',
  'Congestion',
  'Stomach Pain',
  'Nausea',
  'Sneezing',
  'Itching',
  'Swelling',
  'Fatigue',
  'Body Aches',
  'Joint Pain',
  'Headache and Dizziness',
  'Chest Pain',
  'Breathing Difficulty',
  'Excessive Thirst',
];

const commonConditions: { [key: string]: string[] } = {
  'Common Cold': ['runny nose', 'sneezing', 'sore throat', 'cough'],
  'Influenza (Flu)': ['high fever', 'chills', 'muscle aches', 'fatigue'],
  Migraine: ['one-sided headache', 'throbbing pain', 'photophobia'],
  'Allergic Rhinitis': ['sneezing', 'runny nose', 'itchy eyes'],
  Gastritis: ['stomach pain', 'nausea', 'bloating'],
  'Tension Headache': ['dull head pain', 'pressure around forehead'],
  Sprain: ['swelling', 'bruising', 'limited mobility'],
  Gastroenteritis: ['diarrhea', 'vomiting', 'stomach cramps'],
};

export function SymptomCheckerForm() {
  const [state, formAction] = useFormState(getHealthAssessment, initialState);
  const [symptoms, setSymptoms] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Submission Error',
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

  const addConditionSymptoms = (condition: string) => {
    const conditionSymptoms = commonConditions[condition];
    if (conditionSymptoms) {
      setSymptoms(conditionSymptoms.join(', '));
    }
  };

  const mostProbableCondition =
    state.potentialConditions && state.potentialConditions[0];
  const otherConditions =
    state.potentialConditions && state.potentialConditions.slice(1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <FileText className="text-primary" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Describe your symptoms below, or select from the common symptoms and conditions.
            For example: "headache, fever, and cough".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Common Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(symptom => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => addSymptom(symptom)}
                >
                  <PlusCircle className="mr-2" />
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Common Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(commonConditions).map(condition => (
                <Button
                  key={condition}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => addConditionSymptoms(condition)}
                >
                  <PlusCircle className="mr-2" />
                  {condition}
                </Button>
              ))}
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="relative">
              <Textarea
                name="symptoms"
                placeholder="I'm experiencing..."
                className="min-h-[120px] text-base pr-12"
                required
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
              />
              {symptoms && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={() => setSymptoms('')}
                  aria-label="Clear symptoms"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {state.potentialConditions && state.potentialConditions.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Stethoscope className="text-primary" />
              Assessment Results
            </CardTitle>
            <CardDescription>
              Based on your symptoms, here are some potential conditions. This is
              not a medical diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Most Probable Condition */}
            {mostProbableCondition && (
              <div className="space-y-6 rounded-lg border-2 border-primary bg-background/50 p-4 md:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                   <h3 className="text-xl font-semibold">
                      Most Probable Condition
                    </h3>
                  <Badge
                    variant="default"
                    className="flex items-center gap-2 text-base px-3 py-1"
                  >
                    <Award className="w-5 h-5" />
                    <span>{mostProbableCondition.likelihood}% Match</span>
                  </Badge>
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className="text-base font-medium px-4 py-2 capitalize"
                  >
                    {mostProbableCondition.condition}
                  </Badge>
                </div>
                <PrecautionaryAdvice
                  conditions={[mostProbableCondition.condition]}
                />
                <TestSuggestions conditions={[mostProbableCondition.condition]} />
              </div>
            )}

            {/* Other Potential Conditions */}
            {otherConditions && otherConditions.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <h3 className="text-xl font-semibold pt-4">Other Possibilities</h3>
                {otherConditions.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-lg border bg-background/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-base font-medium px-4 py-2 capitalize"
                      >
                        {item.condition}
                      </Badge>
                      <span className='text-sm font-medium text-muted-foreground'>{item.likelihood}% Match</span>
                    </div>
                    <PrecautionaryAdvice conditions={[item.condition]} />
                    <TestSuggestions conditions={[item.condition]} />
                  </div>
                ))}
              </div>
            )}
            
            <Card className="bg-primary/10 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <User className="text-primary" />
                  Next Steps: Consult a Professional
                </CardTitle>
                <CardDescription>
                  This AI assessment is a helpful first step, but it is not a
                  substitute for professional medical advice. For an accurate
                  diagnosis and treatment plan, please consult a qualified
                  healthcare provider.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={handleConsultClick}>Find a Doctor</Button>
              </CardFooter>
            </Card>
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/50 text-destructive-foreground"
            >
              <AlertCircle className="h-4 w-4 !text-destructive" />
              <AlertTitle className="font-bold">
                Important Disclaimer
              </AlertTitle>
              <AlertDescription>
                This tool is for informational purposes only and does not
                constitute medical advice. Please consult with a qualified
                healthcare professional for any health concerns or before making
                any decisions related to your health.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
