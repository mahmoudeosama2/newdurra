import * as React from 'react';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'مجموعة حامد عوض' : 'Hamed Awadh Group'}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {/* <a href="https://www.facebook.com/mahmoudeosama2" target="_blank" rel="noopener noreferrer" className="bg-slate-800 hover:bg-amber-500 p-3 rounded-full transition-colors">
                <Facebook size={20} />
              </a> */}
              <a href="https://www.instagram.com/eldurraworld/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full transition-colors hover:bg-blue-600" style={{ backgroundColor: '#004aaf' }}>
                <Instagram size={20} />
              </a>
            </div>
          </div>
                   
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">{t('nav.home')}</a></li>
              <li><a href="#properties" className="text-gray-300 hover:text-blue-400 transition-colors">{t('nav.properties')}</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">{t('nav.about')}</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">{t('nav.contact')}</a></li>
            </ul>
                         
            <div className="mt-6 space-y-3">
              <div>
                <h4 className="text-lg font-semibold mb-2" style={{ color: '#004aaf' }}>{t('footer.company')}</h4>
                 <p className="text-gray-300 text-sm">
                 {language === 'ar' ? 'شركة حامد عوض'  : 'Hamed Awadh CO'}
                </p>
                <p className="text-gray-300 text-sm">
                 {language === 'ar' ? 'شركة درة العالم' : 'WORLD DURRA CO'}
                </p>
                {/* <p className="text-gray-300 text-sm">
                  {language === 'ar' ? 'شركة حامد عوض الدولية' : 'Hamed Awadh  International'}
                </p> */}
                <p className="text-gray-300 text-sm">
                  {language === 'ar' ? 'شركة درة الخليج' : 'Gulf Durra Co'}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2" style={{ color: '#004aaf' }}>{t('footer.services')}</h4>
                <p className="text-gray-300">
                  {language === 'ar' ? 'إدارة وتأجير العقارات' : 'Property Management & Leasing'}
                </p>
              </div>
            </div>
          </div>
                   
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            
            {/* Phone Numbers */}
            <div className="mb-4">
              <h5 className="font-medium mb-2 flex items-center" style={{ color: '#004aaf' }}>
                <Phone size={16} className="mr-2" />
                {t('footer.phoneNumbers')}
              </h5>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>22269915 </li>
                <li>22269916 </li>
                <li>22269917 </li>
              </ul>
            </div>

            {/* Email Addresses */}
            <div className="mb-4">
              <h5 className="font-medium mb-2 flex items-center" style={{ color: '#004aaf' }}>
                <Mail size={16} className="mr-2" />
                {t('footer.emails')}
              </h5>
              <ul className="space-y-1 text-gray-300 text-sm">

                <li>
                  <a href="mailto:info@hamedawadh-int.com" className="hover:text-blue-400 transition-colors">
                    info@hamedawadh-int.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Address */}
            <div>
              <h5 className="font-medium mb-2" style={{ color: '#004aaf' }}>{t('footer.address')}</h5>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>{t('footer.country')}</li>

              </ul>
            </div>
          </div>
        </div>
                 
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {language === 'ar' ? 'مجموعة حامد عوض' : 'Hamed Awadh Group'}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;