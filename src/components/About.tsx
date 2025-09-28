import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            {t('about.title')}
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-200">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {t('about.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#004aaf' }}>5+</div>
                <div className="text-gray-600">{t('about.stats.experience')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#004aaf' }}>50+</div>
                <div className="text-gray-600">{t('about.stats.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: '#004aaf' }}>10+</div>
                <div className="text-gray-600">{t('about.stats.locations')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;