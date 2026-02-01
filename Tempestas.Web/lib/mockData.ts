export interface AQIStatus {
  label: string;
  color: string;
  icon: string;
  description: string;
}

export interface Prediction {
  time: string;
  aqi: number;
  level: string;
}

export interface HealthCondition {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const DATA = {
  current: {
    aqi: 45,
    temperature: 22.5,
    humidity: 65,
    pm25: 12.3,
    pm10: 28.7,
  },
  trends: {
    hourly: [32, 35, 38, 42, 45, 48, 52, 55],
  },
  predictions: [
    { time: '2 PM', aqi: 58, level: 'Moderate' },
    { time: '4 PM', aqi: 72, level: 'Moderate' },
    { time: '6 PM', aqi: 85, level: 'Moderate' },
  ] as Prediction[],
  conditions: [
    {
      id: 'asthma',
      name: 'Asthma',
      icon: 'fitness-outline',
      description: 'Chronic respiratory condition affecting airways',
    },
    {
      id: 'allergies',
      name: 'Allergies',
      icon: 'flower-outline',
      description: 'Seasonal or environmental allergies',
    },
    {
      id: 'copd',
      name: 'COPD',
      icon: 'pulse-outline',
      description: 'Chronic obstructive pulmonary disease',
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular Disease',
      icon: 'heart-outline',
      description: 'Heart or blood vessel conditions',
    },
    {
      id: 'respiratory',
      name: 'Other Respiratory Issues',
      icon: 'medkit-outline',
      description: 'Bronchitis, emphysema, or other lung conditions',
    },
    {
      id: 'children',
      name: 'Young Children at Home',
      icon: 'people-outline',
      description: 'Children under 12 are more sensitive to air quality',
    },
    {
      id: 'elderly',
      name: 'Elderly at Home',
      icon: 'accessibility-outline',
      description: 'Seniors 65+ are more vulnerable to pollution',
    },
  ] as HealthCondition[],
};
