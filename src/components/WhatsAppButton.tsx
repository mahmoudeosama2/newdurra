import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '+96599615116'; // Hamed Awadh Group number
    const message = encodeURIComponent(t('whatsapp.message'));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

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