import axios from 'axios';
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Folder,
  LogOut,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Dashboard = ({ user, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: ''
  });
  
  const [imageForm, setImageForm] = useState({
    title: '',
    title_ar: '',
    video_url: '',
    file: null
  });

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders()
      });
      setCategories(response.data || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
      if (err.response?.status === 401) {
        onLogout(); // Token expired
        return;
      }
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  // Category operations
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/categories`, categoryForm, {
        headers: getAuthHeaders()
      });
      showMessage('Category created successfully');
      setShowCategoryModal(false);
      setCategoryForm({ name: '', name_ar: '', description: '', description_ar: '' });
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      showMessage(err.response?.data?.error || 'Failed to create category', 'error');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/categories/${editingCategory.id}`, categoryForm, {
        headers: getAuthHeaders()
      });
      showMessage('Category updated successfully');
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', name_ar: '', description: '', description_ar: '' });
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      showMessage(err.response?.data?.error || 'Failed to update category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category and all its images?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
        headers: getAuthHeaders()
      });
      showMessage('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      showMessage(err.response?.data?.error || 'Failed to delete category', 'error');
    }
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name_en || category.name || '',
      name_ar: category.name_ar || '',
      description: category.description_en || category.description || '',
      description_ar: category.description_ar || ''
    });
    setShowCategoryModal(true);
  };

  // Image operations
  const handleUploadImage = async (e) => {
    e.preventDefault();
    
    if (!imageForm.file) {
      showMessage('Please select a file', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', imageForm.file);
    formData.append('category_id', selectedCategoryId);
    formData.append('title', imageForm.title);
    formData.append('title_ar', imageForm.title_ar);
    formData.append('video_url', imageForm.video_url);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/images`, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      });
      showMessage('Image uploaded successfully');
      setShowImageModal(false);
      setImageForm({ title: '', title_ar: '', video_url: '', file: null });
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      showMessage(err.response?.data?.error || 'Failed to upload image', 'error');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/images/${imageId}`, {
        headers: getAuthHeaders()
      });
      showMessage('Image deleted successfully');
      fetchCategories();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
        return;
      }
      showMessage(err.response?.data?.error || 'Failed to delete image', 'error');
    }
  };

  const openImageModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowImageModal(true);
  };

  // Helper function to get images from category
  const getCategoryImages = (category) => {
    // Check if category has properties with images (new structure)
    if (category.properties && category.properties.length > 0) {
      const allImages = [];
      category.properties.forEach(property => {
        if (property.images && property.images.length > 0) {
          allImages.push(...property.images);
        }
      });
      return allImages;
    }
    // Fallback to direct images (old structure)
    return category.images || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {(success || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryImages = getCategoryImages(category);
            return (
              <div key={category.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Folder className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name_en || category.name}
                      </h3>
                      {category.name_ar && (
                        <p className="text-sm text-gray-600">{category.name_ar}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditCategory(category)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {(category.description_en || category.description) && (
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description_en || category.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {categoryImages.length} images
                  </span>
                  <button
                    onClick={() => openImageModal(category.id)}
                    className="btn-primary text-sm flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Upload
                  </button>
                </div>

                {/* Images Grid */}
                {categoryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {categoryImages.slice(0, 6).map((image) => (
                      <div key={image.id} className="relative group">
                        <img
src={image.image_url || `${API_BASE_URL.replace('/api', '')}/uploads/${image.filename}`}
                          alt={image.title || image.title_en || image.original_name}
                          className="w-full h-16 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {categoryImages.length > 6 && (
                      <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                        +{categoryImages.length - 6} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Create your first category to get started</p>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="btn-primary"
            >
              Create Category
            </button>
          </div>
        )}
      </main>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
            
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Arabic)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={categoryForm.name_ar}
                    onChange={(e) => setCategoryForm({...categoryForm, name_ar: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Arabic)
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={categoryForm.description_ar}
                    onChange={(e) => setCategoryForm({...categoryForm, description_ar: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', name_ar: '', description: '', description_ar: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Upload Image</h2>
            
            <form onSubmit={handleUploadImage}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image File *
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/*,video/*"
                    className="input-field"
                    onChange={(e) => setImageForm({...imageForm, file: e.target.files[0]})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={imageForm.title}
                    onChange={(e) => setImageForm({...imageForm, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={imageForm.title_ar}
                    onChange={(e) => setImageForm({...imageForm, title_ar: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://..."
                    value={imageForm.video_url}
                    onChange={(e) => setImageForm({...imageForm, video_url: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageModal(false);
                    setImageForm({ title: '', title_ar: '', video_url: '', file: null });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;