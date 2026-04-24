import React, { useState } from 'react';
import { Camera, Maximize2, X, Sparkles } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  // Realistic and high-quality coaching/education images from Unsplash
  const galleryItems = [
    {
      id: 1,
      url: "./g1.webp",
      category: "events",
      title: "Interactive Smart Class"
    },
    {
      id: 2,
      url: "./g2.webp",
      category: "events",
      title: "Group Discussion"
    },

 
  
  
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'classroom', label: 'Classrooms' },
    { id: 'students', label: 'Students' },
    { id: 'campus', label: 'Campus' },
    { id: 'events', label: 'Events' }
  ];

  const filteredImages = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
         <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Mourya Accadmy <span className="text-emerald-600 ">Gallery</span>
          </h1>
      
        
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id}
              className="group relative h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer bg-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onClick={() => setSelectedImage(image)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                   <div className="flex justify-between items-end">
                      <div>
                        <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-lg mb-2 uppercase tracking-wide">
                          {image.category}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-500">No images found for this category.</h3>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm px-4">
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-6xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-full max-h-[85vh] object-contain bg-black/50"
            />
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent">
               <h3 className="text-white font-bold text-2xl">{selectedImage.title}</h3>
               <p className="text-emerald-400 font-medium capitalize mt-1">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
