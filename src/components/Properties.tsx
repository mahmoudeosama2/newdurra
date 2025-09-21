import * as React from 'react';
import { X, MapPin, Eye, ArrowRight, Star, Calendar, Building, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Properties: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  
  // Refs for scroll containers (one for each property that might need scrolling)
  const scrollRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
 
  const SERVER_IMAGES_BASE_URL = 'https://hacokw.com/uplods/Images';
  const SERVER_VIDEOS_BASE_URL = 'https://hacokw.com/uplods/videos';

  // Define all server image URLs
  const serverImages = {
    // Main Jabriya image
    jabriyaImg: `${SERVER_IMAGES_BASE_URL}/jabriya.jpg`,
    
    // Al Jabriya Hotel Images
    aljabria1: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/asd.jpg`,
    aljabria2: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/asdd.jpg`,
    aljabria3: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/casc.jpg`,
    aljabria4: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/cx.jpg`,
    aljabria5: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/dds.jpg`,
    aljabria6: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/ew.jpg`,
    aljabria7: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/fs.jpg`,
    aljabria8: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/hf.jpg`,
    aljabria9: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/hhf.jpg`,
    aljabria10: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/jhg.jpg`,
    aljabria11: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/jj.jpg`,
    aljabria12: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/mb.jpg`,
    aljabria13: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/re.jpg`,
    aljabria14: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/Screenshot 2025-07-29 165559.png`,
    aljabria15: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/Screenshot 2025-07-29 170035.png`,
    aljabria16: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/Screenshot 2025-07-29 170427.png`,
    aljabria17: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/vcvcv.jpg`,
    aljabria18: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/vvc.jpg`,
    aljabria19: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/vvcvx.jpg`,
    aljabria20: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_9f302c48.jpg`,
    aljabria21: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_77e9edfb.jpg`,
    aljabria22: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.53_94b1c07a.jpg`,
    aljabria23: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_4a009ce5.jpg`,
    aljabria24: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_04b4a11c.jpg`,
    aljabria25: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_9ed7b2c2.jpg`,
    aljabria26: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.54_b65989e5.jpg`,
    aljabria27: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.55_7b5872aa.jpg`,
    aljabria30: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.55_df663050.jpg`,
    aljabria32: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_7842b42a.jpg`,
    aljabria33: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_c9a5ffee.jpg`,
    aljabria34: `${SERVER_IMAGES_BASE_URL}/aljabriahotel/WhatsApp Image 2025-08-01 at 22.31.56_ce9dc41d.jpg`,

    // Additional images
    three: `${SERVER_IMAGES_BASE_URL}/3.jpg`,
    four: `${SERVER_IMAGES_BASE_URL}/4.jpg`,
    five: `${SERVER_IMAGES_BASE_URL}/5.jpg`,
    six: `${SERVER_IMAGES_BASE_URL}/6.jpg`,

    // Al Rayaan Complex Salmiyah
    alrayaan1: `${SERVER_IMAGES_BASE_URL}/alrayaancomplexsalmiyah/alryan5.jpg`,
    alrayaan2: `${SERVER_IMAGES_BASE_URL}/alrayaancomplexsalmiyah/alryan6.jpg`,
    alrayaan3: `${SERVER_IMAGES_BASE_URL}/alrayaancomplexsalmiyah/alryan8.jpg`,

    // Bnid Al-Qar Complex
    bnidAlqar14and16: `${SERVER_IMAGES_BASE_URL}/bnidalqar/bned2.jpg`,
    bnidAlqar16and14: `${SERVER_IMAGES_BASE_URL}/bnidalqar/bned1.jpg`,

    // La Plage Complex
    lablag1: `${SERVER_IMAGES_BASE_URL}/lablagcomplex/lablag2.jpg`,
    lablag2: `${SERVER_IMAGES_BASE_URL}/lablagcomplex/lablag1.jpg`,

    // Mahbullah Properties
    mahbullah1: `${SERVER_IMAGES_BASE_URL}/mahbullah216/mahboula1.jpg`,
    mahbullahComplex1: `${SERVER_IMAGES_BASE_URL}/mahbullahcomplex/mahboula3.jpg`,
    mahbullahComplex2: `${SERVER_IMAGES_BASE_URL}/mahbullahcomplex/mahboula4.jpg`,

    // Residential Villas and Houses
    villa1: `${SERVER_IMAGES_BASE_URL}/residentialvillasandhouses/romisia3.jpg`,
    villa2: `${SERVER_IMAGES_BASE_URL}/residentialvillasandhouses/salwa7.jpg`,
    villa3: `${SERVER_IMAGES_BASE_URL}/residentialvillasandhouses/romisia7.jpg`,
    villa4: `${SERVER_IMAGES_BASE_URL}/residentialvillasandhouses/romisia9.jpg`,
    villa5: `${SERVER_IMAGES_BASE_URL}/residentialvillasandhouses/romisia12.jpg`,

    // Previous Managed Properties
    hamra1: `${SERVER_IMAGES_BASE_URL}/previous-managed/hamra-residence-1.jpg`,
    hamra2: `${SERVER_IMAGES_BASE_URL}/previous-managed/hamra-residence-3.jpg`,
    hamra3: `${SERVER_IMAGES_BASE_URL}/previous-managed/hamra-residence-4.jpg`,
    salam1: `${SERVER_IMAGES_BASE_URL}/previous-managed/salam-mall-2.jpg`,
    salam2: `${SERVER_IMAGES_BASE_URL}/previous-managed/salam-mall-4.jpg`,
    salam3: `${SERVER_IMAGES_BASE_URL}/previous-managed/salam-mall-6.jpg`,
    salam4: `${SERVER_IMAGES_BASE_URL}/previous-managed/salam-mall-7.jpg`,
    salam5: `${SERVER_IMAGES_BASE_URL}/previous-managed/salam-mall-8.jpg`,

    // Construction and Renovation Projects
    cartblanche1: `${SERVER_IMAGES_BASE_URL}/construction-renovation/cartblanche-2.jpg`,
    cartblanche2: `${SERVER_IMAGES_BASE_URL}/construction-renovation/cartblanche-3.jpg`,
    clinic1: `${SERVER_IMAGES_BASE_URL}/construction-renovation/medical-clinic-1.jpg`,
    clinic2: `${SERVER_IMAGES_BASE_URL}/construction-renovation/medical-clinic.jpg`,
  };

  // Define server video URLs
  const serverVideos = {
    jabriyaVideo: `${SERVER_VIDEOS_BASE_URL}/aljabria-video.mp4`
  };

  // Scroll functions
  const scrollGallery = (direction: 'left' | 'right', scrollKey: string) => {
    const container = scrollRefs.current[scrollKey];
    if (container) {
      const scrollAmount = 300; // Amount to scroll in pixels
      const currentScroll = container.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Al Jabriya complete gallery
  const aljabriaGallery = [
    serverImages.jabriyaImg, serverImages.aljabria1, serverImages.aljabria2, serverImages.aljabria3, 
    serverImages.aljabria4, serverImages.aljabria5, serverImages.aljabria6, serverImages.aljabria7, 
    serverImages.aljabria8, serverImages.aljabria9, serverImages.aljabria10, serverImages.aljabria11, 
    serverImages.aljabria12, serverImages.aljabria13, serverImages.aljabria14, serverImages.aljabria15, 
    serverImages.aljabria16, serverImages.aljabria17, serverImages.aljabria18, serverImages.aljabria19, 
    serverImages.aljabria20, serverImages.aljabria21, serverImages.aljabria22, serverImages.aljabria23, 
    serverImages.aljabria24, serverImages.aljabria25, serverImages.aljabria26, serverImages.aljabria27,
    serverImages.aljabria30, serverImages.aljabria32, serverImages.aljabria33, serverImages.aljabria34, 
    serverImages.five, serverImages.six, serverImages.three, serverImages.four
  ];

  // Grouped properties by folder/category with your actual images and original translations
  const propertyGroups = [
    {
      folderName: t("folders.current"),
      folderNameEn: "Current Properties",
      category: 'current',
      properties: [
        {
          image: serverImages.jabriyaImg,
          title: t('properties.jabriya.title'),
          category: 'current',
          featured: true,
          video: serverVideos.jabriyaVideo,
          gallery: aljabriaGallery,
          isHighlight: true // Flag for special treatment
        },
        // {
        //   image: btbuilding,
        //   title: t('properties.btbuilding.title'),
        //   category: 'current',
        //   gallery: [btbuilding]
        // },
        // {
        //   image: daralawad,
        //   title: t('properties.daralawad.title'),
        //   category: 'current',
        //   gallery: [daralawad]
        // },
        // {
        //   image: altijari,
        //   title: t('properties.altijari.title'),
        //   category: 'current',
        //   gallery: [altijari]
        // }
      ]
    },
    {
      folderName: t("folders.alrayaan"),
      folderNameEn: "alrayaancomplexsalmiyah",
      category: 'complexes',
      properties: [
        {
          image: serverImages.alrayaan1,
        //  title: t('properties.alrayaan.title'),
          category: 'complexes',
          location: 'https://maps.app.goo.gl/n7ZhwdxmRNbRTKe7A',
          featured: false,
          gallery: [serverImages.alrayaan1, serverImages.alrayaan2, serverImages.alrayaan3]
        }
      ]
    },
    {
      folderName: t("folders.bnidalqar"),
      folderNameEn: "Bnid Al-Qar Complex",
      category: 'complexes',
      properties: [
        {
          image: serverImages.bnidAlqar16and14,
          //title: t('properties.bnidalqar.title'),
          category: 'complexes',
          featured: false,
          gallery: [serverImages.bnidAlqar16and14, serverImages.bnidAlqar14and16]
        }
      ]
    },
    {
      folderName: t("folders.laplage"),
      folderNameEn: "La Plage Complex - Arabian Gulf Street",
      category: 'complexes',
      properties: [
        {
          image: serverImages.lablag1,
       //   title: t('properties.lablag.title'),
          category: 'complexes',
          location: 'https://maps.app.goo.gl/n3va1GHMwC6Q9AVdA',
          gallery: [serverImages.lablag1, serverImages.lablag2]
        }
      ]
    },
    // {
    //   folderName: t("folders.mahbullahComplex"),
    //   folderNameEn: "Mahbullah 216 Properties",
    //   category: 'residential',
    //   properties: [
    //     {
    //       image: mahbullah1,
    //       title: t('properties.mahbullah216.title'),
    //       category: 'residential',
    //       location: 'https://maps.app.goo.gl/L6xEWegmmwMEsVcJ8',
    //       gallery: [mahbullah1, mahbullah2]
    //     }
    //   ]
    // },
    {
      folderName: t("folders.mahbullahComplex"),
      folderNameEn: "Mahbullah Complex",
      category: 'complexes',
      properties: [
        {
          image: serverImages.mahbullahComplex1,
       //   title: t('properties.mahbullahComplex.title'),
          category: 'complexes',
          location: 'https://maps.app.goo.gl/SwHvnd4NYuNvPEJ68',
          featured: false,
          gallery: [serverImages.mahbullahComplex1, serverImages.mahbullahComplex2]
        }
      ]
    },
    {
      folderName: t("folders.villas"),
      folderNameEn: "Residential Houses and Villas",
      category: 'residential',
      properties: [
        {
          image: serverImages.villa1,
        //  title: t('properties.villa1.title'),
          category: 'residential',
          location: 'https://maps.app.goo.gl/dFJEcctsmeZQeoMQ6',
          gallery: [serverImages.villa1, serverImages.villa2, serverImages.villa3, serverImages.villa4, serverImages.villa5, serverImages.mahbullah1]
        }
      ]
    },
    {
      folderName: t("folders.previous"),
      folderNameEn: "Previously Managed Properties",
      category: 'previous',
      properties: [
        {
          image: serverImages.hamra1,
          title: t('properties.hamra.title'),
          category: 'previous',
          gallery: [serverImages.hamra1, serverImages.hamra2, serverImages.hamra3]
        },
        {
          image: serverImages.salam1,
          title: t('properties.salam1.title'),
          category: 'previous',
          gallery: [serverImages.salam1, serverImages.salam2, serverImages.salam3, serverImages.salam4, serverImages.salam5]
        }
      ]
    },
    {
      folderName: t("folders.construction"),
      folderNameEn: "Construction and Renovation Projects",
      category: 'construction',
      properties: [
        {
          image: serverImages.cartblanche1,
          title: t('properties.cartblanche.title'),
          category: 'construction',
          location: 'https://maps.app.goo.gl/aEMH9R7P6fSxadVPA',
          gallery: [serverImages.cartblanche1, serverImages.cartblanche2]
        },
        {
          image: serverImages.clinic1,
          title: t('properties.clinic.title'),
          category: 'construction',
          location: 'https://maps.app.goo.gl/4HxqXRS89skExD6P9',
          gallery: [serverImages.clinic1, serverImages.clinic2]
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: t('categories.all'), icon: Building },
    { id: 'current', name: t('categories.current'), icon: Star },
    { id: 'complexes', name: t('categories.complexes'), icon: Building },
    { id: 'residential', name: t('categories.residential'), icon: Building },
    { id: 'previous', name: t('categories.previous'), icon: Calendar },
    { id: 'construction', name: t('categories.construction'), icon: Building }
  ];

  const filteredGroups = activeCategory === 'all' 
    ? propertyGroups 
    : propertyGroups.filter(group => group.category === activeCategory);

  const handleLocationClick = (location: string) => {
    window.open(location, '_blank');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      current: 'from-emerald-500 to-teal-600',
      complexes: 'from-blue-500 to-indigo-600',
      residential: 'from-purple-500 to-pink-600',
      previous: 'from-orange-500 to-red-600',
      construction: 'from-yellow-500 to-amber-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <section id="properties" className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent mb-6">
            {t('properties.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('exploreDescription')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-full font-medium transition-all duration-300 border ${
                  activeCategory === category.id
                    ? 'text-white shadow-lg border-blue-600'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
                style={activeCategory === category.id ? { 
                  background: 'linear-gradient(to right, #004aaf, #0056cc)',
                  boxShadow: '0 4px 14px 0 rgba(0, 74, 175, 0.25)'
                } : {}}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <Icon size={18} />
                  <span>{category.name}</span>
                </div>
                {activeCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Properties Groups */}
        <div className="space-y-16">
          {filteredGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-8">
              {/* Group Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-blue-50 backdrop-blur-sm border border-blue-200 rounded-full px-8 py-4 mb-4">
                  <Building className="w-6 h-6" style={{ color: '#004aaf' }} />
                  <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#004aaf' }}>
                    {group.folderName}
                  </h3>
                </div>
                <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}></div>
              </div>

              {/* Properties Grid for this group */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {group.properties.map((property, index) => {
                  const cardId = `${group.category}-${groupIndex}-${index}`;
                  const scrollKey = `scroll-${cardId}`;
                  const isHovered = hoveredCard === cardId;
                  const isJabriya = property.isHighlight;
                  const hasMultipleImages = property.gallery && property.gallery.length > 1;
                  
                  return (
                    <div
                      key={cardId}
                      className={`group relative transition-all duration-500 ${
                        isJabriya 
                          ? 'md:col-span-2 lg:col-span-2 xl:col-span-3' // Full width for Jabriya
                          : ''
                      } ${
                        property.featured ? 'ring-2 ring-amber-500/20' : ''
                      } ${isHovered ? 'transform scale-105 shadow-2xl shadow-amber-500/10' : 'hover:transform hover:scale-102'}`}
                      onMouseEnter={() => setHoveredCard(cardId)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={`bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 transition-all duration-500 hover:border-blue-400 shadow-lg ${
                        isJabriya ? 'ring-4 ring-blue-300 shadow-2xl shadow-blue-500/20' : ''
                      }`}>
                        {/* Featured Badge */}
                        {property.featured && (
                          <div className="absolute top-4 left-4 z-20">
                            <div className="flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}>
                              <Star size={14} fill="currentColor" />
                              <span>{t("distinct")}</span>
                            </div>
                          </div>
                        )}

                        {/* Video Badge */}
                        {property.video && (
                          <div className="absolute top-4 right-4 z-20">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              <Play size={14} fill="currentColor" />
                              <span>{t('video')}</span>
                            </div>
                          </div>
                        )}

                        {/* Main Image Container - تم تطويل صورة الجابرية */}
                        <div className={`relative overflow-hidden ${isJabriya ? 'h-96 md:h-[28rem]' : 'h-80'}`}>
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(property.category)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                          
                          {/* Action Buttons Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <button
                                onClick={() => setSelectedImage(property.image)}
                                className="bg-white/90 hover:bg-white text-black p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                              >
                                <Eye size={20} />
                              </button>
                              {property.video && (
                                <button
                                  onClick={() => setSelectedVideo(property.video!)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                                >
                                  <Play size={20} />
                                </button>
                              )}
                              {property.location && (
                                <button
                                  onClick={() => handleLocationClick(property.location!)}
                                  className="text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                                  style={{ backgroundColor: '#004aaf' }}
                                >
                                  <MapPin size={20} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category Tag */}
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}>
                              {categories.find(c => c.id === property.category)?.name}
                            </span>
                          </div>

                          <h4 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                            isJabriya ? 'text-2xl md:text-3xl' : 'text-xl'
                          }`}>
                            {property.title}
                          </h4>

                          {/* Special description for Jabriya */}
                          {isJabriya && (
                            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                              {t('title.aljbria')}
                            </p>
                          )}

                          {/* Gallery thumbnails with scroll controls */}
                          {hasMultipleImages && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(to right, #004aaf, #0056cc)' }}></div>
                                  <span className="text-sm text-gray-600 font-medium">
                                    {t("gallery")} ({property.gallery!.length} )
                                  </span>
                                </div>
                                
                                {/* Scroll Controls - Show only for galleries with many images */}
                                {property.gallery!.length > 5 && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => scrollGallery('left', scrollKey)}
                                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                      style={{ color: '#004aaf' }}
                                      aria-label="التمرير للخلف"
                                    >
                                      <ChevronLeft size={16} />
                                    </button>
                                    <button
                                      onClick={() => scrollGallery('right', scrollKey)}
                                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                      style={{ color: '#004aaf' }}
                                      aria-label="التمرير للأمام"
                                    >
                                      <ChevronRight size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              {/* Horizontal Scrollable Gallery with improved styling */}
                              <div className="relative">
                                <div 
                                  ref={(el) => scrollRefs.current[scrollKey] = el}
                                  className={`flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth ${
                                    isJabriya ? 'snap-x snap-mandatory' : ''
                                  }`} 
                                  style={{ 
                                    scrollbarWidth: 'none', 
                                    msOverflowStyle: 'none',
                                    WebkitScrollbar: { display: 'none' }
                                  }}
                                >
                                  {property.gallery!.map((galleryImg, galleryIndex) => (
                                    <div
                                      key={galleryIndex}
                                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group/thumb hover:ring-2 hover:ring-amber-500/50 transition-all duration-200 hover:scale-105 ${
                                        isJabriya ? 'snap-start' : ''
                                      }`}
                                     style={{ '--tw-ring-color': '#004aaf' } as React.CSSProperties}
                                      onClick={() => setSelectedImage(galleryImg)}
                                    >
                                      <img
                                        src={galleryImg}
                                        alt={`${property.title} - صورة ${galleryIndex + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-200"
                                        loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <Eye size={14} className="text-white" />
                                      </div>
                                      {/* Image Number Badge */}
                                      <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200">
                                        {galleryIndex + 1}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Enhanced Progress Indicator for Jabriya */}
                                {isJabriya && (
                                  <div className="flex justify-center mt-3">
                                    <div className="flex items-center gap-2 bg-gray-100 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                      <span className="text-xs font-medium" style={{ color: '#004aaf' }}>
                                       {t("move")}
                                      </span>
                                      <div className="flex gap-1">
                                        {[...Array(Math.ceil(property.gallery!.length / 5))].map((_, i) => (
                                          <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: 'rgba(0, 74, 175, 0.3)' }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className={`absolute inset-0 rounded-2xl ${
                            isJabriya 
                              ? 'blur-xl' 
                              : 'blur-xl'
                          }`} 
                          style={{ 
                            background: isJabriya 
                              ? 'linear-gradient(to right, rgba(0, 74, 175, 0.2), rgba(0, 86, 204, 0.2))' 
                              : 'linear-gradient(to right, rgba(0, 74, 175, 0.1), rgba(0, 86, 204, 0.1))'
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-20">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد عقارات في هذه الفئة</h3>
            <p className="text-gray-500">جرب تصفح فئة أخرى لعرض المزيد من العقارات</p>
          </div>
        )}
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 rounded-full p-3 transition-all duration-200 z-10 shadow-2xl hover:scale-110"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="عرض كامل"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal for video */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative max-w-7xl max-h-full animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white bg-black/70 hover:bg-black/90 rounded-full p-3 transition-all duration-200 z-10 shadow-2xl hover:scale-110"
            >
              <X size={24} />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              متصفحك لا يدعم تشغيل الفيديو
            </video>
          </div>
        </div>
      )}

      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Properties;