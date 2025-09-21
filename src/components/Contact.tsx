import * as React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-16" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t('contact.title')}
          </h2>

          <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start mb-12 ml-auto mr-auto md:mr-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Phone size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('contact.phone')}
              </h3>
              <p className="text-white/90">+965 2226 9915</p>
              <p className="text-white/90">+965 2226 9916</p>
              <p className="text-white/90">+965 2226 9917</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('contact.email')}
              </h3>
              <p className="text-white/90">info@hamedawadh-int.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
