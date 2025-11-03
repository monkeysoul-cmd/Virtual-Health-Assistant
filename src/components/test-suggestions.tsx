import { testSuggestions } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

interface TestSuggestionsProps {
  conditions: string[];
}

export function TestSuggestions({ conditions }: TestSuggestionsProps) {
  const relevantTests = testSuggestions.filter(t =>
    conditions.includes(t.condition)
  );

  if (relevantTests.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <h3 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
        <FlaskConical className="w-6 h-6 text-primary" />
        Health Test Suggestions
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {relevantTests.map((suggestion, index) =>
          suggestion.tests.map((test, testIndex) => (
            <Card
              key={`${index}-${testIndex}`}
              className="bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <test.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {test.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{test.description}</CardDescription>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
