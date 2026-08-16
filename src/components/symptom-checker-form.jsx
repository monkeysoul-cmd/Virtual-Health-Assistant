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
  Activity, TrendingUp, Star,
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

/* ── Animated Likelihood Bar ── */
function LikelihoodBar({ value, color = 'emerald' }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  const colorMap = {
    emerald: 'from-emerald-500 to-teal-400',
    amber:   'from-amber-500 to-yellow-400',
    rose:    'from-rose-500 to-red-400',
  };
  return (
    <div className="likelihood-bar-track w-full mt-1.5">
      <div
        className={`likelihood-bar-fill bg-gradient-to-r ${colorMap[color]}`}
        style={{ width: `${width}%`, transition: 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}

/* ── Submit Button ── */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cta-btn-primary shimmer-btn disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
    >
      {pending ? (
        <><Loader2 className="animate-spin w-4 h-4" />Analysing…</>
      ) : (
        <><Sparkles className="w-4 h-4" />Assess Symptoms</>
      )}
    </button>
  );
}

const initialState = { potentialConditions: [], error: null };

export function SymptomCheckerForm() {
  const [state, formAction]                           = useFormState(getHealthAssessment, initialState);
  const [symptoms, setSymptoms]                       = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [doctorState, setDoctorState]                 = useState('idle');
  const [lastActionDetail, setLastActionDetail]       = useState('');
  const [assessmentResult, setAssessmentResult]       = useState(initialState);
  const [apiKey, setApiKey]                           = useState('');
  const [doctorName, setDoctorName]                   = useState('Dr. Amit Patel');
  const [expandedOtherConditions, setExpandedOtherConditions] = useState({});
  const { toast } = useToast();
  const resultsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('vha_gemini_key');
      if (savedKey) setApiKey(savedKey);
    }
    setDoctorName(INDIAN_DOCTOR_NAMES[Math.floor(Math.random() * INDIAN_DOCTOR_NAMES.length)]);
  }, []);

  useEffect(() => {
    if (state.potentialConditions?.length > 0) {
      setAssessmentResult({ potentialConditions: state.potentialConditions, error: null });
      setDoctorState('success');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } else if (state.error) {
      toast({ variant: 'destructive', title: 'Submission Error', description: state.error });
      setAssessmentResult({ potentialConditions: [], error: state.error });
      setDoctorState('idle');
    }
  }, [state, toast]);

  const handleConsultClick = () => document.getElementById('doctor-directory')?.scrollIntoView({ behavior: 'smooth' });

  const addSymptom = (symptom) => {
    setSymptoms(prev => {
      const list = prev ? prev.split(', ').filter(s => s) : [];
      if (!list.map(s => s.toLowerCase()).includes(symptom.toLowerCase())) list.push(symptom);
      return list.join(', ');
    });
    setDoctorState('adding');
    setLastActionDetail(symptom);
  };

  const addConditionSymptoms = (condition) => {
    const cs = commonConditions[condition];
    if (cs) {
      setSymptoms(cs.join(', '));
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
  const otherConditions        = assessmentResult.potentialConditions?.slice(1);
  const recommendedDoctor      = mostProbableCondition
    ? doctors.find(d => d.specialty === conditionToSpecialty[mostProbableCondition.condition])
    : null;

  return (
    <div className="w-full mx-auto space-y-8">

      {/* ─── Symptom Checker Card ─── */}
      <div className="glass-panel rounded-2xl border border-white/8 shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Top accent strip */}
        <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-emerald-500/15 border border-emerald-500/25 p-3 rounded-2xl shrink-0">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-2xl text-white">Symptom Checker</h2>
              <p className="text-slate-400 text-sm mt-1">
                Describe your symptoms or select from the quick-add options below.
              </p>
            </div>
          </div>

          {/* Common Symptoms */}
          <div className="mb-5">
            <h4 className="font-semibold mb-3 text-xs text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Common Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom, i) => (
                <button
                  key={symptom}
                  type="button"
                  style={{ animationDelay: `${i * 25}ms` }}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-400 hover:shadow-[0_0_14px_rgba(16,185,129,0.4)] transition-all duration-150 tag-pop animate-fade-in-up flex items-center gap-1.5"
                  onClick={() => addSymptom(symptom)}
                >
                  <PlusCircle className="w-3 h-3" />
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Common Conditions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-xs text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Common Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {['common cold', 'influenza (flu)', 'migraine', 'allergic rhinitis', 'tension headache', 'gastroenteritis'].map((condition, i) => (
                <button
                  key={condition}
                  type="button"
                  style={{ animationDelay: `${i * 25}ms` }}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-500 hover:text-indigo-950 hover:border-indigo-400 hover:shadow-[0_0_14px_rgba(99,102,241,0.4)] transition-all duration-150 tag-pop animate-fade-in-up flex items-center gap-1.5"
                  onClick={() => addConditionSymptoms(condition)}
                >
                  <PlusCircle className="w-3 h-3" />
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={() => { setLastActionDetail(symptoms); setDoctorState('thinking'); }}
            action={formAction}
            className="space-y-4"
          >
            <input type="hidden" name="apiKey" value={apiKey} />
            <div className="relative">
              <Textarea
                name="symptoms"
                placeholder="I'm experiencing headache, mild fever, and a sore throat for 2 days…"
                className="min-h-[130px] text-sm pr-12 bg-slate-900 text-slate-100 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/50 transition-all duration-200 resize-none rounded-xl placeholder:text-slate-600"
                required
                value={symptoms}
                onChange={e => {
                  setSymptoms(e.target.value);
                  if (doctorState !== 'typing' && e.target.value.trim().length > 0) setDoctorState('typing');
                  else if (e.target.value.trim().length === 0) setDoctorState('idle');
                }}
              />
              {symptoms && (
                <button
                  type="button"
                  className="absolute right-3 top-3 h-7 w-7 rounded-full hover:bg-white/10 transition-all duration-150 flex items-center justify-center"
                  onClick={handleClear}
                  aria-label="Clear symptoms"
                >
                  <X className="h-3.5 w-3.5 text-slate-400" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-slate-600">
                {symptoms.length > 0 ? `${symptoms.split(',').filter(s => s.trim()).length} symptom(s) added` : 'No symptoms added yet'}
              </p>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>

      {/* ─── Assessment Results ─── */}
      {assessmentResult.potentialConditions?.length > 0 && (
        <div
          ref={resultsRef}
          className="glass-panel rounded-2xl border border-white/8 shadow-2xl overflow-hidden animate-card-reveal"
        >
          {/* Top accent with emerald */}
          <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/15 border border-emerald-500/25 p-3 rounded-2xl">
                <Stethoscope className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-headline font-bold text-2xl text-white">Assessment Results</h2>
                <p className="text-slate-400 text-sm mt-0.5">Based on your reported symptoms — not a medical diagnosis.</p>
              </div>
            </div>

            {/* ── Most Probable Condition ── */}
            {mostProbableCondition && (
              <>
                <div className="relative rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-500/12 via-emerald-500/5 to-teal-500/5 p-5 md:p-7 overflow-hidden animate-pulse-glow animate-scale-in">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/8 rounded-full filter blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-teal-500/6 rounded-full filter blur-2xl pointer-events-none" />

                  {/* Top row */}
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                      <h3 className="text-xl font-bold text-emerald-400 font-headline">Top Recommendation</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500 text-emerald-950 px-3.5 py-1.5 rounded-full font-bold text-sm shadow-lg shadow-emerald-500/30 animate-neon-border">
                      <Award className="w-4 h-4" />
                      {mostProbableCondition.likelihood}% Match
                    </div>
                  </div>

                  {/* Condition name */}
                  <div className="relative z-10 mb-4">
                    <span className="condition-badge text-base">
                      {mostProbableCondition.condition}
                    </span>
                  </div>

                  {/* Likelihood bar */}
                  <div className="relative z-10 mb-5">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Match confidence</span>
                      <span className="font-bold text-emerald-400">{mostProbableCondition.likelihood}%</span>
                    </div>
                    <LikelihoodBar value={mostProbableCondition.likelihood} color="emerald" />
                  </div>

                  <div className="relative z-10">
                    <PrecautionaryAdvice condition={mostProbableCondition} />
                  </div>
                  <div className="relative z-10 mt-4">
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
            {otherConditions?.length > 0 && (
              <div className="space-y-4">
                <div className="glow-divider" />
                <h3 className="text-lg font-bold tracking-tight font-headline text-slate-100 pt-2 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-400" />
                  Other Possibilities
                </h3>

                <div className="space-y-3">
                  {otherConditions.map((item, index) => {
                    const isExpanded = !!expandedOtherConditions[index];
                    const barColor   = item.likelihood >= 50 ? 'amber' : 'rose';
                    return (
                      <div
                        key={index}
                        style={{ animationDelay: `${index * 60}ms` }}
                        className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-md p-5 transition-all duration-200 hover:border-white/15 animate-slide-in-right"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm font-bold px-4 py-1.5 capitalize rounded-full bg-white/5 border border-white/10 text-indigo-300">
                              {item.condition}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5 shrink-0">
                              {item.likelihood}% Match
                            </span>
                            {item.likelihood < 50 ? (
                              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold px-2.5 py-0.5 rounded-full shrink-0">Low</span>
                            ) : (
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full shrink-0">Medium</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedOtherConditions(prev => ({ ...prev, [index]: !prev[index] }))}
                            className="flex items-center gap-1.5 font-bold text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl px-3 py-2 transition-all duration-150 shrink-0 btn-press"
                          >
                            <span>{isExpanded ? 'Hide' : 'View Plan'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="mt-3">
                          <LikelihoodBar value={item.likelihood} color={barColor} />
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/8 space-y-4 animate-fade-in-up">
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
            <div className="glass-card rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/8 via-transparent to-emerald-500/5 shadow-xl relative overflow-hidden animate-slide-in-left">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/6 rounded-full filter blur-3xl pointer-events-none" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-indigo-500/15 border border-indigo-500/25 p-2.5 rounded-xl">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-white">Next Steps: See a Professional</h3>
                </div>
                <p className="text-slate-400 text-sm mb-5">
                  {recommendedDoctor
                    ? 'Based on your assessment, we recommend this specialist:'
                    : 'This AI assessment is a helpful first step. Please consult a qualified healthcare provider.'}
                </p>

                {recommendedDoctor && (
                  <div
                    className="doctor-card mb-4 cursor-pointer"
                    onClick={() => { setSelectedDoctorForBooking(recommendedDoctor); setDoctorState('booking'); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="avatar-ring">
                        <div className="avatar-inner">
                          <recommendedDoctor.icon className="w-5 h-5 text-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-headline font-bold text-base text-white">{recommendedDoctor.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          ))}
                          <span className="text-xs text-slate-500 ml-1">4.0</span>
                        </div>
                      </div>
                      <span className="avail-dot shrink-0" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{recommendedDoctor.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{recommendedDoctor.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{recommendedDoctor.contact}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2 text-sm font-semibold text-emerald-400">
                      <Calendar className="w-4 h-4" />
                      Book an Appointment →
                    </div>
                  </div>
                )}

                <button
                  onClick={handleConsultClick}
                  className="cta-btn-secondary text-sm py-2.5 px-5 w-full sm:w-auto justify-center"
                >
                  {recommendedDoctor ? 'Find Other Doctors' : 'Find a Doctor'}
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-rose-400 mb-0.5">Important Disclaimer</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This tool is for informational purposes only and does not constitute medical advice.
                  Please consult with a qualified healthcare professional for any health concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Dialog */}
      {selectedDoctorForBooking && (
        <DoctorDetailsDialog
          doctor={selectedDoctorForBooking}
          onClose={() => { setSelectedDoctorForBooking(null); setDoctorState('idle'); }}
        />
      )}

      {/* Floating Doctor Assistant Widget */}
      <DoctorAssistant state={doctorState} details={lastActionDetail} doctorName={doctorName} />
    </div>
  );
}
