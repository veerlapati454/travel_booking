/**
 * ============================================================================
 * WANDERLUX TRAVEL BOOKING - ALL-IN-ONE UNIFIED SCRIPT (server.js)
 * 
 * Contains:
 * 1. Node.js Static HTTP Server (when executed via Node CLI: `node server.js`)
 * 2. Complete Frontend Architecture (when loaded in browser via <script src="server.js">):
 *    - Structured Sample Datasets (8 Destinations, 12 Hotels, 4 Offers, 6 Reviews)
 *    - Theme & Currency Management
 *    - Wishlist System with LocalStorage Persistence
 *    - Destination Autocomplete & Date Validation
 *    - Guests & Rooms Popover Counter
 *    - Hotel Filtering, Sorting & Live Price Sliders
 *    - Dynamic Booking Cost Estimator & Live Receipt
 *    - Testimonials Responsive Carousel Slider with Autoplay & Swipe
 *    - Promotions with One-Click Clipboard Copying
 *    - Newsletter Validation & LocalStorage Persistence
 *    - Toast Notification Engine & Scroll Progress Ring
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * PART A: NODE.JS LOCAL DEVELOPMENT HTTP SERVER
 * ---------------------------------------------------------------------------- */
if (typeof window === 'undefined') {
  const http = require('http');
  const fs = require('fs');
  const path = require('path');

  const PORT = process.env.PORT || 3000;
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';

    const filePath = path.join(__dirname, reqPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`500 Server Error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`✈️  WanderLux Travel Server running at:`);
    console.log(`👉  http://localhost:${PORT}`);
    console.log(`==================================================\n`);
  });

} else {

/* ----------------------------------------------------------------------------
 * PART B: BROWSER CLIENT-SIDE APPLICATION ARCHITECTURE
 * ---------------------------------------------------------------------------- */

// Global State Variables
window.currentCurrency = 'USD';

/* ============================================================================
   1. SAMPLE DATA REPOSITORY
   ============================================================================ */
const TRAVEL_DATA = {
  // 1. Minimum 6 Destinations (8 Curated Iconic Destinations)
  destinations: [
    {
      id: "dest-bali",
      name: "Bali",
      country: "Indonesia",
      tagline: "Island of the Gods & Emerald Rice Terraces",
      region: "Asia Pacific",
      category: "beach",
      rating: 4.94,
      reviewsCount: 1420,
      staysCount: 48,
      startingPrice: 120,
      badge: "Trending Hot",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      description: "Immerse yourself in lush volcanic landscapes, spiritual temple retreats, and world-class surfing beaches."
    },
    {
      id: "dest-paris",
      name: "Paris",
      country: "France",
      tagline: "The City of Light, Haute Couture & Romance",
      region: "Europe",
      category: "cultural",
      rating: 4.88,
      reviewsCount: 2340,
      staysCount: 65,
      startingPrice: 220,
      badge: "Iconic Classic",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      description: "Stroll along the Seine, savor Michelin gastronomy, and marvel at timeless architectural wonders."
    },
    {
      id: "dest-kyoto",
      name: "Kyoto",
      country: "Japan",
      tagline: "Ancient Shrines, Zen Gardens & Bamboo Groves",
      region: "Asia Pacific",
      category: "cultural",
      rating: 4.96,
      reviewsCount: 1890,
      staysCount: 39,
      startingPrice: 180,
      badge: "Top Rated",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      description: "Discover centuries-old traditional ryokans, serene tea ceremonies, and breathtaking autumn foliage."
    },
    {
      id: "dest-santorini",
      name: "Santorini",
      country: "Greece",
      tagline: "Whitewashed Calderas & Aegean Sunsets",
      region: "Europe",
      category: "beach",
      rating: 4.92,
      reviewsCount: 2150,
      staysCount: 52,
      startingPrice: 280,
      badge: "Romantic Pick",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      description: "Perched cliffside villages overlooking cobalt seas, infinity pools, and legendary golden hour sunsets."
    },
    {
      id: "dest-swiss",
      name: "Swiss Alps",
      country: "Switzerland",
      tagline: "Majestic Glaciers, Chalets & Pristine Lakes",
      region: "Europe",
      category: "mountain",
      rating: 4.91,
      reviewsCount: 1670,
      staysCount: 34,
      startingPrice: 260,
      badge: "Winter & Summer",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
      description: "Ski legendary powdered slopes in Zermatt or hike flower-carpeted alpine meadows under the Matterhorn."
    },
    {
      id: "dest-maldives",
      name: "Maldives",
      country: "Maldives",
      tagline: "Ultra-Luxury Overwater Villas & Coral Reefs",
      region: "Asia Pacific",
      category: "luxury",
      rating: 4.98,
      reviewsCount: 3120,
      staysCount: 42,
      startingPrice: 450,
      badge: "Pure Paradise",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
      description: "Crystal-clear turquoise lagoons, private catamaran cruises, and Michelin dining beneath the sea."
    },
    {
      id: "dest-amalfi",
      name: "Amalfi Coast",
      country: "Italy",
      tagline: "Dramatic Cliffs, Limoncello & Mediterranean Glamour",
      region: "Europe",
      category: "beach",
      rating: 4.89,
      reviewsCount: 1480,
      staysCount: 38,
      startingPrice: 290,
      badge: "Scenic Gem",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      description: "Colorful pastel villas clinging to vertical cliffs above the sparkling sapphire Tyrrhenian Sea."
    },
    {
      id: "dest-nyc",
      name: "New York City",
      country: "United States",
      tagline: "The Empire City, Broadway & Endless Horizon",
      region: "Americas",
      category: "metropolis",
      rating: 4.82,
      reviewsCount: 4210,
      staysCount: 84,
      startingPrice: 210,
      badge: "Urban Vibe",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
      description: "World-class theater, rooftop skybars, iconic Central Park strolls, and 24/7 culinary thrills."
    }
  ],

  // 2. Minimum 10 Hotel Listings (12 Curated Premier Properties)
  hotels: [
    {
      id: "hotel-1",
      name: "The Royal Azure Ocean Villa & Spa",
      destinationId: "dest-bali",
      destinationName: "Bali",
      country: "Indonesia",
      category: "luxury",
      badge: "Guest Favorite",
      rating: 4.97,
      reviewsCount: 348,
      pricePerNight: 280,
      originalPrice: 350,
      discountPercent: 20,
      featured: true,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Infinity Pool", "Private Beach", "Ayurvedic Spa", "Free Breakfast", "Butler Service", "Free High-Speed WiFi"],
      description: "Perched along the Uluwatu cliffs, this 5-star haven offers private plunge pools, sunrise yoga pavilions, and uninterrupted Indian Ocean views.",
      roomTiers: [
        { name: "Ocean Deluxe Suite", multiplier: 1.0, beds: "1 King Bed", sqft: 650 },
        { name: "Cliffside Pool Villa", multiplier: 1.35, beds: "1 King + Daybed", sqft: 950 },
        { name: "Royal Presidential Penthouse", multiplier: 1.85, beds: "2 King Beds", sqft: 1450 }
      ]
    },
    {
      id: "hotel-2",
      name: "Le Grand Marais Boutique Suites",
      destinationId: "dest-paris",
      destinationName: "Paris",
      country: "France",
      category: "boutique",
      badge: "Staff Pick",
      rating: 4.92,
      reviewsCount: 215,
      pricePerNight: 340,
      originalPrice: 420,
      discountPercent: 19,
      featured: true,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Haussmann Balcony", "Artisan Bakery", "Wine Cellar", "Concierge", "Designer Toiletries", "Free WiFi"],
      description: "18th-century Parisian elegance meets contemporary bespoke styling in the historical heart of Le Marais, steps from art galleries and cafes.",
      roomTiers: [
        { name: "Classic Marais Room", multiplier: 1.0, beds: "1 Queen Bed", sqft: 380 },
        { name: "Seine View Balcony Suite", multiplier: 1.4, beds: "1 King Bed", sqft: 520 },
        { name: "Imperial Duplex Suite", multiplier: 1.9, beds: "1 King + Lounge", sqft: 850 }
      ]
    },
    {
      id: "hotel-3",
      name: "Kyo-No-Oto Zen Ryokan & Onsen",
      destinationId: "dest-kyoto",
      destinationName: "Kyoto",
      country: "Japan",
      category: "heritage",
      badge: "Cultural Gem",
      rating: 4.98,
      reviewsCount: 380,
      pricePerNight: 260,
      originalPrice: 310,
      discountPercent: 16,
      featured: true,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Natural Hot Springs Onsen", "Kaiseki Multi-Course Dining", "Tatami Living", "Japanese Zen Garden", "Yukata Provided"],
      description: "Authentic cedar-wood ryokan tucked in the bamboo forests of Arashiyama with mineral hot-spring baths and seasonal multi-course kaiseki meals.",
      roomTiers: [
        { name: "Standard Tatami Room", multiplier: 1.0, beds: "Traditional Futons", sqft: 450 },
        { name: "Private Open-Air Bath Suite", multiplier: 1.45, beds: "Futons + Hinoki Tub", sqft: 680 },
        { name: "Zen Bamboo Master Pavilion", multiplier: 1.95, beds: "Twin King Futons", sqft: 1100 }
      ]
    },
    {
      id: "hotel-4",
      name: "Calypso Cliffside Cave Sanctuary",
      destinationId: "dest-santorini",
      destinationName: "Santorini",
      country: "Greece",
      category: "luxury",
      badge: "Bestseller",
      rating: 4.95,
      reviewsCount: 420,
      pricePerNight: 420,
      originalPrice: 530,
      discountPercent: 21,
      featured: true,
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
      ],
      amenities: ["Infinity Plunge Pool", "Caldera Sunset View", "Champagne Breakfast", "Cave Architecture", "Airport Transfer", "Spa Hydrotherapy"],
      description: "Sculpted directly into the volcanic cliffs of Oia, boasting uninterrupted caldera views, heated infinity plunge pools, and sunset terraces.",
      roomTiers: [
        { name: "Caldera Cave Suite", multiplier: 1.0, beds: "1 King Bed", sqft: 500 },
        { name: "Honeymoon Plunge Pool Villa", multiplier: 1.4, beds: "1 King Bed + Private Pool", sqft: 750 },
        { name: "Grand Sunset Sanctuary", multiplier: 1.8, beds: "2 King Beds", sqft: 1200 }
      ]
    },
    {
      id: "hotel-5",
      name: "The Matterhorn Alpine Grand Chalet",
      destinationId: "dest-swiss",
      destinationName: "Swiss Alps",
      country: "Switzerland",
      category: "mountain",
      badge: "Winter Magic",
      rating: 4.91,
      reviewsCount: 195,
      pricePerNight: 390,
      originalPrice: 470,
      discountPercent: 17,
      featured: true,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      amenities: ["Ski-In/Ski-Out", "Heated Indoor Pool", "Panoramic Sauna", "Stone Fireplace", "Fondue Restaurant", "Ski Storage Locker"],
      description: "Luxurious timber and stone alpine retreat in Zermatt offering direct slope access, wood-burning fireplaces, and a heated glass-roof pool.",
      roomTiers: [
        { name: "Alpine Valley Chalet Room", multiplier: 1.0, beds: "1 King Bed", sqft: 550 },
        { name: "Matterhorn Panorama Suite", multiplier: 1.35, beds: "1 King Bed + Fireplace", sqft: 800 },
        { name: "Summit Penthouse Chalet", multiplier: 1.75, beds: "3 Bedrooms + Kitchen", sqft: 1600 }
      ]
    },
    {
      id: "hotel-6",
      name: "Soneva Azure Overwater Atoll Haven",
      destinationId: "dest-maldives",
      destinationName: "Maldives",
      country: "Maldives",
      category: "luxury",
      badge: "Ultra Luxury",
      rating: 4.99,
      reviewsCount: 512,
      pricePerNight: 680,
      originalPrice: 850,
      discountPercent: 20,
      featured: true,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
      amenities: ["Glass Bottom Floor", "Private Lagoon Slide", "24/7 Island Butler", "Underwater Dining", "Catamaran Cruise", "All-Inclusive Drinks"],
      description: "Iconic eco-luxury overwater villas featuring retractable roofs for stargazing, curved water slides plunging into turquoise reefs, and dedicated butler service.",
      roomTiers: [
        { name: "Overwater Lagoon Villa", multiplier: 1.0, beds: "1 King Bed", sqft: 850 },
        { name: "Water Slide Sunset Reserve", multiplier: 1.5, beds: "1 King + Slide", sqft: 1250 },
        { name: "Atoll Sovereign 3-Bedroom Villa", multiplier: 2.2, beds: "3 Master King Suites", sqft: 2400 }
      ]
    },
    {
      id: "hotel-7",
      name: "Positano Panoramica Cliff Resort",
      destinationId: "dest-amalfi",
      destinationName: "Amalfi Coast",
      country: "Italy",
      category: "beach",
      badge: "Top Scenic",
      rating: 4.93,
      reviewsCount: 260,
      pricePerNight: 360,
      originalPrice: 440,
      discountPercent: 18,
      featured: false,
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      amenities: ["Terrace Solarium", "Limoncello Tastings", "Private Beach Funicular", "Michelin Dining", "Sea Kayaking"],
      description: "Perched on Positano’s iconic sheer cliff, this Mediterranean jewel features hand-painted majolica tiles and private lemon-scented balconies.",
      roomTiers: [
        { name: "Classic Cliff View", multiplier: 1.0, beds: "1 Queen Bed", sqft: 420 },
        { name: "Deluxe Mediterranean Sea Suite", multiplier: 1.35, beds: "1 King Bed", sqft: 650 },
        { name: "Positano Royal Panorama", multiplier: 1.8, beds: "2 King Suites", sqft: 1100 }
      ]
    },
    {
      id: "hotel-8",
      name: "The Manhattan Skyline Horizon Penthouse",
      destinationId: "dest-nyc",
      destinationName: "New York City",
      country: "United States",
      category: "metropolis",
      badge: "City Center",
      rating: 4.85,
      reviewsCount: 395,
      pricePerNight: 310,
      originalPrice: 380,
      discountPercent: 18,
      featured: false,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      amenities: ["Rooftop Sky Lounge", "Central Park Views", "State-of-the-Art Gym", "Valet Parking", "Cocktail Bar", "Free High-Speed WiFi"],
      description: "Soaring 50 stories above Midtown Manhattan, this ultra-chic design hotel places you minutes from Broadway, Central Park, and Fifth Avenue luxury shopping.",
      roomTiers: [
        { name: "Skyline Superior Studio", multiplier: 1.0, beds: "1 King Bed", sqft: 400 },
        { name: "Central Park Vista Suite", multiplier: 1.4, beds: "1 King Bed + Lounge", sqft: 680 },
        { name: "Broadway Penthouse Duplex", multiplier: 1.9, beds: "2 King Suites", sqft: 1300 }
      ]
    },
    {
      id: "hotel-9",
      name: "Ubud Canopy Treehouse Eco-Lodge",
      destinationId: "dest-bali",
      destinationName: "Bali",
      country: "Indonesia",
      category: "eco",
      badge: "Eco Luxury",
      rating: 4.90,
      reviewsCount: 220,
      pricePerNight: 175,
      originalPrice: 220,
      discountPercent: 20,
      featured: false,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      amenities: ["Jungle Infinity Pool", "Organic Farm-to-Table", "Open-Air Yoga Shala", "River Tubing", "Holistic Wellness"],
      description: "Nestled high among Ubud’s rainforest canopy, these bamboo eco-lodges connect you deeply with nature with zero compromise on luxury.",
      roomTiers: [
        { name: "Bamboo Canopy Suite", multiplier: 1.0, beds: "1 Queen Bed", sqft: 480 },
        { name: "Jungle Riverfront Villa", multiplier: 1.3, beds: "1 King Bed", sqft: 720 },
        { name: "Treehouse Sanctuary", multiplier: 1.7, beds: "2 King Beds", sqft: 1050 }
      ]
    },
    {
      id: "hotel-10",
      name: "Eiffel Vista Royal Palace Hotel",
      destinationId: "dest-paris",
      destinationName: "Paris",
      country: "France",
      category: "luxury",
      badge: "Flash Deal",
      rating: 4.97,
      reviewsCount: 480,
      pricePerNight: 480,
      originalPrice: 620,
      discountPercent: 22,
      featured: true,
      image: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80",
      amenities: ["Direct Eiffel Views", "Marble Spa & Hammam", "Private Chauffeur", "2-Star Michelin Dining", "Champagne Butler"],
      description: "Gaze at the sparkling Eiffel Tower directly from your plush king-size bed in this landmark palace hotel with French crystal chandeliers.",
      roomTiers: [
        { name: "Palace Prestige Room", multiplier: 1.0, beds: "1 King Bed", sqft: 520 },
        { name: "Eiffel Front Suite", multiplier: 1.45, beds: "1 King Bed", sqft: 820 },
        { name: "Presidential Royal Salon", multiplier: 2.1, beds: "2 Master Suites", sqft: 1800 }
      ]
    },
    {
      id: "hotel-11",
      name: "Gion Heritage Teahouse Retreat",
      destinationId: "dest-kyoto",
      destinationName: "Kyoto",
      country: "Japan",
      category: "heritage",
      badge: "Hidden Gem",
      rating: 4.87,
      reviewsCount: 165,
      pricePerNight: 210,
      originalPrice: 260,
      discountPercent: 19,
      featured: false,
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
      amenities: ["Matcha Masterclass", "Cypress Bathtub", "Garden Courtyard", "Kimono Styling", "Free WiFi"],
      description: "Restored historic machiya townhouse located in traditional Gion, offering serene tea gardens, sliding shoji screens, and morning meditation.",
      roomTiers: [
        { name: "Garden View Machiya Room", multiplier: 1.0, beds: "Tatami Futons", sqft: 390 },
        { name: "Heritage Tea Pavilion Suite", multiplier: 1.35, beds: "Deluxe Futons", sqft: 580 },
        { name: "Full Machiya Residence", multiplier: 1.8, beds: "Sleeps up to 6", sqft: 1200 }
      ]
    },
    {
      id: "hotel-12",
      name: "Oia Sunset Horizon Caves & Pools",
      destinationId: "dest-santorini",
      destinationName: "Santorini",
      country: "Greece",
      category: "luxury",
      badge: "Trending Hot",
      rating: 4.94,
      reviewsCount: 295,
      pricePerNight: 350,
      originalPrice: 430,
      discountPercent: 18,
      featured: false,
      image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
      amenities: ["Caldera Jacuzzi", "Sunset Solarium", "Sommelier Wine Bar", "Helipad Access", "Complimentary Breakfast"],
      description: "Minimalist white architecture perched in Oia's most photogenic alleyways, equipped with heated private jacuzzis and sunset cocktails.",
      roomTiers: [
        { name: "Aegean Cave Room", multiplier: 1.0, beds: "1 King Bed", sqft: 450 },
        { name: "Sunset Jacuzzi Haven", multiplier: 1.35, beds: "1 King Bed + Jacuzzi", sqft: 650 },
        { name: "Grand Caldera Infinity Suite", multiplier: 1.75, beds: "2 King Bedrooms", sqft: 1100 }
      ]
    }
  ],

  // 3. Minimum 3 Promotional Offers (4 Deals with Copyable Coupons)
  promotions: [
    {
      id: "promo-1",
      code: "WANDER25",
      discount: 25,
      type: "percentage",
      title: "Flash Wanderlust Sale",
      tag: "Limited Time",
      description: "Enjoy 25% off all luxury & boutique hotels worldwide for stays of 3+ nights.",
      validUntil: "Nov 30, 2026",
      bgGradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
      accentColor: "#3b82f6",
      badgeText: "25% OFF",
      minNights: 3
    },
    {
      id: "promo-2",
      code: "SUMMER50",
      discount: 50,
      type: "fixed",
      title: "Tropical Escape Credit",
      tag: "Island Special",
      description: "Get an instant $50 discount on any Bali, Santorini or Maldives beach resort.",
      validUntil: "Dec 15, 2026",
      bgGradient: "linear-gradient(135deg, #0f766e, #14b8a6)",
      accentColor: "#14b8a6",
      badgeText: "$50 OFF",
      minNights: 2
    },
    {
      id: "promo-3",
      code: "HONEYMOON30",
      discount: 30,
      type: "percentage",
      title: "Romantic Suites Deal",
      tag: "Couples Exclusive",
      description: "Save 30% on premier honeymoon suites in Paris & Santorini with free champagne.",
      validUntil: "Jan 10, 2027",
      bgGradient: "linear-gradient(135deg, #be185d, #ec4899)",
      accentColor: "#ec4899",
      badgeText: "30% OFF",
      minNights: 4
    },
    {
      id: "promo-4",
      code: "ALPINE15",
      discount: 15,
      type: "percentage",
      title: "Swiss Alpine Getaway",
      tag: "Mountain Vibes",
      description: "Save 15% on winter ski chalets in Switzerland with complimentary equipment locker.",
      validUntil: "Feb 28, 2027",
      bgGradient: "linear-gradient(135deg, #4338ca, #6366f1)",
      accentColor: "#6366f1",
      badgeText: "15% OFF",
      minNights: 2
    }
  ],

  // 4. Minimum 6 Customer Testimonials
  testimonials: [
    {
      id: "test-1",
      name: "Sophia Laurent",
      location: "Paris, France",
      hotelStayed: "Calypso Cliffside Cave Sanctuary",
      destination: "Santorini, Greece",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "October 2026",
      quote: "Booking our 5th anniversary through WanderLux was an extraordinary experience. The live date validation and instant coupon code (WANDER25) saved us $350 on our Santorini cave suite. The caldera sunset from our infinity pool was pure magic!",
      verified: true
    },
    {
      id: "test-2",
      name: "Marcus Vance",
      location: "San Francisco, CA",
      hotelStayed: "The Royal Azure Ocean Villa",
      destination: "Bali, Indonesia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "September 2026",
      quote: "The interactive price estimator with real-time tax breakdowns gave us total transparency—zero surprise charges at check-in. The Uluwatu cliffside villa was even more breathtaking than the high-res photos. Unmatched quality!",
      verified: true
    },
    {
      id: "test-3",
      name: "Elena Rostova",
      location: "Zurich, Switzerland",
      hotelStayed: "Kyo-No-Oto Zen Ryokan & Onsen",
      destination: "Kyoto, Japan",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "November 2026",
      quote: "As someone who travels 8 months a year, the wishlist persistence and snappy filtering by amenities like 'Private Onsen' is a game changer. The Kaiseki dinner in Kyoto was Michelin-level bliss.",
      verified: true
    },
    {
      id: "test-4",
      name: "Liam & Chloe Chen",
      location: "Melbourne, Australia",
      hotelStayed: "Soneva Azure Overwater Atoll Haven",
      destination: "Maldives",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "August 2026",
      quote: "Sliding straight from our overwater bedroom into the turquoise lagoon was a bucket list dream fulfilled! WanderLux's guest counter and room tier selector made customizing our stay effortless. Exceptional service from start to finish.",
      verified: true
    },
    {
      id: "test-5",
      name: "David K. Miller",
      location: "London, United Kingdom",
      hotelStayed: "The Matterhorn Alpine Grand Chalet",
      destination: "Swiss Alps, Switzerland",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "January 2026",
      quote: "Ski-in, ski-out right from our door in Zermatt. The currency switcher seamlessly converted rates to GBP, and the copy coupon button made claiming our 15% discount totally frictionless. By far the slickest travel portal I've used.",
      verified: true
    },
    {
      id: "test-6",
      name: "Amara Diallo",
      location: "Toronto, Canada",
      hotelStayed: "Le Grand Marais Boutique Suites",
      destination: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "July 2026",
      quote: "The Haussmann balcony overlooking Paris was straight out of a film. The newsletter deal alerted me to a 20% flash promotion. WanderLux delivers true five-star curation with a lightning-fast responsive interface on mobile!",
      verified: true
    }
  ],

  // 5. Why Choose Us Features
  features: [
    {
      icon: "fa-solid fa-shield-heart",
      title: "Best Price Guarantee",
      description: "Find a lower qualifying price within 24 hours of booking and we’ll match it plus grant a 10% future credit.",
      highlight: "100% Guaranteed"
    },
    {
      icon: "fa-solid fa-gem",
      title: "Handpicked Luxury Stays",
      description: "Every hotel, villa, and ryokan undergoes a strict 40-point quality audit by our travel curators.",
      highlight: "Curated Excellence"
    },
    {
      icon: "fa-solid fa-headset",
      title: "24/7 VIP Concierge",
      description: "From private yacht transfers to hard-to-get Michelin dinner tables, our multilingual team assists 24/7.",
      highlight: "Around the Clock"
    },
    {
      icon: "fa-solid fa-rotate-left",
      title: "Flexible Free Cancellation",
      description: "Life changes unexpectedly. Enjoy free cancellation on over 90% of our properties up to 48h before arrival.",
      highlight: "Zero Stress"
    },
    {
      icon: "fa-solid fa-lock",
      title: "Secure Instant Checkout",
      description: "Military-grade 256-bit SSL encryption safeguards your personal details and payment transactions.",
      highlight: "Bank-Grade Safe"
    },
    {
      icon: "fa-solid fa-leaf",
      title: "Eco & Carbon Offset Stays",
      description: "We automatically plant 5 trees for every booking and prioritize verified eco-certified resorts.",
      highlight: "Sustainable Travel"
    }
  ],

  // 6. Currency Exchange Rates
  currencies: {
    USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
    EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
    GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
    INR: { symbol: "₹", rate: 84.0, label: "INR (₹)" },
    AUD: { symbol: "A$", rate: 1.52, label: "AUD (A$)" },
    JPY: { symbol: "¥", rate: 154.0, label: "JPY (¥)" }
  },

  // 7. Booking Add-ons
  bookingAddons: [
    { id: "addon-transfer", name: "VIP Airport Private Transfer", price: 45, perPerson: false, icon: "fa-car" },
    { id: "addon-breakfast", name: "Gourmet Champagne Breakfast Buffet", price: 25, perPerson: true, icon: "fa-utensils" },
    { id: "addon-spa", name: "Full-Body Aromatherapy Spa Pass", price: 75, perPerson: true, icon: "fa-spa" },
    { id: "addon-insurance", name: "Comprehensive Travel & Cancellation Insurance", price: 30, perPerson: false, icon: "fa-shield-halved" }
  ],

  // 8. Frequently Asked Questions
  faqs: [
    {
      question: "How does the Dynamic Booking Price Estimator work?",
      answer: "Our estimator calculates real-time room rates based on your selected check-in/out dates, guest numbers, room tiers, and active promotional coupons. You get a transparent breakdown of base rates, taxes (12%), and any optional add-ons before confirming."
    },
    {
      question: "How do I redeem promotional coupon codes?",
      answer: "Simply click the 'Copy Code' button on any promotion card in the Special Offers section. The code is instantly saved to your clipboard. You can paste it into the search estimator or quick-book modal to immediately see your discount applied."
    },
    {
      question: "Does the Wishlist save my favorite stays across sessions?",
      answer: "Yes! WanderLux utilizes browser LocalStorage to persistently maintain your saved hotels. You can close your browser or reload anytime, and your curated collection will remain intact in the Wishlist drawer."
    },
    {
      question: "What is WanderLux's cancellation policy?",
      answer: "Most properties offer 100% free cancellation up to 48 hours prior to check-in. The specific cancellation window is explicitly highlighted on every hotel card and booking confirmation."
    }
  ]
};

Object.freeze(TRAVEL_DATA);

/* ============================================================================
   2. WISHLIST MANAGER (LocalStorage Persistent)
   ============================================================================ */
class WishlistManager {
  constructor() {
    this.storageKey = 'wanderlux_wishlist';
    this.wishlist = this.loadWishlist();
    this.drawerEl = document.getElementById('wishlist-drawer');
    this.overlayEl = document.getElementById('wishlist-overlay');
    this.badgeEl = document.getElementById('wishlist-count-badge');
    this.itemsContainerEl = document.getElementById('wishlist-items-container');
    this.emptyStateEl = document.getElementById('wishlist-empty-state');
    this.clearBtnEl = document.getElementById('wishlist-clear-btn');
    
    this.init();
  }

  init() {
    this.updateBadge();
    this.renderDrawerItems();
    this.bindEvents();
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse wishlist:', e);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
      this.updateBadge();
      this.renderDrawerItems();
      this.syncHeartButtons();
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }

  toggle(hotelId) {
    const index = this.wishlist.indexOf(hotelId);
    const hotel = TRAVEL_DATA.hotels.find(h => h.id === hotelId);
    let isAdded = false;

    if (index > -1) {
      this.wishlist.splice(index, 1);
      window.showToast(`Removed "${hotel ? hotel.name : 'Hotel'}" from Wishlist`, 'info');
    } else {
      this.wishlist.push(hotelId);
      isAdded = true;
      window.showToast(`Saved "${hotel ? hotel.name : 'Hotel'}" to Wishlist! ❤️`, 'success');
    }

    this.saveWishlist();
    return isAdded;
  }

  has(hotelId) {
    return this.wishlist.includes(hotelId);
  }

  remove(hotelId) {
    this.wishlist = this.wishlist.filter(id => id !== hotelId);
    const hotel = TRAVEL_DATA.hotels.find(h => h.id === hotelId);
    window.showToast(`Removed "${hotel ? hotel.name : 'Hotel'}" from Wishlist`, 'info');
    this.saveWishlist();
  }

  clear() {
    if (this.wishlist.length === 0) return;
    this.wishlist = [];
    this.saveWishlist();
    window.showToast('Wishlist has been cleared.', 'info');
  }

  updateBadge() {
    const count = this.wishlist.length;
    if (this.badgeEl) {
      this.badgeEl.textContent = count;
      this.badgeEl.style.display = count > 0 ? 'inline-flex' : 'none';
      if (count > 0) {
        this.badgeEl.classList.remove('pulse');
        void this.badgeEl.offsetWidth;
        this.badgeEl.classList.add('pulse');
      }
    }
  }

  openDrawer() {
    this.renderDrawerItems();
    if (this.drawerEl) this.drawerEl.classList.add('open');
    if (this.overlayEl) this.overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    if (this.drawerEl) this.drawerEl.classList.remove('open');
    if (this.overlayEl) this.overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderDrawerItems() {
    if (!this.itemsContainerEl) return;

    if (this.wishlist.length === 0) {
      if (this.emptyStateEl) this.emptyStateEl.style.display = 'flex';
      this.itemsContainerEl.innerHTML = '';
      if (this.clearBtnEl) this.clearBtnEl.style.display = 'none';
      return;
    }

    if (this.emptyStateEl) this.emptyStateEl.style.display = 'none';
    if (this.clearBtnEl) this.clearBtnEl.style.display = 'inline-flex';

    const savedHotels = this.wishlist
      .map(id => TRAVEL_DATA.hotels.find(h => h.id === id))
      .filter(Boolean);

    this.itemsContainerEl.innerHTML = savedHotels.map(hotel => {
      const formattedPrice = window.formatCurrency 
        ? window.formatCurrency(hotel.pricePerNight) 
        : `$${hotel.pricePerNight}`;

      return `
        <div class="wishlist-item" data-id="${hotel.id}">
          <div class="wishlist-item-thumb">
            <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          </div>
          <div class="wishlist-item-info">
            <div class="wishlist-item-header">
              <span class="wishlist-item-location"><i class="fa-solid fa-location-dot"></i> ${hotel.destinationName}, ${hotel.country}</span>
              <button class="wishlist-item-remove-btn" onclick="wishlistManager.remove('${hotel.id}')" title="Remove from wishlist">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <h4 class="wishlist-item-title">${hotel.name}</h4>
            <div class="wishlist-item-rating">
              <i class="fa-solid fa-star"></i>
              <span>${hotel.rating}</span>
              <span class="reviews-count">(${hotel.reviewsCount} reviews)</span>
            </div>
            <div class="wishlist-item-footer">
              <div class="wishlist-item-price">
                <span class="price-val">${formattedPrice}</span>
                <span class="price-period">/ night</span>
              </div>
              <button class="btn btn-sm btn-primary" onclick="wishlistManager.bookFromWishlist('${hotel.id}')">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  syncHeartButtons() {
    const buttons = document.querySelectorAll('.hotel-wishlist-btn');
    buttons.forEach(btn => {
      const hotelId = btn.getAttribute('data-hotel-id');
      if (this.has(hotelId)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to wishlist');
      }
    });
  }

  bookFromWishlist(hotelId) {
    this.closeDrawer();
    if (window.openBookingModal) {
      window.openBookingModal(hotelId);
    }
  }

  bindEvents() {
    const triggerBtn = document.getElementById('header-wishlist-btn');
    const closeBtn = document.getElementById('wishlist-close-btn');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.closeDrawer());
    }

    if (this.clearBtnEl) {
      this.clearBtnEl.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
          this.clear();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.drawerEl && this.drawerEl.classList.contains('open')) {
        this.closeDrawer();
      }
    });
  }
}

/* ============================================================================
   3. SEARCH, AUTOCOMPLETE, DATE VALIDATION & HOTEL FILTERING
   ============================================================================ */
class SearchAndFilterManager {
  constructor() {
    this.hotels = [...TRAVEL_DATA.hotels];
    this.filteredHotels = [...this.hotels];
    this.destinations = [...TRAVEL_DATA.destinations];

    this.searchState = {
      keyword: '',
      destinationId: 'all',
      checkInDate: null,
      checkOutDate: null,
      nights: 3,
      guests: { adults: 2, children: 0, rooms: 1 },
      category: 'all',
      maxPrice: 800,
      minRating: 0,
      amenities: [],
      sortBy: 'recommended'
    };

    this.init();
  }

  init() {
    this.initDatePickers();
    this.initGuestPopover();
    this.initDestinationAutocomplete();
    this.renderDestinations();
    this.initFilterControls();
    this.renderHotels();
  }

  initDatePickers() {
    const checkInInput = document.getElementById('search-checkin');
    const checkOutInput = document.getElementById('search-checkout');
    const nightsBadge = document.getElementById('search-nights-badge');

    if (!checkInInput || !checkOutInput) return;

    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const today = new Date();
    const defaultCheckIn = new Date();
    defaultCheckIn.setDate(today.getDate() + 7);

    const defaultCheckOut = new Date();
    defaultCheckOut.setDate(defaultCheckIn.getDate() + 3);

    checkInInput.min = formatDate(today);
    checkInInput.value = formatDate(defaultCheckIn);

    checkOutInput.min = formatDate(new Date(defaultCheckIn.getTime() + 86400000));
    checkOutInput.value = formatDate(defaultCheckOut);

    this.searchState.checkInDate = checkInInput.value;
    this.searchState.checkOutDate = checkOutInput.value;
    this.searchState.nights = 3;

    const updateNights = () => {
      const inDate = new Date(checkInInput.value);
      const outDate = new Date(checkOutInput.value);

      if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return;

      const diffTime = outDate - inDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        const adjustedOut = new Date(inDate.getTime() + 86400000);
        checkOutInput.value = formatDate(adjustedOut);
        this.searchState.nights = 1;
        window.showToast('Check-out must be after check-in. Adjusted to 1 night.', 'info');
      } else {
        this.searchState.nights = diffDays;
      }

      this.searchState.checkInDate = checkInInput.value;
      this.searchState.checkOutDate = checkOutInput.value;

      if (nightsBadge) {
        nightsBadge.textContent = `${this.searchState.nights} Night${this.searchState.nights > 1 ? 's' : ''}`;
      }

      if (window.bookingCalcManager) {
        window.bookingCalcManager.syncDates(this.searchState.checkInDate, this.searchState.checkOutDate, this.searchState.nights);
      }
    };

    checkInInput.addEventListener('change', () => {
      const newInDate = new Date(checkInInput.value);
      if (!isNaN(newInDate.getTime())) {
        const nextDay = new Date(newInDate.getTime() + 86400000);
        checkOutInput.min = formatDate(nextDay);

        const currentOut = new Date(checkOutInput.value);
        if (currentOut <= newInDate) {
          checkOutInput.value = formatDate(nextDay);
        }
      }
      updateNights();
    });

    checkOutInput.addEventListener('change', updateNights);
    updateNights();
  }

  initGuestPopover() {
    const trigger = document.getElementById('search-guests-trigger');
    const popover = document.getElementById('search-guests-popover');
    const summaryInput = document.getElementById('search-guests-summary');
    const applyBtn = document.getElementById('guests-apply-btn');

    if (!trigger || !popover || !summaryInput) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !trigger.contains(e.target)) {
        popover.classList.remove('active');
      }
    });

    const updateDisplay = () => {
      const { adults, children, rooms } = this.searchState.guests;
      const totalGuests = adults + children;
      
      const guestText = `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}`;
      const roomText = `${rooms} Room${rooms > 1 ? 's' : ''}`;
      
      summaryInput.value = `${guestText}, ${roomText}`;

      const adultEl = document.getElementById('count-adults');
      const childEl = document.getElementById('count-children');
      const roomEl = document.getElementById('count-rooms');

      if (adultEl) adultEl.textContent = adults;
      if (childEl) childEl.textContent = children;
      if (roomEl) roomEl.textContent = rooms;

      const minusAdult = document.querySelector('[data-action="minus-adults"]');
      const minusChild = document.querySelector('[data-action="minus-children"]');
      const minusRoom = document.querySelector('[data-action="minus-rooms"]');

      if (minusAdult) minusAdult.disabled = adults <= 1;
      if (minusChild) minusChild.disabled = children <= 0;
      if (minusRoom) minusRoom.disabled = rooms <= 1;

      if (window.bookingCalcManager) {
        window.bookingCalcManager.syncGuests(this.searchState.guests);
      }
    };

    popover.addEventListener('click', (e) => {
      const btn = e.target.closest('.counter-btn');
      if (!btn) return;
      e.stopPropagation();

      const action = btn.getAttribute('data-action');
      const { guests } = this.searchState;

      switch (action) {
        case 'plus-adults':
          if (guests.adults < 10) guests.adults++;
          break;
        case 'minus-adults':
          if (guests.adults > 1) guests.adults--;
          break;
        case 'plus-children':
          if (guests.children < 6) guests.children++;
          break;
        case 'minus-children':
          if (guests.children > 0) guests.children--;
          break;
        case 'plus-rooms':
          if (guests.rooms < 5) guests.rooms++;
          break;
        case 'minus-rooms':
          if (guests.rooms > 1) guests.rooms--;
          break;
      }
      updateDisplay();
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.remove('active');
      });
    }

    updateDisplay();
  }

  initDestinationAutocomplete() {
    const input = document.getElementById('hero-destination-input');
    const dropdown = document.getElementById('destination-autocomplete-list');
    const heroSearchBtn = document.getElementById('hero-search-btn');

    if (!input || !dropdown) return;

    const renderAutocomplete = (query) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        dropdown.classList.remove('show');
        return;
      }

      const matches = this.destinations.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="autocomplete-no-match">
            <i class="fa-solid fa-compass"></i>
            <span>No destinations found for "${query}"</span>
          </div>
        `;
        dropdown.classList.add('show');
        return;
      }

      dropdown.innerHTML = matches.map(dest => `
        <div class="autocomplete-item" data-id="${dest.id}" data-name="${dest.name}">
          <div class="autocomplete-item-img">
            <img src="${dest.image}" alt="${dest.name}">
          </div>
          <div class="autocomplete-item-details">
            <div class="autocomplete-name">${dest.name}, ${dest.country}</div>
            <div class="autocomplete-meta">${dest.staysCount} curated stays • from $${dest.startingPrice}/night</div>
          </div>
          <span class="autocomplete-badge">${dest.region}</span>
        </div>
      `).join('');

      dropdown.classList.add('show');
    };

    input.addEventListener('input', (e) => {
      renderAutocomplete(e.target.value);
    });

    input.addEventListener('focus', (e) => {
      if (e.target.value.trim()) renderAutocomplete(e.target.value);
    });

    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;

      const destId = item.getAttribute('data-id');
      const destName = item.getAttribute('data-name');

      input.value = destName;
      dropdown.classList.remove('show');
      this.filterByDestination(destId);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    if (heroSearchBtn) {
      heroSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const val = input.value.trim().toLowerCase();
        if (val) {
          const matched = this.destinations.find(d => 
            d.name.toLowerCase().includes(val) || 
            d.country.toLowerCase().includes(val)
          );
          if (matched) {
            this.filterByDestination(matched.id);
          } else {
            this.searchState.keyword = val;
            this.applyFilters();
          }
        } else {
          this.searchState.destinationId = 'all';
          this.applyFilters();
        }

        const hotelsSection = document.getElementById('hotels-section');
        if (hotelsSection) {
          hotelsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  filterByDestination(destId) {
    this.searchState.destinationId = destId;
    
    const hotelDestSelect = document.getElementById('filter-destination');
    if (hotelDestSelect) {
      hotelDestSelect.value = destId;
    }

    this.applyFilters();

    const hotelsSection = document.getElementById('hotels-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderDestinations(category = 'all') {
    const container = document.getElementById('destinations-grid');
    if (!container) return;

    let list = this.destinations;
    if (category !== 'all') {
      list = list.filter(d => d.category === category);
    }

    container.innerHTML = list.map((dest, idx) => {
      const formattedPrice = window.formatCurrency 
        ? window.formatCurrency(dest.startingPrice) 
        : `$${dest.startingPrice}`;

      return `
        <div class="destination-card" data-aos="fade-up" data-aos-delay="${idx * 80}" onclick="searchManager.filterByDestination('${dest.id}')">
          <div class="destination-image-wrapper">
            <img src="${dest.image}" alt="${dest.name}" class="destination-img" loading="lazy">
            <div class="destination-overlay"></div>
            <span class="destination-badge">${dest.badge}</span>
            <div class="destination-rating-pill">
              <i class="fa-solid fa-star"></i>
              <span>${dest.rating}</span>
            </div>
          </div>
          <div class="destination-body">
            <div class="destination-header">
              <h3 class="destination-title">${dest.name}</h3>
              <span class="destination-country"><i class="fa-solid fa-location-dot"></i> ${dest.country}</span>
            </div>
            <p class="destination-desc">${dest.tagline}</p>
            <div class="destination-footer">
              <div class="destination-stays">
                <i class="fa-solid fa-hotel"></i>
                <span>${dest.staysCount} Stays</span>
              </div>
              <div class="destination-price">
                <span class="from">From</span>
                <span class="amount">${formattedPrice}</span>
                <span class="night">/night</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const tabs = document.querySelectorAll('.dest-tab-btn');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-category') === category);
    });
  }

  initFilterControls() {
    const keywordInput = document.getElementById('filter-keyword');
    const destSelect = document.getElementById('filter-destination');
    const priceSlider = document.getElementById('filter-price-slider');
    const priceValDisplay = document.getElementById('filter-price-value');
    const ratingSelect = document.getElementById('filter-rating');
    const sortSelect = document.getElementById('filter-sort');
    const resetBtn = document.getElementById('filter-reset-btn');
    const categoryPills = document.querySelectorAll('.hotel-category-pill');
    const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox');

    if (destSelect) {
      destSelect.innerHTML = `
        <option value="all">All Destinations</option>
        ${this.destinations.map(d => `<option value="${d.id}">${d.name}, ${d.country}</option>`).join('')}
      `;
      destSelect.addEventListener('change', (e) => {
        this.searchState.destinationId = e.target.value;
        this.applyFilters();
      });
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', (e) => {
        this.searchState.keyword = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    if (priceSlider && priceValDisplay) {
      priceSlider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.searchState.maxPrice = val;
        const formatted = window.formatCurrency ? window.formatCurrency(val) : `$${val}`;
        priceValDisplay.textContent = formatted;
        this.applyFilters();
      });
    }

    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        this.searchState.minRating = Number(e.target.value);
        this.applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.searchState.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.searchState.category = pill.getAttribute('data-category');
        this.applyFilters();
      });
    });

    amenityCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const selected = Array.from(amenityCheckboxes)
          .filter(c => c.checked)
          .map(c => c.value);
        this.searchState.amenities = selected;
        this.applyFilters();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  resetFilters() {
    this.searchState = {
      ...this.searchState,
      keyword: '',
      destinationId: 'all',
      category: 'all',
      maxPrice: 800,
      minRating: 0,
      amenities: [],
      sortBy: 'recommended'
    };

    const keywordInput = document.getElementById('filter-keyword');
    const destSelect = document.getElementById('filter-destination');
    const priceSlider = document.getElementById('filter-price-slider');
    const priceValDisplay = document.getElementById('filter-price-value');
    const ratingSelect = document.getElementById('filter-rating');
    const sortSelect = document.getElementById('filter-sort');
    const categoryPills = document.querySelectorAll('.hotel-category-pill');
    const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox');
    const heroDestInput = document.getElementById('hero-destination-input');

    if (keywordInput) keywordInput.value = '';
    if (heroDestInput) heroDestInput.value = '';
    if (destSelect) destSelect.value = 'all';
    if (priceSlider) priceSlider.value = 800;
    if (priceValDisplay) {
      const formatted = window.formatCurrency ? window.formatCurrency(800) : '$800';
      priceValDisplay.textContent = formatted;
    }
    if (ratingSelect) ratingSelect.value = '0';
    if (sortSelect) sortSelect.value = 'recommended';

    categoryPills.forEach((p, idx) => p.classList.toggle('active', idx === 0));
    amenityCheckboxes.forEach(cb => cb.checked = false);

    this.applyFilters();
    window.showToast('All filters have been reset.', 'info');
  }

  applyFilters() {
    let result = [...this.hotels];
    const { keyword, destinationId, category, maxPrice, minRating, amenities, sortBy } = this.searchState;

    if (destinationId && destinationId !== 'all') {
      result = result.filter(h => h.destinationId === destinationId);
    }

    if (keyword) {
      result = result.filter(h => 
        h.name.toLowerCase().includes(keyword) ||
        h.destinationName.toLowerCase().includes(keyword) ||
        h.country.toLowerCase().includes(keyword) ||
        h.description.toLowerCase().includes(keyword) ||
        h.amenities.some(a => a.toLowerCase().includes(keyword))
      );
    }

    if (category && category !== 'all') {
      result = result.filter(h => h.category === category);
    }

    result = result.filter(h => h.pricePerNight <= maxPrice);

    if (minRating > 0) {
      result = result.filter(h => h.rating >= minRating);
    }

    if (amenities.length > 0) {
      result = result.filter(h => 
        amenities.every(amenity => 
          h.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews-desc':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    this.filteredHotels = result;
    this.renderHotels();
    this.updateResultCount();
  }

  updateResultCount() {
    const countEl = document.getElementById('hotels-count-badge');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${this.filteredHotels.length}</strong> of ${this.hotels.length} stays`;
    }
  }

  renderHotels() {
    const container = document.getElementById('hotels-grid');
    const emptyState = document.getElementById('hotels-empty-state');
    if (!container) return;

    if (this.filteredHotels.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = this.filteredHotels.map((hotel, idx) => {
      const isWishlisted = window.wishlistManager ? window.wishlistManager.has(hotel.id) : false;
      
      const formattedPrice = window.formatCurrency 
        ? window.formatCurrency(hotel.pricePerNight) 
        : `$${hotel.pricePerNight}`;
      
      const formattedOriginal = window.formatCurrency 
        ? window.formatCurrency(hotel.originalPrice) 
        : `$${hotel.originalPrice}`;

      const nights = this.searchState.nights || 3;
      const totalEstimated = window.formatCurrency 
        ? window.formatCurrency(hotel.pricePerNight * nights) 
        : `$${hotel.pricePerNight * nights}`;

      return `
        <div class="hotel-card" data-id="${hotel.id}" data-aos="fade-up" data-aos-delay="${(idx % 3) * 100}">
          <div class="hotel-image-wrapper">
            <img src="${hotel.image}" alt="${hotel.name}" class="hotel-img" loading="lazy">
            <div class="hotel-badge-row">
              <span class="hotel-badge badge-${hotel.category}">${hotel.badge}</span>
              ${hotel.discountPercent ? `<span class="hotel-discount-badge">-${hotel.discountPercent}%</span>` : ''}
            </div>
            <button class="hotel-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    data-hotel-id="${hotel.id}"
                    onclick="searchManager.toggleWishlist('${hotel.id}', event)" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <i class="fa-solid fa-heart"></i>
            </button>
            <div class="hotel-rating-chip">
              <i class="fa-solid fa-star"></i>
              <span>${hotel.rating}</span>
            </div>
          </div>

          <div class="hotel-content">
            <div class="hotel-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>${hotel.destinationName}, ${hotel.country}</span>
            </div>

            <h3 class="hotel-title" onclick="openBookingModal('${hotel.id}')">${hotel.name}</h3>
            
            <p class="hotel-desc">${hotel.description}</p>

            <div class="hotel-amenities-list">
              ${hotel.amenities.slice(0, 4).map(amenity => `
                <span class="amenity-tag">
                  <i class="fa-solid fa-check"></i> ${amenity}
                </span>
              `).join('')}
              ${hotel.amenities.length > 4 ? `<span class="amenity-tag more">+${hotel.amenities.length - 4} more</span>` : ''}
            </div>

            <div class="hotel-pricing-row">
              <div class="hotel-prices">
                <div class="hotel-original-price">${formattedOriginal}</div>
                <div class="hotel-current-price">
                  <span class="price-val">${formattedPrice}</span>
                  <span class="price-unit">/ night</span>
                </div>
                <div class="hotel-total-estimate">
                  <span class="est-label">${nights} nights est:</span>
                  <span class="est-amount">${totalEstimated}</span>
                </div>
              </div>

              <div class="hotel-actions">
                <button class="btn btn-primary btn-book" onclick="openBookingModal('${hotel.id}')">
                  <span>Book Now</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.wishlistManager) {
      window.wishlistManager.syncHeartButtons();
    }
  }

  toggleWishlist(hotelId, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (window.wishlistManager) {
      window.wishlistManager.toggle(hotelId);
    }
  }
}

/* ============================================================================
   4. DYNAMIC BOOKING PRICE ESTIMATOR & CHECKOUT SYSTEM
   ============================================================================ */
class BookingCalculatorManager {
  constructor() {
    this.selectedHotel = TRAVEL_DATA.hotels[0];
    this.selectedRoomTier = 0;
    this.checkIn = '';
    this.checkOut = '';
    this.nights = 3;
    this.guests = { adults: 2, children: 0 };
    this.appliedCoupon = null;
    this.selectedAddons = new Set();
    this.storageBookingsKey = 'wanderlux_user_bookings';

    this.init();
  }

  init() {
    this.initDefaultDates();
    this.bindCalculatorElements();
    this.bindModalElements();
    this.renderPromotions();
    this.recalculateAll();
  }

  initDefaultDates() {
    const today = new Date();
    const checkIn = new Date();
    checkIn.setDate(today.getDate() + 7);

    const checkOut = new Date();
    checkOut.setDate(checkIn.getDate() + 3);

    const format = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    this.checkIn = format(checkIn);
    this.checkOut = format(checkOut);
    this.nights = 3;
  }

  syncDates(checkIn, checkOut, nights) {
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.nights = nights || 1;

    const calcIn = document.getElementById('calc-checkin');
    const calcOut = document.getElementById('calc-checkout');
    if (calcIn) calcIn.value = checkIn;
    if (calcOut) calcOut.value = checkOut;

    this.recalculateAll();
  }

  syncGuests(guests) {
    this.guests = { ...guests };
    const calcAdults = document.getElementById('calc-adults');
    const calcChildren = document.getElementById('calc-children');
    if (calcAdults) calcAdults.value = guests.adults;
    if (calcChildren) calcChildren.value = guests.children;

    this.recalculateAll();
  }

  bindCalculatorElements() {
    const hotelSelect = document.getElementById('calc-hotel-select');
    const calcCheckin = document.getElementById('calc-checkin');
    const calcCheckout = document.getElementById('calc-checkout');
    const calcAdults = document.getElementById('calc-adults');
    const calcChildren = document.getElementById('calc-children');
    const couponInput = document.getElementById('calc-coupon-input');
    const couponApplyBtn = document.getElementById('calc-coupon-btn');

    if (hotelSelect) {
      hotelSelect.innerHTML = TRAVEL_DATA.hotels.map(h => `
        <option value="${h.id}">${h.name} (${h.destinationName}) - $${h.pricePerNight}/night</option>
      `).join('');

      hotelSelect.addEventListener('change', (e) => {
        const found = TRAVEL_DATA.hotels.find(h => h.id === e.target.value);
        if (found) {
          this.selectedHotel = found;
          this.selectedRoomTier = 0;
          this.renderRoomTiers();
          this.recalculateAll();
        }
      });
    }

    if (calcCheckin && calcCheckout) {
      calcCheckin.value = this.checkIn;
      calcCheckout.value = this.checkOut;

      calcCheckin.addEventListener('change', () => {
        this.checkIn = calcCheckin.value;
        const inDate = new Date(this.checkIn);
        const outDate = new Date(this.checkOut);
        if (outDate <= inDate) {
          const next = new Date(inDate.getTime() + 86400000);
          calcCheckout.value = next.toISOString().split('T')[0];
          this.checkOut = calcCheckout.value;
        }
        this.updateNightsFromInputs(calcCheckin, calcCheckout);
        this.recalculateAll();
      });

      calcCheckout.addEventListener('change', () => {
        this.checkOut = calcCheckout.value;
        this.updateNightsFromInputs(calcCheckin, calcCheckout);
        this.recalculateAll();
      });
    }

    if (calcAdults) {
      calcAdults.value = this.guests.adults;
      calcAdults.addEventListener('change', (e) => {
        this.guests.adults = Math.max(1, parseInt(e.target.value) || 1);
        this.recalculateAll();
      });
    }

    if (calcChildren) {
      calcChildren.value = this.guests.children;
      calcChildren.addEventListener('change', (e) => {
        this.guests.children = Math.max(0, parseInt(e.target.value) || 0);
        this.recalculateAll();
      });
    }

    if (couponApplyBtn && couponInput) {
      couponApplyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyCouponCode(couponInput.value.trim());
      });

      couponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyCouponCode(couponInput.value.trim());
        }
      });
    }

    this.renderRoomTiers();
    this.renderAddons();
  }

  updateNightsFromInputs(inEl, outEl) {
    const dIn = new Date(inEl.value);
    const dOut = new Date(outEl.value);
    const diff = Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24));
    this.nights = diff > 0 ? diff : 1;
    const badge = document.getElementById('calc-nights-count');
    if (badge) badge.textContent = `${this.nights} Night${this.nights > 1 ? 's' : ''}`;
  }

  renderRoomTiers() {
    const container = document.getElementById('calc-room-tiers');
    if (!container || !this.selectedHotel.roomTiers) return;

    container.innerHTML = this.selectedHotel.roomTiers.map((tier, idx) => {
      const tierPrice = Math.round(this.selectedHotel.pricePerNight * tier.multiplier);
      const formatted = window.formatCurrency ? window.formatCurrency(tierPrice) : `$${tierPrice}`;

      return `
        <div class="room-tier-card ${idx === this.selectedRoomTier ? 'active' : ''}" 
             data-tier-idx="${idx}"
             onclick="bookingCalcManager.selectRoomTier(${idx})">
          <div class="tier-radio">
            <i class="fa-solid ${idx === this.selectedRoomTier ? 'fa-circle-dot' : 'fa-circle'}"></i>
          </div>
          <div class="tier-details">
            <h4 class="tier-name">${tier.name}</h4>
            <div class="tier-meta">
              <span><i class="fa-solid fa-bed"></i> ${tier.beds}</span>
              <span><i class="fa-solid fa-vector-square"></i> ${tier.sqft} sq ft</span>
            </div>
          </div>
          <div class="tier-pricing">
            <span class="tier-price">${formatted}</span>
            <span class="tier-period">/night</span>
          </div>
        </div>
      `;
    }).join('');
  }

  selectRoomTier(idx) {
    this.selectedRoomTier = idx;
    this.renderRoomTiers();
    this.recalculateAll();
  }

  renderAddons() {
    const container = document.getElementById('calc-addons-list');
    if (!container) return;

    container.innerHTML = TRAVEL_DATA.bookingAddons.map(addon => {
      const isChecked = this.selectedAddons.has(addon.id);
      const formatted = window.formatCurrency ? window.formatCurrency(addon.price) : `$${addon.price}`;

      return `
        <label class="addon-item ${isChecked ? 'selected' : ''}">
          <input type="checkbox" class="addon-checkbox" value="${addon.id}" ${isChecked ? 'checked' : ''} 
                 onchange="bookingCalcManager.toggleAddon('${addon.id}')">
          <div class="addon-icon">
            <i class="fa-solid ${addon.icon}"></i>
          </div>
          <div class="addon-info">
            <span class="addon-name">${addon.name}</span>
            <span class="addon-note">${addon.perPerson ? 'Per guest' : 'Per stay'}</span>
          </div>
          <span class="addon-price">+${formatted}</span>
        </label>
      `;
    }).join('');
  }

  toggleAddon(addonId) {
    if (this.selectedAddons.has(addonId)) {
      this.selectedAddons.delete(addonId);
    } else {
      this.selectedAddons.add(addonId);
    }
    this.renderAddons();
    this.recalculateAll();
  }

  applyCouponCode(code) {
    if (!code) {
      window.showToast('Please enter a coupon code.', 'warning');
      return;
    }

    const upper = code.toUpperCase();
    const promo = TRAVEL_DATA.promotions.find(p => p.code.toUpperCase() === upper) ||
      (upper === 'WELCOME15' ? {
        code: 'WELCOME15',
        discount: 15,
        type: 'percentage',
        title: 'Welcome 15% Discount',
        minNights: 1
      } : null);

    if (!promo) {
      window.showToast(`Coupon "${code}" is invalid or expired.`, 'error');
      return;
    }

    if (promo.minNights && this.nights < promo.minNights) {
      window.showToast(`Coupon ${promo.code} requires a minimum stay of ${promo.minNights} nights.`, 'warning');
      return;
    }

    this.appliedCoupon = promo;
    
    const calcInput = document.getElementById('calc-coupon-input');
    const modalInput = document.getElementById('modal-coupon-input');
    if (calcInput) calcInput.value = promo.code;
    if (modalInput) modalInput.value = promo.code;

    const discountLabel = promo.type === 'percentage' ? `${promo.discount}% OFF` : `$${promo.discount} OFF`;
    window.showToast(`Coupon "${promo.code}" applied! (${discountLabel}) 🎉`, 'success');

    this.recalculateAll();
  }

  removeCoupon() {
    this.appliedCoupon = null;
    const calcInput = document.getElementById('calc-coupon-input');
    const modalInput = document.getElementById('modal-coupon-input');
    if (calcInput) calcInput.value = '';
    if (modalInput) modalInput.value = '';

    window.showToast('Coupon removed.', 'info');
    this.recalculateAll();
  }

  calculateTotals() {
    const hotel = this.selectedHotel;
    const nights = Math.max(1, this.nights);
    const roomTier = (hotel.roomTiers && hotel.roomTiers[this.selectedRoomTier]) || { multiplier: 1.0, name: 'Standard' };

    const nightlyRate = Math.round(hotel.pricePerNight * roomTier.multiplier);
    const baseRoomTotal = nightlyRate * nights;

    const extraAdults = Math.max(0, this.guests.adults - 2);
    const guestSurcharge = extraAdults * 35 * nights;

    let addonsTotal = 0;
    const totalPeople = this.guests.adults + this.guests.children;
    TRAVEL_DATA.bookingAddons.forEach(addon => {
      if (this.selectedAddons.has(addon.id)) {
        if (addon.perPerson) {
          addonsTotal += addon.price * totalPeople;
        } else {
          addonsTotal += addon.price;
        }
      }
    });

    const subtotal = baseRoomTotal + guestSurcharge + addonsTotal;

    let discountAmount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === 'percentage') {
        discountAmount = Math.round((subtotal * this.appliedCoupon.discount) / 100);
      } else {
        discountAmount = this.appliedCoupon.discount;
      }
      discountAmount = Math.min(discountAmount, subtotal);
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxesAndFees = Math.round(taxableAmount * 0.12);
    const grandTotal = taxableAmount + taxesAndFees;

    return {
      hotel,
      roomTier,
      nights,
      nightlyRate,
      baseRoomTotal,
      extraAdults,
      guestSurcharge,
      addonsTotal,
      subtotal,
      discountAmount,
      taxesAndFees,
      grandTotal
    };
  }

  recalculateAll() {
    const totals = this.calculateTotals();
    const format = window.formatCurrency || ((val) => `$${val}`);

    const rateEl = document.getElementById('calc-summary-rate');
    const baseTotalEl = document.getElementById('calc-summary-base');
    const tierMultiplierEl = document.getElementById('calc-summary-tier');
    const extraGuestsEl = document.getElementById('calc-summary-guests');
    const addonsEl = document.getElementById('calc-summary-addons');
    const discountEl = document.getElementById('calc-summary-discount');
    const discountRowEl = document.getElementById('calc-discount-row');
    const taxesEl = document.getElementById('calc-summary-taxes');
    const grandTotalEl = document.getElementById('calc-summary-total');

    if (rateEl) rateEl.textContent = `${format(totals.nightlyRate)} × ${totals.nights} night${totals.nights > 1 ? 's' : ''}`;
    if (baseTotalEl) baseTotalEl.textContent = format(totals.baseRoomTotal);
    if (tierMultiplierEl) tierMultiplierEl.textContent = `${totals.roomTier.name} (${totals.roomTier.multiplier}x)`;
    if (extraGuestsEl) extraGuestsEl.textContent = totals.guestSurcharge > 0 ? `+${format(totals.guestSurcharge)}` : 'Included';
    if (addonsEl) addonsEl.textContent = totals.addonsTotal > 0 ? `+${format(totals.addonsTotal)}` : 'None';

    if (discountRowEl && discountEl) {
      if (totals.discountAmount > 0 && this.appliedCoupon) {
        discountRowEl.style.display = 'flex';
        discountEl.textContent = `-${format(totals.discountAmount)} (${this.appliedCoupon.code})`;
      } else {
        discountRowEl.style.display = 'none';
      }
    }

    if (taxesEl) taxesEl.textContent = format(totals.taxesAndFees);
    if (grandTotalEl) grandTotalEl.textContent = format(totals.grandTotal);

    this.updateModalBreakdown(totals, format);
  }

  renderPromotions() {
    const container = document.getElementById('promotions-grid');
    if (!container) return;

    container.innerHTML = TRAVEL_DATA.promotions.map((promo, idx) => `
      <div class="promo-card" data-aos="zoom-in" data-aos-delay="${idx * 100}">
        <div class="promo-card-glow" style="background: ${promo.accentColor}"></div>
        <div class="promo-card-header">
          <span class="promo-badge">${promo.tag}</span>
          <span class="promo-discount-badge">${promo.badgeText}</span>
        </div>
        <div class="promo-card-body">
          <h3 class="promo-title">${promo.title}</h3>
          <p class="promo-desc">${promo.description}</p>
          <div class="promo-validity">
            <i class="fa-regular fa-clock"></i>
            <span>Valid until ${promo.validUntil}</span>
          </div>
        </div>
        <div class="promo-card-footer">
          <div class="coupon-code-box">
            <span class="coupon-label">CODE:</span>
            <span class="coupon-code">${promo.code}</span>
          </div>
          <button class="btn btn-sm btn-coupon" onclick="copyCouponCode('${promo.code}', this)">
            <i class="fa-regular fa-copy"></i>
            <span>Copy Code</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  bindModalElements() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('booking-modal-close');
    const backdrop = document.getElementById('booking-modal-backdrop');
    const form = document.getElementById('booking-checkout-form');
    const modalCouponBtn = document.getElementById('modal-coupon-btn');
    const modalCouponInput = document.getElementById('modal-coupon-input');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeBookingModal());
    if (backdrop) backdrop.addEventListener('click', () => this.closeBookingModal());

    if (modalCouponBtn && modalCouponInput) {
      modalCouponBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.applyCouponCode(modalCouponInput.value.trim());
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit(form);
      });
    }
  }

  openBookingModal(hotelId) {
    const hotel = TRAVEL_DATA.hotels.find(h => h.id === hotelId) || TRAVEL_DATA.hotels[0];
    this.selectedHotel = hotel;
    this.selectedRoomTier = 0;

    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-hotel-title');
    const locEl = document.getElementById('modal-hotel-location');
    const ratingEl = document.getElementById('modal-hotel-rating');
    const imgEl = document.getElementById('modal-hotel-img');

    if (titleEl) titleEl.textContent = hotel.name;
    if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${hotel.destinationName}, ${hotel.country}`;
    if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star"></i> ${hotel.rating} (${hotel.reviewsCount} reviews)`;
    if (imgEl) imgEl.src = hotel.image;

    const roomSelect = document.getElementById('modal-room-select');
    if (roomSelect && hotel.roomTiers) {
      roomSelect.innerHTML = hotel.roomTiers.map((tier, idx) => `
        <option value="${idx}">${tier.name} (${tier.beds}) - ${tier.multiplier}x rate</option>
      `).join('');
      roomSelect.value = '0';
      roomSelect.onchange = (e) => {
        this.selectedRoomTier = parseInt(e.target.value) || 0;
        this.recalculateAll();
      };
    }

    const mCheckIn = document.getElementById('modal-checkin');
    const mCheckOut = document.getElementById('modal-checkout');
    if (mCheckIn && mCheckOut) {
      mCheckIn.value = this.checkIn;
      mCheckOut.value = this.checkOut;

      mCheckIn.onchange = () => {
        this.checkIn = mCheckIn.value;
        const dIn = new Date(this.checkIn);
        const dOut = new Date(this.checkOut);
        if (dOut <= dIn) {
          const next = new Date(dIn.getTime() + 86400000);
          mCheckOut.value = next.toISOString().split('T')[0];
          this.checkOut = mCheckOut.value;
        }
        this.updateNightsFromInputs(mCheckIn, mCheckOut);
        this.recalculateAll();
      };

      mCheckOut.onchange = () => {
        this.checkOut = mCheckOut.value;
        this.updateNightsFromInputs(mCheckIn, mCheckOut);
        this.recalculateAll();
      };
    }

    const mAdults = document.getElementById('modal-adults');
    const mChildren = document.getElementById('modal-children');
    if (mAdults) {
      mAdults.value = this.guests.adults;
      mAdults.onchange = (e) => {
        this.guests.adults = Math.max(1, parseInt(e.target.value) || 1);
        this.recalculateAll();
      };
    }
    if (mChildren) {
      mChildren.value = this.guests.children;
      mChildren.onchange = (e) => {
        this.guests.children = Math.max(0, parseInt(e.target.value) || 0);
        this.recalculateAll();
      };
    }

    const mCoupon = document.getElementById('modal-coupon-input');
    if (mCoupon && this.appliedCoupon) {
      mCoupon.value = this.appliedCoupon.code;
    }

    this.recalculateAll();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateModalBreakdown(totals, format) {
    const mNights = document.getElementById('modal-summary-nights');
    const mBase = document.getElementById('modal-summary-base');
    const mDiscountRow = document.getElementById('modal-summary-discount-row');
    const mDiscount = document.getElementById('modal-summary-discount');
    const mTaxes = document.getElementById('modal-summary-taxes');
    const mTotal = document.getElementById('modal-summary-total');

    if (mNights) mNights.textContent = `${totals.nights} night${totals.nights > 1 ? 's' : ''} (${format(totals.nightlyRate)}/nt)`;
    if (mBase) mBase.textContent = format(totals.baseRoomTotal + totals.guestSurcharge);

    if (mDiscountRow && mDiscount) {
      if (totals.discountAmount > 0 && this.appliedCoupon) {
        mDiscountRow.style.display = 'flex';
        mDiscount.textContent = `-${format(totals.discountAmount)} (${this.appliedCoupon.code})`;
      } else {
        mDiscountRow.style.display = 'none';
      }
    }

    if (mTaxes) mTaxes.textContent = format(totals.taxesAndFees);
    if (mTotal) mTotal.textContent = format(totals.grandTotal);
  }

  handleCheckoutSubmit(form) {
    const nameInput = form.querySelector('[name="fullName"]');
    const emailInput = form.querySelector('[name="email"]');
    const phoneInput = form.querySelector('[name="phone"]');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
      window.showToast('Please fill out all required guest fields.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      window.showToast('Please provide a valid email address.', 'warning');
      return;
    }

    const totals = this.calculateTotals();
    const bookingRef = `WL-${Math.floor(1000 + Math.random() * 9000)}-${totals.hotel.destinationName.substring(0, 3).toUpperCase()}`;

    const newBooking = {
      refId: bookingRef,
      hotelName: totals.hotel.name,
      destination: `${totals.hotel.destinationName}, ${totals.hotel.country}`,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      nights: totals.nights,
      guests: `${this.guests.adults} Adults, ${this.guests.children} Children`,
      roomTier: totals.roomTier.name,
      totalPaid: totals.grandTotal,
      currency: window.currentCurrency || 'USD',
      guestName: nameInput.value.trim(),
      guestEmail: emailInput.value.trim(),
      guestPhone: phoneInput.value.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem(this.storageBookingsKey) || '[]');
      existing.unshift(newBooking);
      localStorage.setItem(this.storageBookingsKey, JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving booking:', e);
    }

    this.closeBookingModal();
    this.showConfirmationCelebration(newBooking);
    form.reset();
  }

  showConfirmationCelebration(booking) {
    const confirmationModal = document.getElementById('confirmation-modal');
    if (!confirmationModal) return;

    const refEl = document.getElementById('confirm-ref-id');
    const hotelEl = document.getElementById('confirm-hotel-name');
    const datesEl = document.getElementById('confirm-dates');
    const guestsEl = document.getElementById('confirm-guests');
    const totalEl = document.getElementById('confirm-total');
    const emailEl = document.getElementById('confirm-email');

    const format = window.formatCurrency || ((v) => `$${v}`);

    if (refEl) refEl.textContent = booking.refId;
    if (hotelEl) hotelEl.textContent = booking.hotelName;
    if (datesEl) datesEl.textContent = `${booking.checkIn} to ${booking.checkOut} (${booking.nights} nights)`;
    if (guestsEl) guestsEl.textContent = `${booking.guests} • ${booking.roomTier}`;
    if (totalEl) totalEl.textContent = format(booking.totalPaid);
    if (emailEl) emailEl.textContent = booking.guestEmail;

    confirmationModal.classList.add('active');
    window.showToast(`🎉 Reservation confirmed! Booking ID: ${booking.refId}`, 'success');
  }
}

/* ============================================================================
   5. RESPONSIVE CUSTOMER TESTIMONIALS SLIDER
   ============================================================================ */
class TestimonialSlider {
  constructor() {
    this.trackEl = document.getElementById('testimonials-track');
    this.prevBtn = document.getElementById('testimonial-prev-btn');
    this.nextBtn = document.getElementById('testimonial-next-btn');
    this.dotsContainer = document.getElementById('testimonial-dots');
    this.sliderWrapper = document.getElementById('testimonials-slider-wrapper');
    
    this.testimonials = TRAVEL_DATA.testimonials;
    this.currentIndex = 0;
    this.cardsPerView = 3;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;
    this.isHovered = false;

    this.startX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    if (!this.trackEl) return;
    this.renderTestimonials();
    this.updateCardsPerView();
    this.renderDots();
    this.bindEvents();
    this.startAutoPlay();
    this.updateSlider();
  }

  renderTestimonials() {
    this.trackEl.innerHTML = this.testimonials.map((item, idx) => `
      <div class="testimonial-card" data-index="${idx}">
        <div class="testimonial-card-inner">
          <div class="testimonial-quote-icon">
            <i class="fa-solid fa-quote-right"></i>
          </div>

          <div class="testimonial-stars">
            ${Array(item.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>

          <p class="testimonial-text">"${item.quote}"</p>

          <div class="testimonial-stay-badge">
            <i class="fa-solid fa-hotel"></i>
            <span>Stayed at <strong>${item.hotelStayed}</strong></span>
          </div>

          <div class="testimonial-user-profile">
            <div class="testimonial-avatar">
              <img src="${item.avatar}" alt="${item.name}" loading="lazy">
              ${item.verified ? '<span class="verified-check" title="Verified Guest"><i class="fa-solid fa-check"></i></span>' : ''}
            </div>
            <div class="testimonial-user-meta">
              <h4 class="user-name">${item.name}</h4>
              <span class="user-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  updateCardsPerView() {
    const width = window.innerWidth;
    if (width < 640) {
      this.cardsPerView = 1;
    } else if (width < 1024) {
      this.cardsPerView = 2;
    } else {
      this.cardsPerView = 3;
    }
  }

  getMaxIndex() {
    return Math.max(0, this.testimonials.length - this.cardsPerView);
  }

  renderDots() {
    if (!this.dotsContainer) return;
    const maxIdx = this.getMaxIndex();
    this.dotsContainer.innerHTML = '';

    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetAutoPlay();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateSlider() {
    const maxIdx = this.getMaxIndex();
    if (this.currentIndex > maxIdx) {
      this.currentIndex = maxIdx;
    }

    const cardWidthPercentage = 100 / this.cardsPerView;
    const movePercentage = this.currentIndex * cardWidthPercentage;
    this.trackEl.style.transform = `translateX(-${movePercentage}%)`;

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }

    if (this.prevBtn) {
      this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
    }
    if (this.nextBtn) {
      this.nextBtn.classList.toggle('disabled', this.currentIndex >= maxIdx);
    }
  }

  nextSlide() {
    const maxIdx = this.getMaxIndex();
    if (this.currentIndex >= maxIdx) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.updateSlider();
  }

  prevSlide() {
    const maxIdx = this.getMaxIndex();
    if (this.currentIndex <= 0) {
      this.currentIndex = maxIdx;
    } else {
      this.currentIndex--;
    }
    this.updateSlider();
  }

  goToSlide(idx) {
    this.currentIndex = idx;
    this.updateSlider();
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoPlay();
      });
    }

    if (this.sliderWrapper) {
      this.sliderWrapper.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });

      this.sliderWrapper.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });

      this.sliderWrapper.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
      }, { passive: true });

      this.sliderWrapper.addEventListener('touchend', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = this.startX - endX;

        if (diffX > 50) {
          this.nextSlide();
          this.resetAutoPlay();
        } else if (diffX < -50) {
          this.prevSlide();
          this.resetAutoPlay();
        }
      });
    }

    window.addEventListener('resize', () => {
      const prevCardsPerView = this.cardsPerView;
      this.updateCardsPerView();
      if (prevCardsPerView !== this.cardsPerView) {
        this.renderDots();
        this.updateSlider();
      }
    });
  }
}

/* ============================================================================
   6. MAIN APP ORCHESTRATOR
   ============================================================================ */
class WanderLuxApp {
  constructor() {
    this.init();
  }

  init() {
    this.initTheme();
    this.initCurrency();
    this.initHeaderScroll();
    this.initBackToTop();
    this.initMobileNav();
    this.initNewsletter();
    this.initFaqAccordion();
    this.initAOS();
    this.initFeatures();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('wanderlux_theme') || 'light';
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');

    const toggle = () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
      window.showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggle);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggle);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wanderlux_theme', theme);
    const themeIcon = document.getElementById('theme-toggle-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const iconClass = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (themeIcon) themeIcon.className = iconClass;
    if (mobileThemeIcon) mobileThemeIcon.className = iconClass;
  }

  initCurrency() {
    const savedCurrency = localStorage.getItem('wanderlux_currency') || 'USD';
    window.currentCurrency = savedCurrency;

    const currencySelect = document.getElementById('currency-select');
    const mobileCurrencySelect = document.getElementById('mobile-currency-select');

    if (currencySelect) {
      currencySelect.value = savedCurrency;
      currencySelect.addEventListener('change', (e) => {
        this.changeCurrency(e.target.value);
      });
    }

    if (mobileCurrencySelect) {
      mobileCurrencySelect.value = savedCurrency;
      mobileCurrencySelect.addEventListener('change', (e) => {
        this.changeCurrency(e.target.value);
      });
    }

    window.formatCurrency = (amountUSD) => {
      const curConfig = TRAVEL_DATA.currencies[window.currentCurrency] || TRAVEL_DATA.currencies.USD;
      const converted = Math.round(amountUSD * curConfig.rate);
      return `${curConfig.symbol}${converted.toLocaleString()}`;
    };
  }

  changeCurrency(currencyCode) {
    if (!TRAVEL_DATA.currencies[currencyCode]) return;
    window.currentCurrency = currencyCode;
    localStorage.setItem('wanderlux_currency', currencyCode);

    const currencySelect = document.getElementById('currency-select');
    const mobileCurrencySelect = document.getElementById('mobile-currency-select');
    if (currencySelect) currencySelect.value = currencyCode;
    if (mobileCurrencySelect) mobileCurrencySelect.value = currencyCode;

    if (window.searchManager) {
      window.searchManager.renderDestinations();
      window.searchManager.renderHotels();
      
      const priceSlider = document.getElementById('filter-price-slider');
      const priceValDisplay = document.getElementById('filter-price-value');
      if (priceSlider && priceValDisplay) {
        priceValDisplay.textContent = window.formatCurrency(Number(priceSlider.value));
      }
    }

    if (window.bookingCalcManager) {
      window.bookingCalcManager.recalculateAll();
      window.bookingCalcManager.renderRoomTiers();
      window.bookingCalcManager.renderAddons();
    }

    if (window.wishlistManager) {
      window.wishlistManager.renderDrawerItems();
    }

    window.showToast(`Currency changed to ${currencyCode}`, 'info');
  }

  initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const progressPath = document.getElementById('back-to-top-progress');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }

      if (progressPath) {
        const circumference = 2 * Math.PI * 18;
        progressPath.style.strokeDashoffset = circumference - (scrollPercent * circumference);
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !mobileDrawer) return;

    const openMenu = () => {
      mobileDrawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      toggleBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const emailInput = document.getElementById('newsletter-email');
    const submitBtn = document.getElementById('newsletter-submit-btn');
    const msgEl = document.getElementById('newsletter-feedback');

    const isSubscribed = localStorage.getItem('wanderlux_subscribed');
    if (isSubscribed && msgEl) {
      msgEl.innerHTML = `<span class="feedback-success"><i class="fa-solid fa-circle-check"></i> You are subscribed! Use promo code <strong>WELCOME15</strong> for 15% off.</span>`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        if (msgEl) {
          msgEl.innerHTML = `<span class="feedback-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address.</span>`;
        }
        window.showToast('Please enter a valid email address.', 'warning');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...`;

      setTimeout(() => {
        localStorage.setItem('wanderlux_subscribed', 'true');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Subscribed!`;
        submitBtn.classList.add('btn-success');

        if (msgEl) {
          msgEl.innerHTML = `
            <span class="feedback-success">
              🎉 <strong>Welcome aboard!</strong> Use exclusive code <strong>WELCOME15</strong> for 15% off your next booking.
            </span>
          `;
        }

        window.showToast('🎉 You are subscribed! Exclusive coupon code: WELCOME15', 'success');
        emailInput.value = '';

        if (window.bookingCalcManager) {
          window.bookingCalcManager.applyCouponCode('WELCOME15');
        }
      }, 800);
    });
  }

  initFaqAccordion() {
    const container = document.getElementById('faq-accordion-container');
    if (!container) return;

    container.innerHTML = TRAVEL_DATA.faqs.map((faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'active' : ''}">
        <button class="faq-question-btn" aria-expanded="${idx === 0}">
          <span>${faq.question}</span>
          <i class="fa-solid fa-chevron-down faq-chevron"></i>
        </button>
        <div class="faq-answer-panel" style="${idx === 0 ? 'max-height: 200px;' : 'max-height: 0;'}">
          <p>${faq.answer}</p>
        </div>
      </div>
    `).join('');

    const questionButtons = container.querySelectorAll('.faq-question-btn');
    questionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const panel = item.querySelector('.faq-answer-panel');
        const isActive = item.classList.contains('active');

        container.querySelectorAll('.faq-item').forEach(other => {
          other.classList.remove('active');
          const otherPanel = other.querySelector('.faq-answer-panel');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherPanel) otherPanel.style.maxHeight = '0';
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          panel.style.maxHeight = `${panel.scrollHeight + 30}px`;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  initFeatures() {
    const container = document.getElementById('features-grid');
    if (!container) return;

    container.innerHTML = TRAVEL_DATA.features.map((feat, idx) => `
      <div class="feature-card" data-aos="fade-up" data-aos-delay="${idx * 80}">
        <div class="feature-icon-box">
          <i class="${feat.icon}"></i>
        </div>
        <span class="feature-highlight">${feat.highlight}</span>
        <h3 class="feature-title">${feat.title}</h3>
        <p class="feature-desc">${feat.description}</p>
      </div>
    `).join('');
  }

  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
      });
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
      });
    }
  }
}

/* ============================================================================
   7. GLOBAL UTILITY FUNCTIONS (Coupons, Modals & Toast Alerts)
   ============================================================================ */
window.showToast = function(message, type = 'info', duration = 3500) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    info: 'fa-circle-info',
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark'
  };

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icons[type] || icons.info}"></i></div>
    <div class="toast-message">${message}</div>
    <button class="toast-close-btn" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const removeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  };

  const timer = setTimeout(removeToast, duration);

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });
  }
};

window.copyCouponCode = function(code, btn) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      handleCopySuccess(code, btn);
    }).catch(() => {
      fallbackCopy(code, btn);
    });
  } else {
    fallbackCopy(code, btn);
  }
};

function fallbackCopy(code, btn) {
  const textarea = document.createElement('textarea');
  textarea.value = code;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    handleCopySuccess(code, btn);
  } catch (err) {
    window.showToast('Please copy manually: ' + code, 'warning');
  }
  document.body.removeChild(textarea);
}

function handleCopySuccess(code, btn) {
  if (btn) {
    const origHTML = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.classList.remove('copied');
    }, 2500);
  }

  if (window.bookingCalcManager) {
    window.bookingCalcManager.applyCouponCode(code);
  } else {
    window.showToast(`Coupon "${code}" copied to clipboard! 🎉`, 'success');
  }
}

window.openBookingModal = function(hotelId) {
  if (window.bookingCalcManager) {
    window.bookingCalcManager.openBookingModal(hotelId);
  }
};

/* ============================================================================
   8. UNIFIED INITIALIZATION ON DOM READY
   ============================================================================ */
let wishlistManager;
let searchManager;
let bookingCalcManager;
let testimonialSlider;
let wanderLuxApp;

document.addEventListener('DOMContentLoaded', () => {
  wanderLuxApp = new WanderLuxApp();
  window.wanderLuxApp = wanderLuxApp;

  wishlistManager = new WishlistManager();
  window.wishlistManager = wishlistManager;

  searchManager = new SearchAndFilterManager();
  window.searchManager = searchManager;

  bookingCalcManager = new BookingCalculatorManager();
  window.bookingCalcManager = bookingCalcManager;

  testimonialSlider = new TestimonialSlider();
  window.testimonialSlider = testimonialSlider;
});

} // End of Browser Environment block
