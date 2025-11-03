'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getHealthAssessment, AssessmentState } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
} from 'lucide-react';
import { PrecautionaryAdvice } from './precautionary-advice';
import { TestSuggestions } from './test-suggestions';
import { Badge } from './ui/badge';

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

export function SymptomCheckerForm() {
  const [state, formAction] = useFormState(getHealthAssessment, initialState);
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <FileText className="text-primary" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Describe your symptoms below, and our AI assistant will provide
            potential insights. For example: "headache, fever, and cough".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="symptoms"
              placeholder="I'm experiencing..."
              className="min-h-[120px] text-base"
              required
            />
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
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Probable Conditions:
              </h3>
              <div className="flex flex-wrap gap-3">
                {state.potentialConditions.map((condition, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base font-medium px-4 py-2 capitalize"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <PrecautionaryAdvice conditions={state.potentialConditions} />
            <TestSuggestions conditions={state.potentialConditions} />

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
