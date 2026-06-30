import { HeartPulse, Lightbulb } from 'lucide-react';
import { SymptomCheckerForm } from '@/components/symptom-checker-form';
import { DoctorDirectory } from '@/components/doctor-directory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const healthTips = [
  { title: "Stay Hydrated", description: "Drink at least 8 glasses of water daily to maintain energy and kidney health." },
  { title: "Prioritize Sleep", description: "Aim for 7-9 hours of quality sleep to help your body repair and recharge." },
  { title: "Move More", description: "Just 30 minutes of brisk walking can significantly improve cardiovascular health." },
  { title: "Eat Mindfully", description: "Focus on whole foods, lean proteins, and plenty of colorful vegetables." }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-0 w-full">
      <header className="w-full mx-auto text-center py-12 md:py-16 bg-background/60 backdrop-blur-sm border-b border-border mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <HeartPulse className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">
            Virtual Health Assistant
          </h1>
        </div>
        <p className="text-muted-foreground md:text-2xl/relaxed max-w-3xl mx-auto px-4">
          Your professional online guide to understanding health symptoms and finding expert care.
        </p>
      </header>

      <div className="w-full px-0">
        <SymptomCheckerForm />
      </div>

      <section className="w-full px-4 md:px-12 py-12">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Lightbulb className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold font-headline tracking-tight">Daily Health Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthTips.map((tip, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="w-full border-t border-border my-8"></div>

      <div id="doctor-directory" className="w-full px-0">
        <DoctorDirectory />
      </div>

      <footer className="w-full mx-auto text-center py-12 text-sm text-muted-foreground bg-background/40 backdrop-blur-sm border-t border-border mt-16">
        <p className="text-base font-semibold text-foreground">&copy; {new Date().getFullYear()} Virtual Health Assistant</p>
        <p className="mt-1">
          Professional health insights powered by AI and local records. This is a demo application.
        </p>
      </footer>
    </main>
  );
}
