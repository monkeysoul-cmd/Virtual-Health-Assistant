import {
  TestTube,
  Pill,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Activity,
  FlaskConical,
  Microscope,
  Thermometer,
  Wind,
  Bandage,
} from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  area: string;
  contact: string;
  icon: React.ElementType;
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    specialty: 'Cardiologist',
    area: 'Downtown',
    contact: '555-0101',
    icon: HeartPulse,
  },
  {
    id: '2',
    name: 'Dr. Samuel Chen',
    specialty: 'Neurologist',
    area: 'Uptown',
    contact: '555-0102',
    icon: Brain,
  },
  {
    id: '3',
    name: 'Dr. Olivia Garcia',
    specialty: 'Orthopedist',
    area: 'Midtown',
    contact: '555-0103',
    icon: Bone,
  },
  {
    id: '4',
    name: 'Dr. Ben Carter',
    specialty: 'General Practitioner',
    area: 'Downtown',
    contact: '555-0104',
    icon: Stethoscope,
  },
  {
    id: '5',
    name: 'Dr. Chloe Taylor',
    specialty: 'Dermatologist',
    area: 'Suburb',
    contact: '555-0105',
    icon: Stethoscope,
  },
  {
    id: '6',
    name: 'Dr. Marcus Wright',
    specialty: 'Pediatrician',
    area: 'Uptown',
    contact: '555-0106',
    icon: Stethoscope,
  },
];

export interface Precaution {
  condition: string;
  title: string;
  advice: string[];
  icon: React.ElementType;
}

export const precautions: Precaution[] = [
  {
    condition: 'common cold',
    title: 'Common Cold Care',
    advice: [
      'Get plenty of rest to help your body fight the infection.',
      'Drink warm liquids like tea with honey and lemon to soothe a sore throat.',
      'Use a humidifier or take a steamy shower to ease congestion.',
      'Wash your hands frequently to prevent spreading the virus.',
    ],
    icon: Pill,
  },
  {
    condition: 'influenza',
    title: 'Influenza (Flu) Management',
    advice: [
      'Stay home and rest. Avoid contact with others.',
      'Drink plenty of fluids to prevent dehydration.',
      'Consider over-the-counter antiviral medications if recommended by a doctor.',
      'Get a flu shot annually for prevention.',
    ],
    icon: Pill,
  },
  {
    condition: 'migraine',
    title: 'Migraine Relief',
    advice: [
      'Rest in a quiet, dark room.',
      'Apply a cold or warm compress to your head or neck.',
      'Drink a small amount of caffeine.',
      'Practice relaxation techniques like meditation or deep breathing.',
    ],
    icon: Brain,
  },
  {
    condition: 'gastroenteritis',
    title: 'Stomach Flu Recovery',
    advice: [
      'Stay hydrated with water, broth, or an oral rehydration solution.',
      'Gradually reintroduce bland foods like toast, rice, and bananas (BRAT diet).',
      'Avoid dairy, caffeine, alcohol, and spicy foods.',
      'Get plenty of rest to allow your digestive system to recover.',
    ],
    icon: Pill,
  },
  {
    condition: 'allergy',
    title: 'Allergy Management',
    advice: [
      'Identify and avoid known allergens (e.g., pollen, dust mites, pet dander).',
      'Use over-the-counter antihistamines to relieve symptoms like sneezing and itching.',
      'Keep windows closed during high pollen seasons.',
      'Consult an allergist for severe symptoms or long-term management.',
    ],
    icon: Wind,
  },
  {
    condition: 'bronchitis',
    title: 'Bronchitis Care',
    advice: [
      'Get plenty of rest and drink lots of fluids.',
      'Use a humidifier to help loosen mucus in your airways.',
      'Avoid smoking and exposure to secondhand smoke.',
      'Soothe your throat with honey, lozenges, or warm tea.',
    ],
    icon: Wind,
  },
  {
    condition: 'tension headache',
    title: 'Tension Headache Relief',
    advice: [
      'Apply a heating pad or warm compress to the back of your neck.',
      'Take over-the-counter pain relievers like ibuprofen or acetaminophen.',
      'Gently massage your neck and shoulder muscles.',
      'Take short breaks from activities that cause head or neck strain, like sitting at a computer.',
    ],
    icon: Brain,
  },
  {
    condition: 'sprain',
    title: 'Sprain First-Aid (R.I.C.E.)',
    advice: [
      'Rest: Avoid activities that cause pain to the injured area.',
      'Ice: Apply an ice pack for 15-20 minutes every 2-3 hours.',
      'Compression: Wrap the area with an elastic bandage to reduce swelling.',
      'Elevation: Keep the injured limb elevated above the level of your heart.',
    ],
    icon: Bandage,
  },
];

export interface TestSuggestion {
  condition: string;
  title: string;
  tests: { name: string; description: string; icon: React.ElementType }[];
  icon: React.ElementType;
}

export const testSuggestions: TestSuggestion[] = [
  {
    condition: 'common cold',
    title: 'Tests for Cold-like Symptoms',
    tests: [
      {
        name: 'Physical Exam',
        description:
          'A doctor can often diagnose a cold based on signs and symptoms.',
        icon: Activity,
      },
      {
        name: 'Rapid Strep Test',
        description:
          'If a severe sore throat is present, to rule out strep throat.',
        icon: TestTube,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'influenza',
    title: 'Tests for Influenza',
    tests: [
      {
        name: 'Rapid Influenza Diagnostic Test (RIDT)',
        description: 'Detects flu antigens in a nasal swab.',
        icon: TestTube,
      },
      {
        name: 'RT-PCR Test',
        description: 'A more accurate molecular test to confirm the flu virus.',
        icon: Microscope,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'migraine',
    title: 'Diagnosing Migraines',
    tests: [
      {
        name: 'Neurological Examination',
        description: 'To assess motor skills, reflexes, and sensory function.',
        icon: Activity,
      },
      {
        name: 'MRI or CT Scan',
        description:
          'May be used to rule out other serious causes of headaches.',
        icon: Brain,
      },
    ],
    icon: Brain,
  },
  {
    condition: 'gastroenteritis',
    title: 'Tests for Gastroenteritis',
    tests: [
      {
        name: 'Stool Sample Analysis',
        description:
          'To identify bacteria, viruses, or parasites causing the infection.',
        icon: FlaskConical,
      },
      {
        name: 'Blood Test',
        description: 'To check for dehydration or other complications.',
        icon: TestTube,
      },
    ],
    icon: FlaskConical,
  },
  {
    condition: 'allergy',
    title: 'Diagnosing Allergies',
    tests: [
      {
        name: 'Skin Prick Test',
        description: 'A common test to identify allergens by applying them to the skin.',
        icon: TestTube,
      },
      {
        name: 'Blood Test (IgE)',
        description: 'Measures the amount of allergy-causing antibodies in your bloodstream.',
        icon: Microscope,
      },
    ],
    icon: Wind,
  },
  {
    condition: 'bronchitis',
    title: 'Tests for Bronchitis',
    tests: [
      {
        name: 'Chest X-Ray',
        description: 'To rule out pneumonia or other lung conditions.',
        icon: Wind,
      },
      {
        name: 'Sputum Test',
        description: 'Analysis of mucus to check for bacteria or other organisms.',
        icon: Microscope,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'tension headache',
    title: 'Diagnosing Tension Headaches',
    tests: [
      {
        name: 'Physical Exam',
        description: 'A doctor can typically diagnose a tension headache by discussing your symptoms.',
        icon: Activity,
      },
      {
        name: 'Trigger Point Check',
        description: 'The doctor may check for muscle soreness in your neck, shoulders, and head.',
        icon: Stethoscope,
      },
    ],
    icon: Brain,
  },
  {
    condition: 'sprain',
    title: 'Tests for Sprains',
    tests: [
      {
        name: 'Physical Examination',
        description: 'A doctor will check for swelling, pain, and range of motion.',
        icon: Activity,
      },
      {
        name: 'X-ray or MRI',
        description: 'To rule out a fracture and assess the severity of ligament damage.',
        icon: Bone,
      },
    ],
    icon: Bandage,
  },
];
