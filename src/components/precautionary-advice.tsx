import { precautions } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ShieldCheck, CheckCircle } from 'lucide-react';

interface PrecautionaryAdviceProps {
  conditions: string[];
}

export function PrecautionaryAdvice({ conditions }: PrecautionaryAdviceProps) {
  const relevantPrecautions = precautions.filter(p =>
    conditions.includes(p.condition)
  );

  if (relevantPrecautions.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <h3 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary" />
        Precautionary Advice
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {relevantPrecautions.map((precaution, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="font-semibold text-lg hover:no-underline">
              <div className="flex items-center gap-3">
                <precaution.icon className="w-5 h-5 text-primary" />
                {precaution.title}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-2">
                {precaution.advice.map((adv, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
