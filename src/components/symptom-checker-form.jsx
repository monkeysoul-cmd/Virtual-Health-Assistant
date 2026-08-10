'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { getHealthAssessment } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2, AlertCircle, Sparkles, Stethoscope, FileText, User,
  PlusCircle, X, Award, MapPin, Phone, Calendar, ChevronDown, ChevronUp,
  Activity, TrendingUp,
} from 'lucide-react';
import { PrecautionaryAdvice } from './precautionary-advice';
import { TestSuggestions } from './test-suggestions';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  doctors, commonSymptoms, commonConditions, conditionToSpecialty,
  precautions, fallbackPrescribedPlans, defaultPrescribedPlan,
} from '@/lib/data';
import { DoctorDetailsDialog } from './doctor-details-dialog';
import { DoctorAssistant } from './doctor-assistant';
import { PrescribedPlanCard } from './prescribed-plan-card';

const INDIAN_DOCTOR_NAMES = [
  'Dr. Aarav Mehta', 'Dr. Priya Sharma', 'Dr. Amit Patel',
  'Dr. Sneha Reddy', 'Dr. Sanjay Sen', 'Dr. Neha Gupta',
  'Dr. Vikram Malhotra', 'Dr. Kavita Joshi', 'Dr. Anil Verma', 'Dr. Divya Iyer',
];

// Likelihood bar with animated fill
function LikelihoodBar({ value, color = 'emerald' }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  const colorMap = {
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-yellow-400',
    rose: 'from-rose-500 to-red-400',
  };
  return (
    <div className="likelihood-bar-track w-full mt-1.5">
      <div
        className={`likelihood-bar-fill bg-gradient-to-r ${colorMap[color]}`}
        style={{ width: `${width}%`, transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 px-6 py-5 rounded-xl border-none btn-press"
    >
      {pending
        ? <><Loader2 className="animate-spin mr-2 w-4 h-4" />Analyzing...</>
        : <><Sparkles className="mr-2 w-4 h-4" />Assess Symptoms</>
      }
    </Button>
  );
}

const initialState = { potentialConditions: [], error: null };

export function SymptomCheckerForm() {
  const [state, formAction] = useFormState(getHealthAssessment, initialState);
  const [symptoms, setSymptoms] = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [doctorState, setDoctorState] = useState('idle');
  const [lastActionDetail, setLastActionDetail] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(initialState);
  const [apiKey, setApiKey] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Amit Patel');
  const [expandedOtherConditions, setExpandedOtherConditions] = useState({});
  const { toast } = useToast();
  const resultsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('vha_gemini_key');
      if (savedKey) setApiKey(savedKey);
    }
    const randomIndex = Math.floor(Math.random() * INDIAN_DOCTOR_NAMES.length);
    setDoctorName(INDIAN_DOCTOR_NAMES[randomIndex]);
  }, []);

  useEffect(() => {
    if (state.potentialConditions && state.potentialConditions.length > 0) {
      setAssessmentResult({ potentialConditions: state.potentialConditions, error: null });
      setDoctorState('success');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } else if (state.error) {
      toast({ variant: 'destructive', title: 'Submission Error', description: state.error });
      setAssessmentResult({ potentialConditions: [], error: state.error });
      setDoctorState('idle');
    }
  }, [state, toast]);

  const handleConsultClick = () => {
    document.getElementById('doctor-directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const addSymptom = (symptom) => {
    setSymptoms(prev => {
      const list = prev ? prev.split(', ').filter(s => s) : [];
      if (!list.map(s => s.toLowerCase()).includes(symptom.toLowerCase())) {
        list.push(symptom);
      }
      return list.join(', ');
    });
    setDoctorState('adding');
    setLastActionDetail(symptom);
  };

  const addConditionSymptoms = (condition) => {
    const conditionSymptoms = commonConditions[condition];
    if (conditionSymptoms) {
      setSymptoms(conditionSymptoms.join(', '));
      setDoctorState('adding');
      setLastActionDetail(condition);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setAssessmentResult(initialState);
    setDoctorState('cleared');
    setExpandedOtherConditions({});
  };




  const mostProbableCondition = assessmentResult.potentialConditions?.[0];
  const otherConditions = assessmentResult.potentialConditions?.slice(1);
  const recommendedDoctor = mostProbableCondition
    ? doctors.find(d => d.specialty === conditionToSpecialty[mostProbableCondition.condition])
    : null;

  return (
    <div className="w-full mx-auto space-y-8">

      {/* ─── Symptom Checker Card ─── */}
      <Card className="glass-card shadow-2xl border border-white/10 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <FileText className="text-primary w-6 h-6" />
            Symptom Checker
          </CardTitle>
          <CardDescription>
            Describe your symptoms below, or select from common symptoms and conditions.
            For example: "headache, fever, and cough".
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Common Symptoms */}
          <div className="mb-5">
            <h4 className="font-semibold mb-2.5 text-sm text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Common Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom, i) => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  style={{ animationDelay: `${i * 30}ms` }}
                  className="rounded-full bg-white/5 hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.45)] border-white/10 text-foreground transition-all duration-150 tag-pop animate-fade-in-up"
                  onClick={() => addSymptom(symptom)}
                >
                  <PlusCircle className="mr-1.5 w-3.5 h-3.5" />
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Common Conditions */}
          <div className="mb-5">
            <h4 className="font-semibold mb-2.5 text-sm text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              Common Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {['common cold', 'influenza (flu)', 'migraine', 'allergic rhinitis', 'tension headache', 'gastroenteritis'].map((condition, i) => (
                <Button
                  key={condition}
                  variant="outline"
                  size="sm"
                  style={{ animationDelay: `${i * 30}ms` }}
                  className="rounded-full bg-white/5 hover:bg-teal-500 hover:text-teal-950 hover:border-teal-400 hover:shadow-[0_0_14px_rgba(20,184,166,0.45)] border-white/10 text-foreground transition-all duration-150 tag-pop animate-fade-in-up"
                  onClick={() => addConditionSymptoms(condition)}
                >
                  <PlusCircle className="mr-1.5 w-3.5 h-3.5" />
                  {condition}
                </Button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={() => {
              setLastActionDetail(symptoms);
              setDoctorState('thinking');
            }}
            action={formAction}
            className="space-y-4"
          >
            <input type="hidden" name="apiKey" value={apiKey} />
            <div className="relative">
              <Textarea
                name="symptoms"
                placeholder="I'm experiencing..."
                className="min-h-[120px] text-base pr-12 bg-white/5 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-150 resize-none"
                required
                value={symptoms}
                onChange={e => {
                  setSymptoms(e.target.value);
                  if (doctorState !== 'typing' && e.target.value.trim().length > 0) {
                    setDoctorState('typing');
                  } else if (e.target.value.trim().length === 0) {
                    setDoctorState('idle');
                  }
                }}
              />
              {symptoms && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-150"
                  onClick={handleClear}
                  aria-label="Clear symptoms"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>

            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ─── Assessment Results ─── */}
      {assessmentResult.potentialConditions && assessmentResult.potentialConditions.length > 0 && (
        <Card
          ref={resultsRef}
          className="glass-card shadow-2xl border border-white/10 border-t-2 border-t-emerald-500 animate-card-reveal"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Stethoscope className="text-primary" />
              Assessment Results
            </CardTitle>
            <CardDescription>
              Based on your symptoms, here are some potential conditions. This is not a medical diagnosis.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">

            {/* ── Most Probable Condition ── */}
            {mostProbableCondition && (
              <>
                <div className="space-y-6 rounded-2xl border-2 border-emerald-400/70 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-teal-500/5 backdrop-blur-xl p-5 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.18)] relative overflow-hidden animate-pulse-glow animate-scale-in">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-500/8 rounded-full filter blur-2xl pointer-events-none" />

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-400 animate-spin-slow" />
                      <h3 className="text-2xl font-bold text-emerald-400 font-headline">
                        Top Recommendation
                      </h3>
                    </div>
                    <Badge
                      variant="default"
                      className="flex items-center gap-2 text-base px-4 py-1.5 bg-emerald-500 text-emerald-950 font-bold border-none shadow-lg shadow-emerald-500/30 animate-neon-border"
                    >
                      <Award className="w-4 h-4" />
                      <span>{mostProbableCondition.likelihood}% Match</span>
                    </Badge>
                  </div>

                  {/* Condition name */}
                  <div className="relative z-10">
                    <Badge
                      variant="secondary"
                      className="text-lg font-bold px-5 py-2.5 capitalize bg-white/5 border border-white/10 text-emerald-300"
                    >
                      {mostProbableCondition.condition}
                    </Badge>
                  </div>

                  {/* Likelihood bar */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Match confidence</span>
                      <span className="font-bold text-emerald-400">{mostProbableCondition.likelihood}%</span>
                    </div>
                    <LikelihoodBar value={mostProbableCondition.likelihood} color="emerald" />
                  </div>

                  <div className="relative z-10">
                    <PrecautionaryAdvice condition={mostProbableCondition} />
                  </div>
                  <div className="relative z-10">
                    <TestSuggestions conditions={[mostProbableCondition.condition]} />
                  </div>
                </div>

                <PrescribedPlanCard
                  plan={mostProbableCondition.prescribedPlan}
                  doctorName={doctorName}
                  conditionName={mostProbableCondition.condition}
                />
              </>
            )}

            {/* ── Other Possible Conditions ── */}
            {otherConditions && otherConditions.length > 0 && (
              <div className="space-y-4">
                <div className="glow-divider" />
                <h3 className="text-xl font-bold tracking-tight font-headline text-slate-100 pt-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-400" />
                  Other Possibilities
                </h3>

                <div className="space-y-3">
                  {otherConditions.map((item, index) => {
                    const isExpanded = !!expandedOtherConditions[index];
                    const barColor = item.likelihood >= 50 ? 'amber' : 'rose';
                    return (
                      <div
                        key={index}
                        style={{ animationDelay: `${index * 60}ms` }}
                        className="rounded-2xl border border-white/10 bg-slate-900/20 backdrop-blur-md p-5 transition-all duration-200 hover:border-white/20 hover:shadow-lg animate-slide-in-right"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                            <Badge
                              variant="secondary"
                              className="text-base font-bold px-4 py-1.5 capitalize bg-white/5 border border-white/10 text-indigo-300 shrink-0"
                            >
                              {item.condition}
                            </Badge>
                            <span className="text-sm font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 shrink-0">
                              {item.likelihood}% Match
                            </span>
                            {item.likelihood < 50 ? (
                              <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold px-2.5 py-0.5 shrink-0">
                                Low Likelihood
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-2.5 py-0.5 shrink-0">
                                Medium Likelihood
                              </Badge>
                            )}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedOtherConditions(prev => ({ ...prev, [index]: !prev[index] }))}
                            className="flex items-center gap-1.5 font-bold text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl px-3 py-2 transition-all duration-150 shrink-0 btn-press"
                          >
                            <span>{isExpanded ? 'Hide' : 'View Plan'}</span>
                            {isExpanded
                              ? <ChevronUp className="w-3.5 h-3.5" />
                              : <ChevronDown className="w-3.5 h-3.5" />
                            }
                          </Button>
                        </div>

                        {/* Likelihood bar */}
                        <div className="mt-3">
                          <LikelihoodBar value={item.likelihood} color={barColor} />
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-6 animate-fade-in-up">
                            <PrecautionaryAdvice condition={item} />
                            <TestSuggestions conditions={[item.condition]} />
                            {item.prescribedPlan && (
                              <PrescribedPlanCard
                                plan={item.prescribedPlan}
                                doctorName={doctorName}
                                conditionName={item.condition}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Recommended Doctor ── */}
            <Card className="glass-card bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 border-indigo-500/20 shadow-xl relative overflow-hidden animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <User className="text-primary" />
                  Next Steps: Consult a Professional
                </CardTitle>
                {recommendedDoctor ? (
                  <CardDescription>
                    Based on your assessment, we recommend consulting a specialist:
                  </CardDescription>
                ) : (
                  <CardDescription>
                    This AI assessment is a helpful first step, but it is not a substitute for professional medical advice. Please consult a qualified healthcare provider.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {recommendedDoctor && (
                  <Card
                    key={recommendedDoctor.id}
                    className="glass-card bg-white/5 border border-white/10 hover:border-emerald-500/40 shadow-lg mb-4 cursor-pointer card-hover"
                    onClick={() => {
                      setSelectedDoctorForBooking(recommendedDoctor);
                      setDoctorState('booking');
                    }}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-full transition-transform duration-200 group-hover:scale-110">
                        <recommendedDoctor.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-headline">{recommendedDoctor.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <span>{recommendedDoctor.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{recommendedDoctor.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{recommendedDoctor.contact}</span>
                      </div>
                      <div className="flex items-center justify-end text-sm font-medium text-primary pt-2 gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Book an Appointment</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleConsultClick}
                  className="btn-press hover:scale-[1.03] active:scale-[0.97] transition-all duration-150"
                >
                  {recommendedDoctor ? 'Find Other Doctors' : 'Find a Doctor'}
                </Button>
              </CardFooter>
            </Card>

            {/* Disclaimer */}
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground animate-fade-in-up">
              <AlertCircle className="h-4 w-4 !text-destructive" />
              <AlertTitle className="font-bold">Important Disclaimer</AlertTitle>
              <AlertDescription>
                This tool is for informational purposes only and does not constitute medical advice.
                Please consult with a qualified healthcare professional for any health concerns.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Doctor Details Dialog */}
      {selectedDoctorForBooking && (
        <DoctorDetailsDialog
          doctor={selectedDoctorForBooking}
          onClose={() => {
            setSelectedDoctorForBooking(null);
            setDoctorState('idle');
          }}
        />
      )}

      {/* Floating Doctor Assistant Widget */}
      <DoctorAssistant state={doctorState} details={lastActionDetail} doctorName={doctorName} />
    </div>
  );
}
