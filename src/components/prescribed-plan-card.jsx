'use client';
import { useEffect, useState } from 'react';
import { 
  Pill, Apple, Activity, AlertTriangle, FileText, ClipboardList, CheckSquare, 
  GlassWater, Bed, Moon, Clock, UserCheck, Utensils, Soup, Ban, 
  CheckCircle2, Flame, Dumbbell, Timer, Heart, Wind, Thermometer, Brain, 
  FlaskConical, Star, HeartCrack, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { testSuggestions } from '@/lib/data';

const getItemIcon = (text, defaultIcon) => {
  const lower = text.toLowerCase();
  if (lower.includes('doctor') || lower.includes('physician') || lower.includes('specialist') || lower.includes('consult') || lower.includes('medical board') || lower.includes('appointment')) return UserCheck;
  if (lower.includes('sleep') || lower.includes('rest') || lower.includes('bed') || lower.includes('night') || lower.includes('recuperate')) return Bed;
  if (lower.includes('water') || lower.includes('fluid') || lower.includes('liquid') || lower.includes('hydrate') || lower.includes('drink') || lower.includes('tea') || lower.includes('soup') || lower.includes('juice') || lower.includes('beverage') || lower.includes('soup') || lower.includes('broth')) return GlassWater;
  if (lower.includes('pill') || lower.includes('medication') || lower.includes('drug') || lower.includes('tablet') || lower.includes('prescription') || lower.includes('paracetamol') || lower.includes('ibuprofen') || lower.includes('analgesics') || lower.includes('antipyretics')) return Pill;
  if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('meal') || lower.includes('nutrition') || lower.includes('apple') || lower.includes('fruit') || lower.includes('vegetable') || lower.includes('porridge') || lower.includes('rice') || lower.includes('banana')) return Apple;
  if (lower.includes('pain') || lower.includes('chest') || lower.includes('heart') || lower.includes('cardio') || lower.includes('pulse')) return Heart;
  if (lower.includes('breath') || lower.includes('air') || lower.includes('shortness') || lower.includes('inhale') || lower.includes('exhale') || lower.includes('lung') || lower.includes('cough') || lower.includes('wheezing')) return Wind;
  if (lower.includes('avoid') || lower.includes('limit') || lower.includes('restrict') || lower.includes('no ') || lower.includes('don\'t') || lower.includes('dairy') || lower.includes('processed')) return Ban;
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('run') || lower.includes('walk') || lower.includes('gym') || lower.includes('active') || lower.includes('activity')) return Dumbbell;
  if (lower.includes('hours') || lower.includes('time') || lower.includes('schedule') || lower.includes('days') || lower.includes('weekly') || lower.includes('daily')) return Clock;
  if (lower.includes('brain') || lower.includes('mental') || lower.includes('stress') || lower.includes('headache') || lower.includes('migraine')) return Brain;
  if (lower.includes('fever') || lower.includes('temp') || lower.includes('heat') || lower.includes('hot')) return Thermometer;
  return defaultIcon;
};

export function PrescribedPlanCard({ plan, doctorName = 'Dr. Amit Patel', conditionName = '' }) {
  const [rxNumber, setRxNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Generate a static Rx serial number and current date on mount
    const num = Math.floor(100000 + Math.random() * 900000);
    setRxNumber(`Rx-${num}`);
    setCurrentDate(format(new Date(), 'PPP'));
  }, []);

  if (!plan) return null;

  // Split text paragraphs into sentences for list presentation
  const medicationSentences = plan.medicationAdvice
    ? plan.medicationAdvice.split(/\.(?=\s|$)/).map(s => s.trim()).filter(Boolean)
    : [];

  const activitySentences = plan.activityLevel
    ? plan.activityLevel.split(/\.(?=\s|$)/).map(s => s.trim()).filter(Boolean)
    : [];

  // Filter test suggestions for this condition
  const testsData = testSuggestions.find(
    t => t.condition.toLowerCase() === conditionName?.toLowerCase()
  );
  const tests = testsData ? testsData.tests : [];

  return (
    <div className="relative glass-card border border-white/10 rounded-3xl p-6 md:p-8 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden mt-6 animate-fade-in-up">
      
      {/* Visual Watermark "Rx" in Background */}
      <div className="absolute right-6 bottom-16 text-[150px] font-extrabold text-white/5 select-none pointer-events-none font-serif leading-none">
        Rx
      </div>

      {/* Header section (Clinic Details) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/30">
            <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-headline text-slate-100 tracking-tight">VIRTUAL HEALTH CLINIC</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Automated Clinical Care Network</p>
          </div>
        </div>
        
        <div className="text-left sm:text-right font-medium text-xs text-slate-400">
          <div><span className="font-bold text-slate-300">Serial ID:</span> {rxNumber}</div>
          <div className="mt-1"><span className="font-bold text-slate-300">Date:</span> {currentDate}</div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold font-headline text-emerald-400 tracking-tight">Prescribed Recovery Plan</h3>
        </div>
        {conditionName && (
          <Badge variant="secondary" className="capitalize text-emerald-300 bg-white/5 border border-white/10 px-3 py-1 font-bold">
            Target: {conditionName}
          </Badge>
        )}
      </div>

      {/* Prescription Slips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Medication & Self-Care Section */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/15 transition-all duration-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Pill className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-slate-200 text-sm tracking-tight">I. Medication & Self-Care Advice</h5>
            </div>
            <ul className="space-y-3 pl-1">
              {medicationSentences.map((sentence, idx) => {
                const Icon = getItemIcon(sentence, Pill);
                return (
                  <li key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all duration-150">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] text-slate-200 leading-relaxed font-medium">
                      {sentence}.
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-4 block border-t border-white/5 pt-2 uppercase tracking-wider">
            Dosage & Administration directives
          </span>
        </div>

        {/* Dietary Guidelines Section */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/15 transition-all duration-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Apple className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-slate-200 text-sm tracking-tight">II. Dietary Guidelines</h5>
            </div>
            <ul className="space-y-3 pl-1">
              {plan.dietaryGuidelines && plan.dietaryGuidelines.map((item, idx) => {
                const Icon = getItemIcon(item, Apple);
                return (
                  <li key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all duration-150">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] text-slate-200 leading-relaxed font-medium">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-4 block border-t border-white/5 pt-2 uppercase tracking-wider">
            Nutritionist and fluid recommendations
          </span>
        </div>

        {/* Activity & Rest Section */}
        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/15 transition-all duration-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-slate-200 text-sm tracking-tight">III. Physical Activity & Rest</h5>
            </div>
            <ul className="space-y-3 pl-1">
              {activitySentences.map((sentence, idx) => {
                const Icon = getItemIcon(sentence, Activity);
                return (
                  <li key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-xl transition-all duration-150">
                    <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] text-slate-200 leading-relaxed font-medium">
                      {sentence}.
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <span className="text-[9px] text-muted-foreground font-semibold mt-4 block border-t border-white/5 pt-2 uppercase tracking-wider">
            Physical limits & recuperation schedules
          </span>
        </div>

        {/* Critical Warnings Section */}
        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex flex-col justify-between hover:border-rose-500/35 transition-all duration-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-rose-400 text-sm tracking-tight">IV. Warning Signs (Seek Emergency Care)</h5>
            </div>
            <ul className="space-y-3 pl-1">
              {plan.warningSigns && plan.warningSigns.map((item, idx) => {
                const Icon = getItemIcon(item, AlertTriangle);
                return (
                  <li key={idx} className="flex items-start gap-3 bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/25 p-3 rounded-xl transition-all duration-150">
                    <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="text-[13px] text-slate-200 leading-relaxed font-medium">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <span className="text-[9px] text-rose-400 font-semibold mt-4 block border-t border-rose-500/10 pt-2 uppercase tracking-wider">
            Critical Emergency Indicators
          </span>
        </div>

        {/* Diagnostic Tests Section */}
        {tests && tests.length > 0 && (
          <div className="md:col-span-2 bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-200 shadow-sm relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-200 text-sm tracking-tight">V. Recommended Diagnostic Tests</h5>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
                {tests.map((test, idx) => {
                  const TestIcon = test.icon || FlaskConical;
                  return (
                    <div key={idx} className="flex gap-3 bg-white/5 border border-white/5 p-3.5 rounded-xl hover:border-white/10 transition-all duration-150">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 h-9 w-9 shrink-0 flex items-center justify-center">
                        <TestIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                          {test.name}
                          {test.recommended && (
                            <Badge variant="default" className="text-[9px] px-1 py-0.5 bg-emerald-500 text-emerald-950 font-bold border-none shadow-sm flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-emerald-950 text-emerald-950" /> Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{test.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="text-[9px] text-emerald-400 font-semibold mt-4 block border-t border-emerald-500/10 pt-2 uppercase tracking-wider">
              Diagnostic & Monitoring Protocols
            </span>
          </div>
        )}

      </div>

      {/* Signature & Stamp Area */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        
        {/* Verification stamp */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-dashed border-emerald-500/40 flex items-center justify-center p-1 relative">
            <div className="w-full h-full rounded-full border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-emerald-500/60 animate-pulse" />
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            <div>VHA Medical Board</div>
            <div className="text-emerald-400 font-bold mt-0.5">Verified Case File</div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
          <div className="font-serif italic text-emerald-400 text-xl font-bold tracking-wider mb-0.5 pr-2 pl-2 border-b border-white/10 select-none">
            {doctorName}
          </div>
          <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Authorized Medical Signature</div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center mt-6 pt-4 border-t border-white/5">
        Disclaimer: This automated care plan recommendation is based on self-reported symptoms. 
        It does not constitute an official prescription or substitute for a formal in-person clinical examination by a physician.
      </p>
    </div>
  );
}
