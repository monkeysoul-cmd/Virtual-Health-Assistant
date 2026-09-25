import React from 'react';
import { precautions } from '@/data/carePlans';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, CheckCircle, Pill } from 'lucide-react';

export function PrecautionaryAdvice({ condition }) {
  if (!condition) return null;

  const localPrecaution = precautions.find(
    p => p.condition.toLowerCase() === condition.condition.toLowerCase()
  );

  const adviceList = condition.precautions || (localPrecaution ? localPrecaution.advice : []);

  if (adviceList.length === 0) return null;

  const title = localPrecaution
    ? localPrecaution.title
    : `${condition.condition.charAt(0).toUpperCase() + condition.condition.slice(1)} Precautions`;
  const PrecautionIcon = localPrecaution ? localPrecaution.icon : Pill;

  return (
    <div className="w-full space-y-3">
      <h3 className="text-xl font-bold tracking-tight font-headline flex items-center gap-2 text-emerald-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        Precautionary Advice
      </h3>
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
        <AccordionItem value="item-0" className="border border-emerald-500/20 bg-slate-950/60 rounded-2xl px-4 overflow-hidden shadow-md">
          <AccordionTrigger className="font-semibold text-base text-white hover:no-underline py-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <PrecautionIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-headline">{title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <ul className="space-y-2.5 pl-1">
              {adviceList.map((adv, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="leading-relaxed font-medium">{adv}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default PrecautionaryAdvice;
