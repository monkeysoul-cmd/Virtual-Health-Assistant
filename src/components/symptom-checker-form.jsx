'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { getHealthAssessment } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Sparkles, Stethoscope, FileText, User, PlusCircle, X, Award, MapPin, Phone, Calendar, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { PrecautionaryAdvice } from './precautionary-advice';
import { TestSuggestions } from './test-suggestions';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { doctors, commonSymptoms, commonConditions, conditionToSpecialty, precautions, fallbackPrescribedPlans, defaultPrescribedPlan } from '@/lib/data';
import { DoctorDetailsDialog } from './doctor-details-dialog';
import { DoctorAssistant } from './doctor-assistant';
import { PrescribedPlanCard } from './prescribed-plan-card';

const INDIAN_DOCTOR_NAMES = [
  'Dr. Aarav Mehta',
  'Dr. Priya Sharma',
  'Dr. Amit Patel',
  'Dr. Sneha Reddy',
  'Dr. Sanjay Sen',
  'Dr. Neha Gupta',
  'Dr. Vikram Malhotra',
  'Dr. Kavita Joshi',
  'Dr. Anil Verma',
  'Dr. Divya Iyer'
];
function SubmitButton() {
    const { pending } = useFormStatus();
    return (<Button type="submit" disabled={pending} className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-6 py-5 rounded-xl border-none">
      {pending ? (<Loader2 className="animate-spin mr-2"/>) : (<Sparkles className="mr-2 w-4 h-4"/>)}
      Assess Symptoms
    </Button>);
}
const initialState = {
    potentialConditions: [],
    error: null,
};
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem('vha_gemini_key');
            if (savedKey) {
                setApiKey(savedKey);
            }
        }
        const randomIndex = Math.floor(Math.random() * INDIAN_DOCTOR_NAMES.length);
        setDoctorName(INDIAN_DOCTOR_NAMES[randomIndex]);
    }, []);

    useEffect(() => {
        if (state.potentialConditions && state.potentialConditions.length > 0) {
            setAssessmentResult({ potentialConditions: state.potentialConditions, error: null });
            setDoctorState('success');
        } else if (state.error) {
            toast({
                variant: 'destructive',
                title: 'Submission Error',
                description: state.error,
            });
            setAssessmentResult({ potentialConditions: [], error: state.error });
            setDoctorState('idle');
        }
    }, [state, toast]);

    const handleConsultClick = () => {
        var _a;
        (_a = document
            .getElementById('doctor-directory')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };

    const addSymptom = (symptom) => {
        setSymptoms(prev => {
            const symptomList = prev ? prev.split(', ').filter(s => s) : [];
            if (!symptomList.map(s => s.toLowerCase()).includes(symptom.toLowerCase())) {
                symptomList.push(symptom);
            }
            return symptomList.join(', ');
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

    const runFastAnalysis = () => {
        if (!symptoms || symptoms.trim().length < 3) {
            toast({
                variant: 'destructive',
                title: 'Describe symptoms',
                description: 'Please describe your symptoms in more detail first.',
            });
            return;
        }

        setLastActionDetail(symptoms);
        setDoctorState('thinking');
        
        setTimeout(() => {
            const inputWords = symptoms.toLowerCase().split(/[,\s\.\?]+/).map(w => w.trim()).filter(Boolean);
            const results = [];

            for (const [condition, symptomsList] of Object.entries(commonConditions)) {
                let matchCount = 0;
                symptomsList.forEach(symptom => {
                    const normalizedSymptom = symptom.toLowerCase();
                    if (symptoms.toLowerCase().includes(normalizedSymptom)) {
                        matchCount += 2;
                    } else {
                        const symptomWords = normalizedSymptom.split(/\s+/);
                        const hasWordMatch = inputWords.some(word => symptomWords.includes(word));
                        if (hasWordMatch) {
                            matchCount += 1;
                        }
                    }
                });

                if (matchCount > 0) {
                    const basePercentage = Math.round((matchCount / (symptomsList.length * 2)) * 100);
                    const likelihood = Math.min(95, Math.max(15, basePercentage));
                    results.push({ condition, likelihood, score: matchCount });
                }
            }

            results.sort((a, b) => b.score !== a.score ? b.score - a.score : b.likelihood - a.likelihood);
            
            let topConditions = results.slice(0, 3).map(({ condition, likelihood }) => {
                const matchedPrecaution = precautions.find(
                    p => p.condition.toLowerCase() === condition.toLowerCase()
                );
                const matchedPlan = fallbackPrescribedPlans[condition.toLowerCase()] || defaultPrescribedPlan;
                return {
                    condition,
                    likelihood,
                    precautions: matchedPrecaution ? matchedPrecaution.advice : [
                        'Rest and stay hydrated.',
                        'Monitor your symptoms closely.',
                        'Consult a healthcare professional if symptoms worsen.'
                    ],
                    prescribedPlan: matchedPlan
                };
            });

            if (topConditions.length === 0) {
                const defaultPrecaution = precautions.find(p => p.condition === 'common cold');
                topConditions.push({
                    condition: 'common cold',
                    likelihood: 35,
                    precautions: defaultPrecaution ? defaultPrecaution.advice : [
                        'Get plenty of rest and drink warm liquids.',
                        'Use a humidifier or take a steamy shower.',
                        'Wash hands frequently to avoid spreading.'
                    ]
                });
            }

            setAssessmentResult({ potentialConditions: topConditions, error: null });
            setDoctorState('success');
            
            toast({
                title: 'Fast Analysis Complete',
                description: 'Local symptom database matching completed instantly.',
            });
        }, 1000);
    };

    const mostProbableCondition = assessmentResult.potentialConditions && assessmentResult.potentialConditions[0];
    const otherConditions = assessmentResult.potentialConditions && assessmentResult.potentialConditions.slice(1);
    const recommendedDoctor = mostProbableCondition
        ? doctors.find(doctor => doctor.specialty === conditionToSpecialty[mostProbableCondition.condition])
        : null;

    return (
      <div className="w-full mx-auto space-y-8">
            <Card className="glass-card shadow-2xl border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                  <FileText className="text-primary"/>
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
                    {commonSymptoms.map(symptom => (<Button key={symptom} variant="outline" size="sm" className="rounded-full bg-white/5 hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] border-white/10 text-foreground transition-all duration-200" onClick={() => addSymptom(symptom)}>
                        <PlusCircle className="mr-2 w-4 h-4"/>
                        {symptom}
                      </Button>))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                    Common Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['common cold', 'influenza (flu)', 'migraine', 'allergic rhinitis', 'tension headache', 'gastroenteritis'].map(condition => (<Button key={condition} variant="outline" size="sm" className="rounded-full bg-white/5 hover:bg-teal-500 hover:text-teal-950 hover:border-teal-400 hover:shadow-[0_0_12px_rgba(20,184,166,0.4)] border-white/10 text-foreground transition-all duration-200" onClick={() => addConditionSymptoms(condition)}>
                        <PlusCircle className="mr-2 w-4 h-4"/>
                        {condition}
                      </Button>))}
                  </div>
                </div>

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
                    <Textarea name="symptoms" placeholder="I'm experiencing..." className="min-h-[120px] text-base pr-12 bg-white/5 border-white/10 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all duration-200" required value={symptoms} onChange={e => {
                      setSymptoms(e.target.value);
                      if (doctorState !== 'typing' && e.target.value.trim().length > 0) {
                        setDoctorState('typing');
                      } else if (e.target.value.trim().length === 0) {
                        setDoctorState('idle');
                      }
                    }}/>
                    {symptoms && (<Button variant="ghost" size="icon" type="button" className="absolute right-2 top-2 h-8 w-8 rounded-full hover:bg-white/10" onClick={handleClear} aria-label="Clear symptoms">
                        <X className="h-5 w-5 text-muted-foreground"/>
                      </Button>)}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button 
                      type="button" 
                      onClick={runFastAnalysis}
                      className="bg-transparent border border-teal-500/40 text-teal-400 hover:bg-teal-500 hover:text-teal-950 font-semibold shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-6 py-5 rounded-xl flex items-center justify-center gap-2 h-10"
                    >
                      <Zap className="w-4 h-4 animate-pulse" />
                      Fast Analyze
                    </Button>
                    <SubmitButton />
                  </div>
                </form>
              </CardContent>
            </Card>

      {assessmentResult.potentialConditions && assessmentResult.potentialConditions.length > 0 && (<Card className="glass-card shadow-2xl border border-white/10 border-t-2 border-t-emerald-500 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Stethoscope className="text-primary"/>
              Assessment Results
            </CardTitle>
            <CardDescription>
              Based on your symptoms, here are some potential conditions. This is
              not a medical diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Most Probable Condition (Highlighted Top Recommendation) */}
            {mostProbableCondition && (<>
              <div className="space-y-6 rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-teal-500/5 backdrop-blur-xl p-5 md:p-8 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative overflow-hidden animate-pulse-glow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-400 animate-spin-slow"/>
                      <h3 className="text-2xl font-bold text-emerald-400 font-headline">
                         Top Recommendation
                       </h3>
                   </div>
                  <Badge variant="default" className="flex items-center gap-2 text-base px-4 py-1.5 bg-emerald-500 text-emerald-950 font-bold border-none shadow-lg shadow-emerald-500/30">
                    <Award className="w-5 h-5"/>
                    <span>{mostProbableCondition.likelihood}% Match</span>
                  </Badge>
                </div>
                <div className="relative z-10">
                  <Badge variant="secondary" className="text-lg font-bold px-5 py-2.5 capitalize bg-white/5 border border-white/10 text-emerald-300">
                    {mostProbableCondition.condition}
                  </Badge>
                </div>
                <div className="relative z-10">
                  <PrecautionaryAdvice condition={mostProbableCondition}/>
                </div>
                <div className="relative z-10">
                  <TestSuggestions conditions={[mostProbableCondition.condition]}/>
                </div>
              </div>
              <PrescribedPlanCard plan={mostProbableCondition.prescribedPlan} doctorName={doctorName} conditionName={mostProbableCondition.condition} />
            </>)}

            {/* Other Potential Conditions */}
            {otherConditions && otherConditions.length > 0 && (
              <div className="space-y-4">
                <Separator />
                <h3 className="text-xl font-bold tracking-tight font-headline text-slate-100 pt-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-400" />
                  Other Possibilities
                </h3>
                
                <div className="space-y-4">
                  {otherConditions.map((item, index) => {
                    const isExpanded = !!expandedOtherConditions[index];
                    return (
                      <div key={index} className="rounded-2xl border border-white/10 bg-slate-900/20 backdrop-blur-md p-5 transition-all duration-300 hover:border-white/15">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Badge variant="secondary" className="text-base font-bold px-4 py-1.5 capitalize bg-white/5 border border-white/10 text-indigo-300">
                              {item.condition}
                            </Badge>
                            <span className="text-sm font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                              {item.likelihood}% Match
                            </span>
                            {item.likelihood < 50 ? (
                              <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold px-2.5 py-0.5 shadow-sm">
                                Low Recommendation
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold px-2.5 py-0.5 shadow-sm">
                                Medium Recommendation
                              </Badge>
                            )}
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExpandedOtherConditions(prev => ({
                                ...prev,
                                [index]: !prev[index]
                              }));
                            }}
                            className="flex items-center gap-1.5 font-bold text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl px-3 py-2 transition-all duration-200"
                          >
                            <span>{isExpanded ? 'Hide Details' : 'View Care Plan & Advice'}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-6 animate-fade-in-up">
                            <div>
                              <PrecautionaryAdvice condition={item} />
                            </div>
                            <div>
                              <TestSuggestions conditions={[item.condition]} />
                            </div>
                            {item.prescribedPlan && (
                              <div>
                                <PrescribedPlanCard plan={item.prescribedPlan} doctorName={doctorName} conditionName={item.condition} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <Card className="glass-card bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 border-indigo-500/20 shadow-xl relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <User className="text-primary"/>
                  Next Steps: Consult a Professional
                </CardTitle>
                {recommendedDoctor ? (<CardDescription>
                    For an accurate diagnosis, we recommend consulting a specialist. Based on your assessment, here is a recommended doctor:
                  </CardDescription>) : (<CardDescription>
                    This AI assessment is a helpful first step, but it is not a
                    substitute for professional medical advice. For an accurate
                    diagnosis and treatment plan, please consult a qualified
                    healthcare provider.
                  </CardDescription>)}
              </CardHeader>
              <CardContent>
                {recommendedDoctor && (<Card key={recommendedDoctor.id} className="glass-card bg-white/5 border border-white/10 hover:border-emerald-500/30 shadow-lg mb-4 cursor-pointer transform hover:scale-[1.02] transition-all duration-300" onClick={() => {
                  setSelectedDoctorForBooking(recommendedDoctor);
                  setDoctorState('booking');
                }}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <recommendedDoctor.icon className="w-6 h-6 text-primary"/>
                      </div>
                      <div>
                        <CardTitle className="font-headline">{recommendedDoctor.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-primary"/>
                        <span>{recommendedDoctor.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary"/>
                        <span>{recommendedDoctor.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary"/>
                        <span>{recommendedDoctor.contact}</span>
                      </div>
                       <div className="flex items-center justify-end text-sm font-medium text-primary pt-2 gap-2">
                        <Calendar className="w-4 h-4"/>
                        <span>Book an Appointment</span>
                      </div>
                    </CardContent>
                  </Card>)}
              </CardContent>
              <CardFooter>
                <Button onClick={handleConsultClick}>
                  {recommendedDoctor ? 'Find Other Doctors' : 'Find a Doctor'}
                </Button>
              </CardFooter>
            </Card>
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
              <AlertCircle className="h-4 w-4 !text-destructive"/>
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
        </Card>)}

      {selectedDoctorForBooking && (<DoctorDetailsDialog doctor={selectedDoctorForBooking} onClose={() => {
        setSelectedDoctorForBooking(null);
        setDoctorState('idle');
      }}/>)}
      
      {/* Floating Doctor Assistant Mascot Widget */}
      <DoctorAssistant state={doctorState} details={lastActionDetail} doctorName={doctorName} />
    </div>);
}
