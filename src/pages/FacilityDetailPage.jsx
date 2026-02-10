import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles, MapPin, School, Beaker, Dumbbell, Bus, Library, Music } from 'lucide-react';

const facilityData = {
  'smart-classrooms': {
    title: 'Smart Classrooms',
    blurb: 'Interactive boards, audio-visual systems, and campus Wi-Fi turn every lesson into an engaging experience.',
    icon: School,
    highlights: [
      'Interactive digital boards and screen casting',
      'High-speed Wi-Fi with LMS access',
      'Adaptive content and formative assessments',
      'Collaborative zones for group work'
    ],
  },
  'science-labs': {
    title: 'Science Labs',
    blurb: 'Dedicated Physics, Chemistry, and Biology labs built for safe, hands-on experiments.',
    icon: Beaker,
    highlights: [
      'Separate Physics, Chemistry, and Biology labs',
      'Modern apparatus with safety-first layouts',
      'Experiment logs, lab manuals, and data capture',
      'Regular drills and supervised sessions'
    ],
  },
  'sports-ground': {
    title: 'Sports Ground',
    blurb: 'Outdoor and indoor sports infrastructure to build fitness, teamwork, and grit.',
    icon: Dumbbell,
    highlights: [
      'Cricket, football, and athletics track',
      'Indoor badminton and table tennis zones',
      'Certified coaches and weekly PE blocks',
      'Yoga, fitness, and conditioning slots'
    ],
  },
  transportation: {
    title: 'Transportation',
    blurb: 'GPS-enabled buses, trained staff, and optimized routes for safe, on-time travel.',
    icon: Bus,
    highlights: [
      'GPS tracking with notified pickups/drop-offs',
      'Verified drivers and trained attendants',
      'First-aid kits and safety checks',
      'Route planning for punctuality'
    ],
  },
  library: {
    title: 'Library',
    blurb: 'A calm, well-lit space with print and digital collections that nurture daily reading.',
    icon: Library,
    highlights: [
      '5,000+ titles across genres and levels',
      'Digital subscriptions and periodicals',
      'Reading clubs and author interactions',
      'Research corners with guided access'
    ],
  },
  'music-and-arts': {
    title: 'Music & Arts',
    blurb: 'Studios for music, dance, theater, and visual arts to grow creative confidence.',
    icon: Music,
    highlights: [
      'Keyboard, guitar, percussion, and vocal training',
      'Art studio for painting, sketching, and crafts',
      'Dance and theater practice rooms',
      'Showcase events and inter-school fests'
    ],
  },
  sports: {
    title: 'Sports',
    blurb: 'Team and individual sports programs that build fitness, discipline, and teamwork.',
    icon: Dumbbell,
    highlights: [
      'Football, Basketball, and Volleyball coaching',
      'Kho-Kho for agility and coordination',
      'Table Tennis for reflexes and focus',
      'Chess and Carrom for strategy and concentration'
    ],
  },
  'traditional-arts': {
    title: 'Traditional Arts',
    blurb: 'Mind-body practices and classical arts that nurture balance, focus, and cultural roots.',
    icon: Music,
    highlights: [
      'Yoga and Meditation for mindfulness',
      'Karate and Silambam for discipline and self-defense',
      'Classical Dance to celebrate culture and expression',
      'Regular showcases and practice slots'
    ],
  },
};

export const FacilityDetailPage = () => {
  const { facilityId } = useParams();
  const facility = facilityData[facilityId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [facilityId]);

  if (!facility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Facility not found</p>
          <p className="text-gray-600 mb-6">The facility you are looking for is unavailable.</p>
          <Link to="/facilities#facilities" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  const Icon = facility.icon || Sparkles;

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2 text-gray-800">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-700">
              <Icon className="w-7 h-7" />
            </span>
            <div>
              <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-blue-600 mb-1">
                <MapPin className="w-4 h-4" /> Minervaa Vidhya Mandhir
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{facility.title}</h1>
            </div>
          </div>
          <p className="text-gray-700 text-lg md:text-xl max-w-4xl">{facility.blurb}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 md:mt-10 pb-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Facility details</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What you can expect</h2>
            </div>
            <Link
              to="/facilities#facilities"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Facilities
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Highlights</h3>
              </div>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {facility.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Access & Use</h3>
              </div>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Guided access during scheduled periods.</li>
                <li>Extra slots for clubs, practice, and competitions.</li>
                <li>Safety and care guidelines shared with students.</li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-8">
            <Link
              to="/contact#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg"
            >
              <Sparkles className="w-5 h-5" /> Schedule a visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
