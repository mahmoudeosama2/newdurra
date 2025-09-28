import * as React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = React.useState<any>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contact');
      setContactInfo(response.data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="contact" className="py-16" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading contact information...</p>
          </div>
        </div>
      </section>
    );
  }

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
              {contactInfo.phone && contactInfo.phone.map((phone: any, index: number) => (
                <p key={index} className="text-white/90">{phone.value}</p>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('contact.email')}
              </h3>
              {contactInfo.email && contactInfo.email.map((email: any, index: number) => (
                <p key={index} className="text-white/90">{email.value}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
