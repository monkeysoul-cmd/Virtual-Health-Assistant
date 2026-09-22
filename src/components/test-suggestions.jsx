import { testSuggestions } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { FlaskConical, Star } from 'lucide-react';
import { Badge } from './ui/badge';
export function TestSuggestions({ conditions }) {
    if (!conditions || !Array.isArray(conditions) || conditions.length === 0)
        return null;

    const normalizedConditions = conditions.map(c => (typeof c === 'string' ? c.toLowerCase().trim() : ''));
    const relevantTests = testSuggestions.filter(t => {
        const testCond = t.condition.toLowerCase().trim();
        return normalizedConditions.some(c => c && (c === testCond || c.includes(testCond) || testCond.includes(c)));
    });
    if (relevantTests.length === 0)
        return null;
    return (<div className="w-full space-y-3">
      <h3 className="text-xl font-bold tracking-tight font-headline flex items-center gap-2 text-emerald-300">
        <FlaskConical className="w-5 h-5 text-emerald-400"/>
        Health Test Suggestions
      </h3>
      <div className="grid gap-3.5 sm:grid-cols-2">
        {relevantTests.map((suggestion, index) => suggestion.tests.map((test, testIndex) => {
          const TestIcon = test.icon || FlaskConical;
          return (
            <Card key={`${index}-${testIndex}`} className="glass-card bg-slate-950/60 border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg rounded-2xl overflow-hidden transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-3.5 space-y-0 p-4 pb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <TestIcon className="w-5 h-5 text-emerald-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-bold flex items-center justify-between gap-2 text-white">
                    <span className="truncate">{test.name}</span>
                    {test.recommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-emerald-950 shrink-0 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-emerald-950"/>
                        Recommended
                      </span>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <CardDescription className="text-xs text-slate-300 leading-relaxed">{test.description}</CardDescription>
              </CardContent>
            </Card>
          );
        }))}
      </div>
    </div>);
}
