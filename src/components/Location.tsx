import * as React from 'react';
import { MapPin, ExternalLink, Building, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Location: React.FC = () => {
  const { t } = useLanguage();
  
  // Base URL for server images
  const SERVER_IMAGES_BASE_URL = 'https://hacokw.com/uplods/Images';
  
  // Define server building image
  const buildingImage = `${SERVER_IMAGES_BASE_URL}/blue.jpg`;
  
  const openInGoogleMaps = () => {
    const coordinates = "29.3743,47.9894";
    const placeName = encodeURIComponent("شركة الدرة العالمية - الكويت - المرقاب - شارع خالد بن الوليد - برج مزايا 1");
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}&query_place_id=${placeName}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <section id="location" className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 border border-blue-200">
              <MapPin className="animate-pulse" style={{ color: '#004aaf' }} size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('location.title')}
              </h2>
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex justify-center mb-8">
            <div className="max-w-2xl w-full space-y-6">
              {/* Building Image Card */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}></div>
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={buildingImage} 
                      alt="مبنى شركة الدرة العالمية"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 text-white">
                        <Building style={{ color: '#004aaf' }} size={20} />
                        <span className="font-semibold text-lg">{t('footer.building')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info Cards - Centered */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-blue-400 transition-all duration-300 group">
                  <div className="flex items-center space-x-2 mb-3">
                    <Building style={{ color: '#004aaf' }} className="group-hover:scale-110 transition-transform" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('location.headquarters')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {t('contact.fullAddress')}
                  </p>
                  <button
                    onClick={openInGoogleMaps}
                    className="inline-flex items-center space-x-3 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                    style={{ 
                      background: 'linear-gradient(to right, #004aaf, #0056cc)',
                      boxShadow: '0 4px 14px 0 rgba(0, 74, 175, 0.25)'
                    }}
                  >
                    <MapPin size={20} className="group-hover:animate-bounce" />
                    <span>{t('location.openInMaps')}</span>
                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-blue-400 transition-all duration-300 group">
                  <div className="flex items-center space-x-2 mb-3">
                    <Navigation style={{ color: '#004aaf' }} className="group-hover:scale-110 transition-transform" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('location.projects')}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('location.projectsText')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Address Bar */}
         
        </div>
      </div>
    </section>
  );
};

export default Location;