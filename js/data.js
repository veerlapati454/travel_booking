// Sample data (no API required)
const destinations = [
  { id:"goa", photo:"photo-1560179406-1c6c60e0dc76", name:"Goa", country:"India", tag:"Beaches", from:3200, g:["#00c2b8","#0a5c8a"] },
  { id:"manali", photo:"photo-1712388430474-ace0c16051e2", name:"Manali", country:"India", tag:"Mountains", from:2800, g:["#7b9cff","#1d2b64"] },
  { id:"jaipur", photo:"photo-1599661046289-e31897846e41", name:"Jaipur", country:"India", tag:"Heritage", from:3500, g:["#ffb347","#c2185b"] },
  { id:"kerala", photo:"photo-1602216056096-3b40cc0c9944", name:"Kerala", country:"India", tag:"Backwaters", from:4000, g:["#43e97b","#0b6e4f"] },
  { id:"bali", photo:"photo-1711609110590-5ad5c4599e56", name:"Bali", country:"Indonesia", tag:"Islands", from:6500, g:["#f7797d","#7b2ff7"] },
  { id:"dubai", photo:"photo-1512453979798-5ea266f8880c", name:"Dubai", country:"UAE", tag:"City", from:9000, g:["#f6d365","#fd6585"] }
];
const hotels = [
  { id:1, photo:"photo-1614082242765-7c98ca0f3df3", name:"Azure Sands Resort", dest:"goa", price:7800, rating:4.7, reviews:812, amenities:["Beachfront","Pool","Spa"], g:["#00c2b8","#0a5c8a"] },
  { id:2, photo:"photo-1582972236019-ea4af5ffe587", name:"Palm Grove Villas", dest:"goa", price:4500, rating:4.3, reviews:410, amenities:["Breakfast","Wi‑Fi","Garden"], g:["#43e97b","#0b6e4f"] },
  { id:3, photo:"photo-1597167231350-d057a45dc868", name:"Snowline Lodge", dest:"manali", price:3600, rating:4.5, reviews:529, amenities:["Heater","Mountain view","Cafe"], g:["#7b9cff","#1d2b64"] },
  { id:4, photo:"photo-1609920658906-8223bd289001", name:"Pine & Peak Retreat", dest:"manali", price:6200, rating:4.8, reviews:301, amenities:["Fireplace","Spa","Trek desk"], g:["#a8c0ff","#3f2b96"] },
  { id:5, photo:"photo-1661924326425-c14a6426d989", name:"Amber Fort Haveli", dest:"jaipur", price:9500, rating:4.9, reviews:1020, amenities:["Heritage","Pool","Fine dining"], g:["#ffb347","#c2185b"] },
  { id:6, photo:"photo-1602643163983-ed0babc39797", name:"Pink City Boutique", dest:"jaipur", price:3900, rating:4.1, reviews:268, amenities:["Rooftop","Wi‑Fi","Breakfast"], g:["#f093fb","#f5576c"] },
  { id:7, photo:"photo-1593693411515-c20261bcad6e", name:"Backwater Bliss Houseboat", dest:"kerala", price:11500, rating:4.8, reviews:645, amenities:["Private chef","Sunset deck","AC"], g:["#43e97b","#38f9d7"] },
  { id:8, photo:"photo-1585229190075-5d94076e3c81", name:"Spice Hills Homestay", dest:"kerala", price:2400, rating:3.9, reviews:154, amenities:["Home meals","Plantation walk"], g:["#96e6a1","#0b6e4f"] },
  { id:9, photo:"photo-1759661323897-f48700499b33", name:"Uluwatu Cliff Suites", dest:"bali", price:18500, rating:4.9, reviews:933, amenities:["Infinity pool","Ocean view","Spa"], g:["#f7797d","#7b2ff7"] },
  { id:10, photo:"photo-1555400038-63f5ba517a47", name:"Ubud Jungle Hideaway", dest:"bali", price:12500, rating:4.6, reviews:477, amenities:["Yoga deck","Breakfast","Pool"], g:["#56ab2f","#134e5e"] },
  { id:11, photo:"photo-1580674684081-7617fbf3d745", name:"Marina Skyline Hotel", dest:"dubai", price:22500, rating:4.7, reviews:1210, amenities:["Sky pool","Gym","Metro link"], g:["#f6d365","#fd6585"] },
  { id:12, photo:"photo-1489493585363-d69421e0edd3", name:"Desert Oasis Camp", dest:"dubai", price:15800, rating:4.4, reviews:356, amenities:["Safari","Dinner show","Stargazing"], g:["#f7b733","#a8431c"] }
];
const offers = [
  { code:"VOYAGE20", photo:"photo-1614082242765-7c98ca0f3df3", title:"20% off your first booking", desc:"Valid on all hotels, minimum 2 nights.", tag:"New users", g:["#7b5cff","#00c2b8"] },
  { code:"BEACH500", photo:"photo-1593693411515-c20261bcad6e", title:"₹500 off beach stays", desc:"Applies to Goa, Kerala and Bali bookings.", tag:"Beach deal", g:["#00c2b8","#0a5c8a"] },
  { code:"WEEKEND15", photo:"photo-1489493585363-d69421e0edd3", title:"15% off weekend getaways", desc:"Book Friday to Sunday and save instantly.", tag:"Weekends", g:["#ff7a59","#c2185b"] },
  { code:"LONGSTAY25", photo:"photo-1555400038-63f5ba517a47", title:"25% off 5+ nights", desc:"The longer you stay, the more you save.", tag:"Long stay", g:["#ffb347","#7b2ff7"] }
];
const testimonials = [
  { name:"Aarav Mehta", city:"Mumbai", rating:5, text:"The price estimate matched the final bill to the rupee. Booking Goa took under three minutes." },
  { name:"Sneha Reddy", city:"Hyderabad", rating:5, text:"Loved filtering by rating and price. Found a perfect Manali lodge well under budget." },
  { name:"Rohan Kapoor", city:"Delhi", rating:4, text:"Great deals and the coupon worked first try. Jaipur haveli was a dream." },
  { name:"Priya Nair", city:"Kochi", rating:5, text:"My wishlist kept all options in one place so my family could decide together." },
  { name:"Karthik Iyer", city:"Chennai", rating:4, text:"Support answered at midnight when our flight changed. They sorted it quickly." },
  { name:"Meera Shah", city:"Ahmedabad", rating:5, text:"Bali trip planned in an evening. Clean design, honest photos, no surprises." }
];

// Unsplash photo helper (free to use under the Unsplash License)
const imgUrl = (photo, w = 700) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${w}&q=70`;
const HERO_PHOTO = "photo-1711609110590-5ad5c4599e56";
