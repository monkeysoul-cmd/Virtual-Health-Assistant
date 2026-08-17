'use client';
import { useEffect, useState } from 'react';
import {
  Pill, Apple, Activity, AlertTriangle, FileText, ClipboardList,
  GlassWater, Bed, Clock, UserCheck, Ban,
  Dumbbell, Heart, Wind, Thermometer, Brain,
  FlaskConical, Star, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { testSuggestions } from '@/lib/data';

const getItemIcon = (text, defaultIcon) => {
  const lower = text.toLowerCase();
  if (lower.includes('doctor') || lower.includes('physician') || lower.includes('specialist') || lower.includes('consult') || lower.includes('appointment')) return UserCheck;
  if (lower.includes('sleep') || lower.includes('rest') || lower.includes('bed') || lower.includes('night') || lower.includes('recuperate')) return Bed;
  if (lower.includes('water') || lower.includes('fluid') || lower.includes('liquid') || lower.includes('hydrate') || lower.includes('drink') || lower.includes('tea') || lower.includes('soup') || lower.includes('broth')) return GlassWater;
  if (lower.includes('pill') || lower.includes('medication') || lower.includes('drug') || lower.includes('tablet') || lower.includes('prescription') || lower.includes('paracetamol') || lower.includes('ibuprofen') || lower.includes('analgesics') || lower.includes('antipyretics')) return Pill;
  if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('meal') || lower.includes('nutrition') || lower.includes('fruit') || lower.includes('vegetable') || lower.includes('banana')) return Apple;
  if (lower.includes('pain') || lower.includes('chest') || lower.includes('heart') || lower.includes('cardio') || lower.includes('pulse')) return Heart;
  if (lower.includes('breath') || lower.includes('air') || lower.includes('shortness') || lower.includes('inhale') || lower.includes('lung') || lower.includes('cough') || lower.includes('wheezing')) return Wind;
  if (lower.includes('avoid') || lower.includes('limit') || lower.includes('restrict') || lower.includes('no ') || lower.includes('dairy') || lower.includes('processed')) return Ban;
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('run') || lower.includes('walk') || lower.includes('gym') || lower.includes('active')) return Dumbbell;
  if (lower.includes('hours') || lower.includes('time') || lower.includes('schedule') || lower.includes('days') || lower.includes('weekly') || lower.includes('daily')) return Clock;
  if (lower.includes('brain') || lower.includes('mental') || lower.includes('stress') || lower.includes('headache') || lower.includes('migraine')) return Brain;
  if (lower.includes('fever') || lower.includes('temp') || lower.includes('heat') || lower.includes('hot')) return Thermometer;
  return defaultIcon;
};

/* ─── Section wrapper ─── */
function RxSection({ title, icon: Icon, iconColor = 'text-emerald-400', iconBg = 'bg-emerald-500/10', borderColor = 'border-white/6', hoverBorder = 'hover:border-white/12', children, footer }) {
  return (
    <div className={`rx-section flex flex-col justify-between border ${borderColor} ${hoverBorder}`}>
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className={`p-1.5 ${iconBg} rounded-lg ${iconColor}`}>
            <Icon className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
          </div>
          <h5 className="font-bold text-slate-200 text-sm tracking-tight">{title}</h5>
        </div>
        {children}
      </div>
      {footer && (
        <p className="text-[9px] text-slate-600 font-semibold mt-4 block border-t border-white/5 pt-2 uppercase tracking-wider">
          {footer}
        </p>
      )}
    </div>
  );
}

/* ─── List item ─── */
function RxItem({ text, icon: Icon, danger = false, delay = 0 }) {
  return (
    <li
      style={{ animationDelay: `${delay}ms` }}
      className={`rx-item animate-slide-in-right ${danger ? 'border-rose-500/10 bg-rose-500/4 hover:border-rose-500/25' : ''}`}
    >
      <div className={`p-1.5 ${danger ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'} rounded-lg shrink-0 mt-0.5`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[13px] text-slate-200 leading-relaxed font-medium">{text}{!text.endsWith('.') ? '.' : ''}</span>
    </li>
  );
}

export function PrescribedPlanCard({ plan, doctorName = 'Dr. Amit Patel', conditionName = '' }) {
  const [rxNumber, setRxNumber]       = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setRxNumber(`Rx-${Math.floor(100000 + Math.random() * 900000)}`);
    setCurrentDate(format(new Date(), 'PPP'));
  }, []);

  if (!plan) return null;

  const medicationSentences = plan.medicationAdvice
    ? plan.medicationAdvice.split(/\.(?=\s|$)/).map(s => s.trim()).filter(Boolean)
    : [];
  const activitySentences = plan.activityLevel
    ? plan.activityLevel.split(/\.(?=\s|$)/).map(s => s.trim()).filter(Boolean)
    : [];

  const testsData = testSuggestions.find(t => t.condition.toLowerCase() === conditionName?.toLowerCase());
  const tests     = testsData ? testsData.tests : [];

  return (
    <div className="relative glass-panel rounded-2xl border border-white/7 overflow-hidden mt-6 animate-card-reveal shadow-2xl">

      {/* Watermark */}
      <div className="absolute right-6 bottom-14 text-[140px] font-extrabold text-white/[0.025] select-none pointer-events-none font-serif leading-none">Rx</div>

      {/* Top gradient accent */}
      <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

      <div className="p-6 md:p-8">

        {/* ── Clinic Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/8 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/15 border border-emerald-500/25 p-2.5 rounded-2xl">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-extrabold font-headline text-white tracking-tight">VIRTUAL HEALTH CLINIC</h4>
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-widest">Automated Clinical Care Network</p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
            <div><span className="font-bold text-slate-400">Serial ID:</span> <span className="text-emerald-400 font-bold">{rxNumber}</span></div>
            <div className="mt-1"><span className="font-bold text-slate-400">Date:</span> {currentDate}</div>
          </div>
        </div>

        {/* ── Title row ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-emerald-400" style={{ width: '1.125rem', height: '1.125rem' }} />
            <h3 className="text-lg font-bold font-headline text-emerald-400 tracking-tight">Prescribed Recovery Plan</h3>
          </div>
          {conditionName && (
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-sm font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)] capitalize tracking-wide">
              {conditionName}
            </span>
          )}
        </div>

        {/* ── Prescription Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">

          {/* I. Medication & Self-Care */}
          <RxSection
            title="I. Medication & Self-Care Advice"
            icon={Pill}
            footer="Dosage & Administration Directives"
          >
            <ul className="space-y-2.5">
              {medicationSentences.map((sentence, idx) => (
                <RxItem key={idx} text={sentence} icon={getItemIcon(sentence, Pill)} delay={idx * 45} />
              ))}
            </ul>
          </RxSection>

          {/* II. Dietary Guidelines */}
          <RxSection
            title="II. Dietary Guidelines"
            icon={Apple}
            footer="Nutritionist & Fluid Recommendations"
          >
            <ul className="space-y-2.5">
              {plan.dietaryGuidelines?.map((item, idx) => (
                <RxItem key={idx} text={item} icon={getItemIcon(item, Apple)} delay={idx * 45} />
              ))}
            </ul>
          </RxSection>

          {/* III. Activity & Rest */}
          <RxSection
            title="III. Physical Activity & Rest"
            icon={Activity}
            footer="Physical Limits & Recuperation Schedules"
          >
            <ul className="space-y-2.5">
              {activitySentences.map((sentence, idx) => (
                <RxItem key={idx} text={sentence} icon={getItemIcon(sentence, Activity)} delay={idx * 45} />
              ))}
            </ul>
          </RxSection>

          {/* IV. Warning Signs */}
          <RxSection
            title="IV. Warning Signs (Seek Emergency Care)"
            icon={AlertTriangle}
            iconColor="text-rose-400"
            iconBg="bg-rose-500/10"
            borderColor="border-rose-500/15"
            hoverBorder="hover:border-rose-500/30"
            footer="Critical Emergency Indicators"
          >
            <ul className="space-y-2.5">
              {plan.warningSigns?.map((item, idx) => (
                <RxItem key={idx} text={item} icon={getItemIcon(item, AlertTriangle)} danger delay={idx * 55} />
              ))}
            </ul>
          </RxSection>

          {/* V. Diagnostic Tests (full width) */}
          {tests?.length > 0 && (
            <div className="md:col-span-2 rx-section border-emerald-500/10 hover:border-emerald-500/20 bg-emerald-500/3 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/6 rounded-full filter blur-xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <FlaskConical className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                </div>
                <h5 className="font-bold text-slate-200 text-sm tracking-tight">V. Recommended Diagnostic Tests</h5>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tests.map((test, idx) => {
                  const TestIcon = test.icon || FlaskConical;
                  return (
                    <div key={idx} className="rx-item">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 h-8 w-8 shrink-0 flex items-center justify-center">
                        <TestIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5 flex-wrap">
                          {test.name}
                          {test.recommended && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-emerald-950 font-bold rounded-full flex items-center gap-0.5">
                              <Star className="w-2 h-2 fill-emerald-950" /> Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{test.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[9px] text-emerald-500/60 font-semibold mt-4 block border-t border-emerald-500/10 pt-2 uppercase tracking-wider">
                Diagnostic & Monitoring Protocols
              </p>
            </div>
          )}
        </div>

        {/* ── Signature & Stamp ── */}
        <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          {/* Stamp */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-dashed border-emerald-500/35 flex items-center justify-center relative">
              <div className="w-9 h-9 rounded-full border border-emerald-500/25 bg-emerald-500/5 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-emerald-500/50 animate-pulse" />
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <div>VHA Medical Board</div>
              <div className="text-emerald-400 font-bold mt-0.5">Verified Case File</div>
            </div>
          </div>

          {/* Signature */}
          <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
            <div className="font-serif italic text-emerald-400 text-xl font-bold tracking-wide mb-0.5 px-3 border-b border-white/10 select-none">
              {doctorName}
            </div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Authorized Medical Signature</div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-700 leading-relaxed text-center mt-5 pt-4 border-t border-white/5">
          Disclaimer: This automated care plan is based on self-reported symptoms and does not constitute an official prescription or substitute for a formal clinical examination by a physician.
        </p>
      </div>
    </div>
  );
}
