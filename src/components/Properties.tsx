import * as React from "react";
import {
  X,
  MapPin,
  Eye,
  ArrowRight,
  Star,
  Calendar,
  Building,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const Properties: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Refs for scroll containers
  const scrollRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/categories");

      console.log("Categories API Response:", response);
      console.log("Categories Data:", response.data);
      console.log("Is Array?", Array.isArray(response.data));

      // استخدم البيانات الحقيقية من الباك إند مباشرة
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.error("Error details:", error.response || error);

      // فقط في حالة فشل الـ API، استخدم mock data
      console.warn("API failed, using empty array");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll functions
  const scrollGallery = (direction: "left" | "right", scrollKey: string) => {
    const container = scrollRefs.current[scrollKey];
    if (container) {
      const scrollAmount = 300;
      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Dynamic category mapping
  const categoryTypes = [
    { id: "all", name: t("categories.all"), icon: Building },
    { id: "current", name: t("categories.current"), icon: Star },
    { id: "complexes", name: t("categories.complexes"), icon: Building },
    { id: "residential", name: t("categories.residential"), icon: Building },
    { id: "previous", name: t("categories.previous"), icon: Calendar },
    { id: "construction", name: t("categories.construction"), icon: Building },
  ];

  // Map backend categories to frontend category types
  const getCategoryType = (categoryName: string) => {
    if (!categoryName) return "current";
    const name = categoryName.toLowerCase();
    if (name.includes("current")) return "current";
    if (
      name.includes("complex") ||
      name.includes("alrayaan") ||
      name.includes("plage") ||
      name.includes("mahbullah")
    )
      return "complexes";
    if (
      name.includes("residential") ||
      name.includes("villa") ||
      name.includes("house")
    )
      return "residential";
    if (name.includes("previous") || name.includes("managed"))
      return "previous";
    if (name.includes("construction") || name.includes("renovation"))
      return "construction";
    return "current";
  };

  // فلترة الفئات بناءً على النوع المختار
  const filteredCategories = React.useMemo(() => {
    if (!Array.isArray(categories)) return [];

    // تحويل images إلى properties format
    const categoriesWithProperties = categories.map((category) => {
      // استخدم images بدلاً من properties
      const categoryImages = category.images || [];

      // جمع الصور حسب property_id
      const propertiesMap = {};

      categoryImages.forEach((image) => {
        const propId = image.property_data?.id || `img-${image.id}`;

        if (!propertiesMap[propId]) {
          propertiesMap[propId] = {
            id: propId,
            title_en:
              image.property_data?.title_en || image.title || image.title_en,
            title_ar: image.property_data?.title_ar || image.title_ar,
            description_en:
              image.property_data?.description_en || category.description,
            description_ar:
              image.property_data?.description_ar || category.description_ar,
            featured: image.property_data?.featured || image.featured || false,
            video_url: image.property_data?.video_url || image.video_url,
            location: image.property_data?.location || image.location,
            images: [],
          };
        }

        propertiesMap[propId].images.push({
          id: image.id,
          image_url: image.image_url,
          sort_order: image.sort_order || 0,
        });
      });

      // تحويل الmap لarray وترتيب الصور
      const properties = Object.values(propertiesMap).map((property) => ({
        ...property,
        images: property.images.sort((a, b) => a.sort_order - b.sort_order),
      }));

      return {
        ...category,
        properties: properties,
      };
    });
    return activeCategory === "all"
      ? categoriesWithProperties
      : categoriesWithProperties.filter(
          (category) =>
            getCategoryType(category.name_en || category.name) ===
            activeCategory
        );
  }, [categories, activeCategory]);

  const handleLocationClick = (location: string) => {
    window.open(location, "_blank");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      current: "from-emerald-500 to-teal-600",
      complexes: "from-blue-500 to-indigo-600",
      residential: "from-purple-500 to-pink-600",
      previous: "from-orange-500 to-red-600",
      construction: "from-yellow-500 to-amber-600",
    };
    return (
      colors[category as keyof typeof colors] || "from-gray-500 to-gray-600"
    );
  };

  if (loading) {
    return (
      <section
        id="properties"
        className="py-20 bg-gradient-to-br from-white via-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="properties"
      className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent mb-6">
            {t("properties.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("exploreDescription")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categoryTypes.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-full font-medium transition-all duration-300 border ${
                  activeCategory === category.id
                    ? "text-white shadow-lg border-blue-600"
                    : "bg-white/80 text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
                style={
                  activeCategory === category.id
                    ? {
                        background:
                          "linear-gradient(to right, #004aaf, #0056cc)",
                        boxShadow: "0 4px 14px 0 rgba(0, 74, 175, 0.25)",
                      }
                    : {}
                }
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
          {filteredCategories.map((category, categoryIndex) => {
            console.log("Category:", category);
            console.log("Category Name AR:", category.name_ar);
            console.log("Category Name EN:", category.name_en || category.name);
            console.log("Category Properties:", category.properties);
            console.log("Properties length:", category.properties?.length);
            console.log("Category Images (raw):", category.images);
            if (category.properties?.length > 0) {
              console.log("First property structure:", category.properties[0]);
            }

            return (
              <div key={categoryIndex} className="space-y-8">
                {/* Group Header */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-blue-50 backdrop-blur-sm border border-blue-200 rounded-full px-8 py-4 mb-4">
                    <Building
                      className="w-6 h-6"
                      style={{ color: "#004aaf" }}
                    />
                    <h3
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: "#004aaf" }}
                    >
                      {language === "ar"
                        ? category.name_ar || category.name
                        : category.name_en || category.name}
                    </h3>
                  </div>
                  <div
                    className="w-24 h-1 mx-auto rounded-full"
                    style={{
                      background: "linear-gradient(to right, #004aaf, #0056cc)",
                    }}
                  ></div>
                </div>

                {/* Properties Grid for this category */}
                {category.properties &&
                Array.isArray(category.properties) &&
                category.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {category.properties.map((property, index) => {
                      const cardId = `${category.id}-${categoryIndex}-${index}`;
                      const scrollKey = `scroll-${cardId}`;
                      const isHovered = hoveredCard === cardId;
                      const isJabriya = property.featured;
                      const hasMultipleImages =
                        property.images &&
                        Array.isArray(property.images) &&
                        property.images.length > 1;
                      const mainImage =
                        property.images && property.images.length > 0
                          ? property.images[0].image_url
                          : null;
                      const propertyTitle =
                        language === "ar"
                          ? property.title_ar
                          : property.title_en;
                      const propertyDescription =
                        language === "ar"
                          ? property.description_ar
                          : property.description_en;

                      return (
                        <div
                          key={cardId}
                          className={`group relative transition-all duration-500 ${
                            isJabriya
                              ? "md:col-span-2 lg:col-span-2 xl:col-span-3"
                              : ""
                          } ${
                            property.featured ? "ring-2 ring-amber-500/20" : ""
                          } ${
                            isHovered
                              ? "transform scale-105 shadow-2xl shadow-amber-500/10"
                              : "hover:transform hover:scale-102"
                          }`}
                          onMouseEnter={() => setHoveredCard(cardId)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <div
                            className={`bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 transition-all duration-500 hover:border-blue-400 shadow-lg ${
                              isJabriya
                                ? "ring-4 ring-blue-300 shadow-2xl shadow-blue-500/20"
                                : ""
                            }`}
                          >
                            {/* Featured Badge */}
                            {property.featured && (
                              <div className="absolute top-4 left-4 z-20">
                                <div
                                  className="flex items-center gap-1 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #004aaf, #0056cc)",
                                  }}
                                >
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
                                  <span>{t("video")}</span>
                                </div>
                              </div>
                            )}

                            {/* Main Image Container */}
                            <div
                              className={`relative overflow-hidden ${
                                isJabriya ? "h-96 md:h-[28rem]" : "h-80"
                              }`}
                            >
                              {mainImage && (
                                <img
                                  src={mainImage}
                                  alt={propertyTitle}
                                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                />
                              )}

                              {/* Gradient Overlay */}
                              <div
                                className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(
                                  getCategoryType(category.name_en)
                                )} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                              />

                              {/* Action Buttons Overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  {mainImage && (
                                    <button
                                      onClick={() =>
                                        setSelectedImage(mainImage)
                                      }
                                      className="bg-white/90 hover:bg-white text-black p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                                    >
                                      <Eye size={20} />
                                    </button>
                                  )}
                                  {property.video_url && (
                                    <button
                                      onClick={() =>
                                        setSelectedVideo(property.video_url!)
                                      }
                                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                                    >
                                      <Play size={20} />
                                    </button>
                                  )}
                                  {property.location && (
                                    <button
                                      onClick={() =>
                                        handleLocationClick(property.location!)
                                      }
                                      className="text-white p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                                      style={{ backgroundColor: "#004aaf" }}
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
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                                  style={{
                                    background:
                                      "linear-gradient(to right, #004aaf, #0056cc)",
                                  }}
                                >
                                  {
                                    categoryTypes.find(
                                      (c) =>
                                        c.id ===
                                        getCategoryType(category.name_en)
                                    )?.name
                                  }
                                </span>
                              </div>

                              <h4
                                className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                                  isJabriya ? "text-2xl md:text-3xl" : "text-xl"
                                }`}
                              >
                                {propertyTitle}
                              </h4>

                              {/* Description */}
                              {propertyDescription && (
                                <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                                  {propertyDescription}
                                </p>
                              )}

                              {/* Gallery thumbnails with scroll controls */}
                              {hasMultipleImages && (
                                <div className="mt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded-full"
                                        style={{
                                          background:
                                            "linear-gradient(to right, #004aaf, #0056cc)",
                                        }}
                                      ></div>
                                      <span className="text-sm text-gray-600 font-medium">
                                        {t("gallery")} (
                                        {property.images!.length})
                                      </span>
                                    </div>

                                    {/* Scroll Controls */}
                                    {property.images!.length > 5 && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            scrollGallery("left", scrollKey)
                                          }
                                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                          style={{ color: "#004aaf" }}
                                          aria-label="التمرير للخلف"
                                        >
                                          <ChevronLeft size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            scrollGallery("right", scrollKey)
                                          }
                                          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200 hover:scale-110"
                                          style={{ color: "#004aaf" }}
                                          aria-label="التمرير للأمام"
                                        >
                                          <ChevronRight size={16} />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Horizontal Scrollable Gallery */}
                                  <div className="relative">
                                    <div
                                      ref={(el) =>
                                        (scrollRefs.current[scrollKey] = el)
                                      }
                                      className={`flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth ${
                                        isJabriya ? "snap-x snap-mandatory" : ""
                                      }`}
                                      style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        WebkitScrollbar: { display: "none" },
                                      }}
                                    >
                                      {property.images!.map(
                                        (image, galleryIndex) => (
                                          <div
                                            key={galleryIndex}
                                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer group/thumb hover:ring-2 hover:ring-amber-500/50 transition-all duration-200 hover:scale-105 ${
                                              isJabriya ? "snap-start" : ""
                                            }`}
                                            style={
                                              {
                                                "--tw-ring-color": "#004aaf",
                                              } as React.CSSProperties
                                            }
                                            onClick={() =>
                                              setSelectedImage(image.image_url)
                                            }
                                          >
                                            <img
                                              src={image.image_url}
                                              alt={`${propertyTitle} - صورة ${
                                                galleryIndex + 1
                                              }`}
                                              className="w-full h-full object-cover transition-transform duration-200"
                                              loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                              <Eye
                                                size={14}
                                                className="text-white"
                                              />
                                            </div>
                                            <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200">
                                              {galleryIndex + 1}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>

                                    {/* Progress Indicator for Jabriya */}
                                    {isJabriya && (
                                      <div className="flex justify-center mt-3">
                                        <div className="flex items-center gap-2 bg-gray-100 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                          <span
                                            className="text-xs font-medium"
                                            style={{ color: "#004aaf" }}
                                          >
                                            {t("move")}
                                          </span>
                                          <div className="flex gap-1">
                                            {[
                                              ...Array(
                                                Math.ceil(
                                                  property.images!.length / 5
                                                )
                                              ),
                                            ].map((_, i) => (
                                              <div
                                                key={i}
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{
                                                  backgroundColor:
                                                    "rgba(0, 74, 175, 0.3)",
                                                }}
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
                              <div
                                className={`absolute inset-0 rounded-2xl ${
                                  isJabriya ? "blur-xl" : "blur-xl"
                                }`}
                                style={{
                                  background: isJabriya
                                    ? "linear-gradient(to right, rgba(0, 74, 175, 0.2), rgba(0, 86, 204, 0.2))"
                                    : "linear-gradient(to right, rgba(0, 74, 175, 0.1), rgba(0, 86, 204, 0.1))",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === "ar"
                        ? "لا توجد عقارات في هذه الفئة حالياً"
                        : "No properties available in this category"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد عقارات في هذه الفئة
            </h3>
            <p className="text-gray-500">
              جرب تصفح فئة أخرى لعرض المزيد من العقارات
            </p>
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
      <style>{`
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
