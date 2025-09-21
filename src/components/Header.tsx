import * as React from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              {language === 'ar' ? 'درة العالم' : 'Hamed Awadh Group'}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.home')}
            </a>
            <a href="#properties" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.properties')}
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.about')}
            </a>
            <a href="#location" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.location')}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              {t('nav.contact')}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t('nav.home')}
              </a>
              <a href="#properties" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t('nav.properties')}
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t('nav.about')}
              </a>
              <a href="#location" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t('nav.location')}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t('nav.contact')}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;