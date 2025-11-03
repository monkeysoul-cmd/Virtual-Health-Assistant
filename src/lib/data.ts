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
  Heart,
  Droplets,
  AirVent,
  Shield,
  Smile,
  Bug,
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
    condition: 'influenza (flu)',
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
    condition: 'allergic rhinitis',
    title: 'Hay Fever Management',
    advice: [
      'Identify and avoid known allergens (e.g., pollen, dust mites, pet dander).',
      'Use over-the-counter antihistamines or nasal sprays.',
      'Keep windows closed during high pollen seasons.',
      'Consider using an air purifier at home.',
    ],
    icon: Wind,
  },
  {
    condition: 'hypertension',
    title: 'Managing High Blood Pressure',
    advice: [
      'Adopt a low-sodium diet (DASH diet).',
      'Engage in regular physical activity, like brisk walking, for at least 30 minutes most days.',
      'Limit alcohol intake and avoid smoking.',
      'Monitor your blood pressure at home and follow your doctor-prescribed medication plan.',
    ],
    icon: Heart,
  },
  {
    condition: 'type 2 diabetes',
    title: 'Type 2 Diabetes Care',
    advice: [
      'Monitor your blood sugar levels regularly.',
      'Follow a balanced diet focusing on whole grains, lean proteins, and vegetables.',
      'Engage in regular exercise to improve insulin sensitivity.',
      'Take medications as prescribed and attend regular check-ups with your doctor.',
    ],
    icon: Droplets,
  },
  {
    condition: 'asthma',
    title: 'Asthma Control',
    advice: [
      'Identify and avoid asthma triggers, such as smoke, pollen, or cold air.',
      'Use your prescribed inhalers (both reliever and controller) as directed.',
      'Develop an asthma action plan with your doctor.',
      'Monitor your breathing and seek medical help if symptoms worsen.',
    ],
    icon: AirVent,
  },
  {
    condition: 'gastritis',
    title: 'Soothing Gastritis',
    advice: [
      'Avoid spicy, fatty, and acidic foods.',
      'Eat smaller, more frequent meals.',
      'Avoid alcohol and caffeine.',
      'Manage stress through relaxation techniques like yoga or meditation.',
    ],
    icon: Shield,
  },
  {
    condition: 'anxiety disorder',
    title: 'Managing Anxiety',
    advice: [
      'Practice mindfulness, meditation, and deep-breathing exercises.',
      'Engage in regular physical activity to reduce stress.',
      'Maintain a regular sleep schedule.',
      'Consider therapy or counseling to develop coping strategies.',
    ],
    icon: Smile,
  },
  {
    condition: 'osteoarthritis',
    title: 'Osteoarthritis Joint Care',
    advice: [
      'Engage in low-impact exercises like swimming or cycling to maintain joint flexibility.',
      'Maintain a healthy weight to reduce stress on your joints.',
      'Use hot or cold packs to soothe joint pain.',
      'Consider physical therapy for targeted exercises and support.',
    ],
    icon: Bone,
  },
  {
    condition: 'acute bronchitis',
    title: 'Bronchitis Recovery',
    advice: [
      'Get plenty of rest and drink lots of fluids.',
      'Use a humidifier to help loosen mucus.',
      'Avoid smoking and exposure to lung irritants.',
      'Soothe your throat with honey, lozenges, or warm tea.',
    ],
    icon: AirVent,
  },
  {
    condition: 'typhoid fever',
    title: 'Typhoid Fever Treatment',
    advice: [
      'Take the full course of prescribed antibiotics.',
      'Drink plenty of clean, boiled, or bottled water to stay hydrated.',
      'Eat a high-calorie diet with soft, easily digestible foods.',
      'Practice strict hand hygiene to prevent spreading the infection.',
    ],
    icon: Thermometer,
  },
  {
    condition: 'pneumonia',
    title: 'Pneumonia Care',
    advice: [
      'Complete the full course of antibiotics or antiviral medications as prescribed.',
      'Get plenty of rest and sleep.',
      'Drink lots of fluids to help loosen mucus.',
      'Use a humidifier and avoid smoke to ease breathing.',
    ],
    icon: AirVent,
  },
  {
    condition: 'acid reflux (gerd)',
    title: 'Managing Acid Reflux (GERD)',
    advice: [
      'Avoid trigger foods like spicy, fatty, or acidic items.',
      'Do not lie down for at least 2-3 hours after eating.',
      'Elevate the head of your bed when sleeping.',
      'Eat smaller meals and maintain a healthy weight.',
    ],
    icon: Shield,
  },
  {
    condition: 'malaria',
    title: 'Malaria Treatment',
    advice: [
      'Take antimalarial medication as prescribed by a doctor.',
      'Rest and drink plenty of fluids.',
      'Use insect repellent and sleep under a mosquito net to prevent further bites.',
      'Seek immediate medical attention for severe symptoms.',
    ],
    icon: Bug,
  },
  {
    condition: 'dengue fever',
    title: 'Dengue Fever Support',
    advice: [
      'Rest and drink plenty of fluids to prevent dehydration.',
      'Take acetaminophen for pain, but avoid NSAIDs like ibuprofen which can increase bleeding risk.',
      'Monitor for warning signs like severe abdominal pain or difficulty breathing.',
      'Protect yourself from mosquito bites to prevent transmission.',
    ],
    icon: Bug,
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
  {
    condition: 'fracture',
    title: 'Fracture Care',
    advice: [
      'Immobilize the injured area and avoid moving it.',
      'Apply a cold pack to reduce swelling and pain.',
      'Elevate the limb if possible.',
      'Seek immediate medical attention.',
    ],
    icon: Bone,
  },
];

export interface TestSuggestion {
  condition: string;
  title: string;
  tests: {
    name: string;
    description: string;
    icon: React.ElementType;
    recommended?: boolean;
  }[];
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
        recommended: true,
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
        recommended: true,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'influenza (flu)',
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
        recommended: true,
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
        recommended: true,
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
    condition: 'allergic rhinitis',
    title: 'Diagnosing Hay Fever',
    tests: [
      {
        name: 'Skin Prick Test',
        description:
          'A common test to identify allergens by applying them to the skin.',
        icon: TestTube,
        recommended: true,

      },
      {
        name: 'Blood Test (IgE)',
        description:
          'Measures the amount of allergy-causing antibodies in your bloodstream.',
        icon: Microscope,
      },
    ],
    icon: Wind,
  },
  {
    condition: 'hypertension',
    title: 'Diagnosing High Blood Pressure',
    tests: [
      {
        name: 'Blood Pressure Measurement',
        description:
          'Measured with a pressure cuff. Multiple readings are often needed for a diagnosis.',
        icon: Heart,
        recommended: true,
      },
      {
        name: 'Ambulatory Monitoring',
        description: 'Measures your blood pressure at regular intervals over 24 hours.',
        icon: Activity,
      },
    ],
    icon: Heart,
  },
  {
    condition: 'type 2 diabetes',
    title: 'Diagnosing Type 2 Diabetes',
    tests: [
      {
        name: 'A1C Test',
        description: 'Measures your average blood sugar level for the past 2-3 months.',
        icon: Droplets,
        recommended: true,
      },
      {
        name: 'Fasting Blood Sugar Test',
        description: 'Measures your blood sugar after an overnight fast.',
        icon: TestTube,
      },
    ],
    icon: Droplets,
  },
  {
    condition: 'asthma',
    title: 'Diagnosing Asthma',
    tests: [
      {
        name: 'Spirometry',
        description: 'Measures how much air you can inhale and exhale, and how quickly.',
        icon: Wind,
        recommended: true,
      },
      {
        name: 'Peak Flow Test',
        description: 'Measures how hard you can breathe out. Useful for home monitoring.',
        icon: AirVent,
      },
    ],
    icon: AirVent,
  },
  {
    condition: 'gastritis',
    title: 'Diagnosing Gastritis',
    tests: [
      {
        name: 'Upper Endoscopy',
        description: 'A thin tube with a camera is used to view your stomach lining.',
        icon: Stethoscope,
        recommended: true,
      },
      {
        name: 'H. pylori Test',
        description: 'A breath, stool, or blood test to check for H. pylori bacteria.',
        icon: FlaskConical,
      },
    ],
    icon: FlaskConical,
  },
  {
    condition: 'anxiety disorder',
    title: 'Diagnosing Anxiety Disorder',
    tests: [
      {
        name: 'Psychological Evaluation',
        description: 'A doctor or mental health professional discusses thoughts, feelings, and behavior.',
        icon: Smile,
        recommended: true,
      },
      {
        name: 'Physical Exam',
        description: 'To rule out other health problems that could be causing symptoms.',
        icon: Activity,
      },
    ],
    icon: Smile,
  },
  {
    condition: 'osteoarthritis',
    title: 'Diagnosing Osteoarthritis',
    tests: [
      {
        name: 'X-ray',
        description: 'Can show cartilage loss, bone spurs, and other signs of osteoarthritis.',
        icon: Bone,
        recommended: true,
      },
      {
        name: 'MRI Scan',
        description: 'Provides detailed images of bone and soft tissues, like cartilage.',
        icon: Brain,
      },
    ],
    icon: Bone,
  },
  {
    condition: 'acute bronchitis',
    title: 'Diagnosing Acute Bronchitis',
    tests: [
      {
        name: 'Chest X-Ray',
        description: 'To rule out pneumonia if your symptoms are severe or persistent.',
        icon: AirVent,
        recommended: true,
      },
      {
        name: 'Sputum Test',
        description: 'Analysis of mucus to check for bacteria, especially if a cough lingers.',
        icon: Microscope,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'typhoid fever',
    title: 'Diagnosing Typhoid Fever',
    tests: [
      {
        name: 'Blood Culture',
        description: 'The most reliable method, checks for Salmonella Typhi in the blood.',
        icon: TestTube,
        recommended: true,
      },
      {
        name: 'Stool Sample',
        description: 'Can also be used to culture the Salmonella Typhi bacteria.',
        icon: FlaskConical,
      },
    ],
    icon: Thermometer,
  },
  {
    condition: 'pneumonia',
    title: 'Diagnosing Pneumonia',
    tests: [
      {
        name: 'Chest X-Ray',
        description: 'Confirms the presence of an infection in the lungs.',
        icon: AirVent,
        recommended: true,
      },
      {
        name: 'Pulse Oximetry',
        description: 'Measures the oxygen level in your blood.',
        icon: HeartPulse,
      },
    ],
    icon: AirVent,
  },
  {
    condition: 'acid reflux (gerd)',
    title: 'Diagnosing GERD',
    tests: [
      {
        name: 'Upper Endoscopy',
        description: 'To visually inspect the esophagus and stomach for inflammation.',
        icon: Stethoscope,
        recommended: true,
      },
      {
        name: 'Ambulatory Acid (pH) Probe Test',
        description: 'Monitors the amount of acid in your esophagus over 24 hours.',
        icon: Activity,
      },
    ],
    icon: Shield,
  },
  {
    condition: 'malaria',
    title: 'Diagnosing Malaria',
    tests: [
      {
        name: 'Blood Smear',
        description: 'A drop of blood is examined under a microscope for malaria parasites.',
        icon: Microscope,
        recommended: true,
      },
      {
        name: 'Rapid Diagnostic Test (RDT)',
        description: 'Detects malaria antigens in the blood.',
        icon: TestTube,
      },
    ],
    icon: Bug,
  },
  {
    condition: 'dengue fever',
    title: 'Diagnosing Dengue Fever',
    tests: [
      {
        name: 'Blood Test (NS1, IgM, IgG)',
        description: 'To detect the virus or antibodies against it.',
        icon: TestTube,
        recommended: true,
      },
      {
        name: 'Complete Blood Count (CBC)',
        description: 'To check for a low platelet count, a common sign of severe dengue.',
        icon: Droplets,
      },
    ],
    icon: Bug,
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
        recommended: true,
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
        description:
          'A common test to identify allergens by applying them to the skin.',
        icon: TestTube,
        recommended: true,
      },
      {
        name: 'Blood Test (IgE)',
        description:
          'Measures the amount of allergy-causing antibodies in your bloodstream.',
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
        recommended: true,
      },
      {
        name: 'Sputum Test',
        description:
          'Analysis of mucus to check for bacteria or other organisms.',
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
        description:
          'A doctor can typically diagnose a tension headache by discussing your symptoms.',
        icon: Activity,
        recommended: true,
      },
      {
        name: 'Trigger Point Check',
        description:
          'The doctor may check for muscle soreness in your neck, shoulders, and head.',
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
        description:
          'A doctor will check for swelling, pain, and range of motion.',
        icon: Activity,
      },
      {
        name: 'X-ray or MRI',
        description:
          'To rule out a fracture and assess the severity of ligament damage.',
        icon: Bone,
        recommended: true,
      },
    ],
    icon: Bandage,
  },
  {
    condition: 'fracture',
    title: 'Tests for Fractures',
    tests: [
      {
        name: 'X-ray',
        description: 'The most common way to diagnose a fracture.',
        icon: Bone,
        recommended: true,
      },
      {
        name: 'MRI or CT Scan',
        description:
          'May be used for more detailed images of the bone and surrounding tissue.',
        icon: Brain,
      },
    ],
    icon: Bone,
  },
];
