import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { itemsAPI, usersAPI } from '../services/api';
import { Upload, X, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { data: myItems } = useQuery(['my-items'], () => usersAPI.getMyItems());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const createItemMutation = useMutation(
    (itemData) => itemsAPI.create(itemData),
    {
      onSuccess: (data) => {
        toast.success('Item created successfully!');
        queryClient.invalidateQueries(['items']);
        queryClient.invalidateQueries(['my-items']);
        navigate(`/items/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create item');
      },
    }
  );

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error('Some files were invalid. Only images under 5MB are allowed.');
    }
    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    const itemData = {
      ...data,
      tags: JSON.stringify(tags),
      price_points: parseInt(data.price_points),
    };
    createItemMutation.mutate(itemData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2">
          <input
            type="text"
            placeholder="Search for clothing, brands, or categories..."
            className="flex-1 bg-transparent outline-none text-gray-700"
            disabled
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-12 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Product Detail Page</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add Images */}
            <div>
              <div className="w-full aspect-square bg-gray-200 rounded-xl flex flex-col items-center justify-center overflow-hidden mb-4">
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full h-full p-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-gray-400">Add Images</span>
                  </div>
                )}
              </div>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="btn-secondary cursor-pointer w-full block text-center">Choose Images</label>
            </div>
            {/* Add Product Description */}
            <div className="flex flex-col h-full">
              <div className="bg-white rounded-xl shadow p-6 flex-1 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Product Description</label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                    maxLength: { value: 500, message: 'Description cannot exceed 500 characters' },
                  })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your item in detail..."
                />
                {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full">Available/Swap</button>
            </div>
          </div>
        </form>
        {/* Previous Listings */}
        <div className="mt-12">
          <h2 className="text-md font-semibold text-gray-800 mb-2">Previous Listings:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {myItems && myItems.length > 0 ? (
              myItems.slice(0, 4).map(item => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg shadow flex flex-col hover:shadow-md transition"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {item.image_urls ? (
                      <img src={JSON.parse(item.image_urls)[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h4>
                    <span className="badge badge-primary text-xs">{item.price_points} pts</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">No previous listings.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 