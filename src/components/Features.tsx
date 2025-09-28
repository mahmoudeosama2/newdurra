import * as React from 'react';
import { Shield, Award, Users, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description')
    },
    {
      icon: Award,
      title: t('features.quality.title'),
      description: t('features.quality.description')
    },
    {
      icon: Users,
      title: t('features.service.title'),
      description: t('features.service.description')
    },
    {
      icon: MapPin,
      title: t('features.location.title'),
      description: t('features.location.description')
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center text-gray-900">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: '#004aaf' }}
              >
                <feature.icon size={32} color="white" /> {/* هنا خليتها بيضاء */}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
