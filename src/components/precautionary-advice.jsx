import { precautions } from '@/lib/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from '@/components/ui/accordion';
import { ShieldCheck, CheckCircle, Pill } from 'lucide-react';
export function PrecautionaryAdvice({ condition }) {
    if (!condition)
        return null;
    
    const localPrecaution = precautions.find(p => p.condition.toLowerCase() === condition.condition.toLowerCase());
    
    const adviceList = condition.precautions || (localPrecaution ? localPrecaution.advice : []);
    
    if (adviceList.length === 0)
        return null;
        
    const title = localPrecaution ? localPrecaution.title : `${condition.condition.charAt(0).toUpperCase() + condition.condition.slice(1)} Precautions`;
    const PrecautionIcon = localPrecaution ? localPrecaution.icon : Pill;
    
    return (<div className="w-full space-y-4">
      <h3 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary"/>
        Precautionary Advice
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-0">
          <AccordionTrigger className="font-semibold text-lg hover:no-underline">
            <div className="flex items-center gap-3">
              <PrecautionIcon className="w-5 h-5 text-primary"/>
              {title}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3 pl-2">
              {adviceList.map((adv, i) => (<li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0"/>
                  <span>{adv}</span>
                </li>))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>);
}

