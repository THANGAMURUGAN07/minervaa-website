import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X } from 'lucide-react';
import { getCoverUrl, getFullSizeUrl } from '../config/cloudinary';
import { galleryEventsConfig } from '../config/galleryConfig';

// Custom mapping for event button to folder
const eventFolderOverride = {
  // Add more overrides here if needed
};

export const GallerySection = () => {
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load gallery events with dynamic images
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        const response = await fetch('/gallery-manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          const eventsWithImages = galleryEventsConfig.map(event => {
            // Use override if present
            const folderKey = eventFolderOverride[event.folder?.toLowerCase()] || event.folder;
            return {
              ...event,
              images: manifest[folderKey] || []
            };
          });
          setGalleryEvents(eventsWithImages);
        } else {
          setGalleryEvents(galleryEventsConfig.map(event => ({
            ...event,
            images: []
          })));
        }
      } catch (error) {
        setGalleryEvents(galleryEventsConfig.map(event => ({
          ...event,
          images: []
        })));
      }
    };
    loadGalleryData();
  }, []);
  // Modal for selected event
  const [matchedFiles, setMatchedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    if (selectedEvent) {
      fetch(`/gallery-manifest.json`).then(res => res.json()).then(manifest => {
        const folderKey = eventFolderOverride[selectedEvent.folder?.toLowerCase()] || selectedEvent.folder;
        setMatchedFiles(manifest[folderKey] || []);
      });
    } else {
      setMatchedFiles([]);
      setPreviewImage(null);
    }
  }, [selectedEvent]);

  return (
    <section id="gallery" className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => event.images.length > 0 && setSelectedEvent(event)}
              className={`relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200 ${event.images.length > 0 ? 'cursor-pointer' : 'opacity-75'} group h-64`}
            >
              {/* Cover Photo or Placeholder */}
              <div className="absolute inset-0">
                {event.images.length > 0 ? (
                  <>
                    <img
                      src={getCoverUrl(event.folder, event.images[0])}
                      alt={`${event.title} cover`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium opacity-70">No photos yet</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-4 text-white z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                  <Image className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{event.title}</p>
                  <p className="text-sm text-white/90">{event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for selected event */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative">
                {/* Close Button - always visible, larger and more prominent */}
                <button
                  className="absolute top-20 right-4 text-gray-700 bg-gray-200 rounded-full p-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close event modal"
                  type="button"
                >
                  <X className="w-7 h-7" />
                </button>
                {/* Move event name downward */}
                <h2 className="text-2xl font-bold mt-8 mb-6 text-center">{selectedEvent.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {matchedFiles.length > 0 ? matchedFiles.map((file, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-xl overflow-hidden shadow cursor-pointer hover:shadow-lg transition-all" onClick={() => setPreviewImage(getFullSizeUrl(selectedEvent.folder, file))}>
                      <img src={getCoverUrl(selectedEvent.folder, file)} alt={file} className="w-full h-40 object-cover" />
                    </div>
                  )) : <div className="text-gray-400 col-span-full text-center">No images found</div>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/70"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full relative flex flex-col items-center">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
                <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[70vh] rounded-xl mb-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
