import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = React.useState<string>('');

  React.useEffect(() => {
    fetchWhatsAppNumber();
  }, []);

  const fetchWhatsAppNumber = async () => {
    try {
      const response = await axios.get('/api/contact');
      if (response.data.whatsapp && response.data.whatsapp.length > 0) {
        setWhatsappNumber(response.data.whatsapp[0].value);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
      // Fallback to default number
      setWhatsappNumber('+96599615116');
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber || '+96599615116';
    const message = encodeURIComponent(t('whatsapp.message'));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (!whatsappNumber) {
    return null; // Don't show button if no WhatsApp number is available
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
      aria-label={t('whatsapp.label')}
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppButton;