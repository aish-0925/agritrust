import logo from "./assets/agritrust-logo.png";
import { motion } from "framer-motion";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Marketplace from "./pages/Marketplace";
import EditProduct from "./pages/EditProduct";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import CropAdvisoryLanding from "./pages/CropAdvisoryLanding";
import Browse from "./pages/Browse";
import SmartCropAdvisor from "./pages/SmartCropAdvisor";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

/* Animation configuration */
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};
const features = [
  { num: "01", icon: "🌾", title: "Direct Marketplace", desc: "Farmers sell directly to restaurants without middlemen, maximising earnings on every harvest.", tag: "Explore", accent: "#16a34a", iconBg: "#dcfce7", bar: "from-green-400 to-green-600" },
  { num: "02", icon: "📍", title: "GPS Delivery Tracking", desc: "Real-time location updates from farm to table. Know exactly where your produce is at every step.", tag: "Track now", accent: "#0369a1", iconBg: "#e0f2fe", bar: "from-sky-400 to-sky-600" },
  { num: "03", icon: "🔒", title: "Secure Payments", desc: "Escrow-based payment system releases funds only when delivery is confirmed — trust built in.", tag: "Learn more", accent: "#ca8a04", iconBg: "#fef9c3", bar: "from-yellow-400 to-yellow-600" },
  { num: "04", icon: "🤖", title: "AI Crop Advisory", desc: "Smart recommendations based on market demand trends, seasonality, and soil conditions.", tag: "Ask AI", accent: "#7c3aed", iconBg: "#ede9fe", bar: "from-violet-400 to-violet-600" },
  { num: "05", icon: "⛓", title: "Blockchain Governance", desc: "Immutable, tamper-proof order records written on-chain — transparency no spreadsheet can offer.", tag: "View records", accent: "#0f766e", iconBg: "#ccfbf1", bar: "from-teal-400 to-teal-600" },
  { num: "06", icon: "💬", title: "Chatbot Assistant", desc: "Ask anything about crops, orders, or deliveries — instant answers, 24/7, in your language.", tag: "Chat now", accent: "#be185d", iconBg: "#fce7f3", bar: "from-pink-400 to-pink-600" },
];
function HomePage() {
  useEffect(() => {
  const track = document.getElementById('testimonial-track');
  if (!track) return;

  let current = 0;
  const total = 4;
  const cardWidth = 336;

  const updateDots = (index) => {
    for (let i = 0; i < total; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (dot) {
        dot.style.width = i === index ? '24px' : '6px';
        dot.style.background = i === index ? '#16a34a' : '#d1d5db';
      }
    }
  };

  const interval = setInterval(() => {
    current = (current + 1) % total;
    track.scrollTo({ left: current * cardWidth, behavior: 'smooth' });
    updateDots(current);
  }, 3000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-12 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">

  {   /* Logo */}
      <div className="flex items-center gap-3 cursor-pointer">
        <img src={logo} alt="AgriTrust Logo" className="h-16 w-auto transition-transform duration-300 hover:scale-110"/>
      </div>

  {/* Navigation Links */}
 <ul className="hidden md:flex space-x-10 text-[17px] font-medium tracking-wide text-gray-700">

  <li className="relative group cursor-pointer transition duration-300">
    Home
    <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
  </li>

  <li className="relative group cursor-pointer transition duration-300">
    Marketplace
    <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
  </li>

  <li className="relative group cursor-pointer transition duration-300">
    Track Delivery
    <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
  </li>

  <li className="relative group cursor-pointer transition duration-300">
  <Link to="/crop-advisory-landing" className="block">
    Crop Advisory
  </Link>

  <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
</li>

</ul>

  {/* Login Button */}
  <Link to="/login">
          <button className="bg-green-600 text-white px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:scale-105">
            Login
          </button>
        </Link>

</nav>

      {/* Hero Section */}
<section className="relative h-[680px] w-full overflow-hidden">

  {/* Split images */}
  <div className="grid grid-cols-2 h-full">
    <div className="relative overflow-hidden">
      <img
        src="https://plus.unsplash.com/premium_photo-1678655491251-bbc237156a5c?auto=format&fit=crop&q=80&w=1200"
        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
      />
      {/* Left label */}
      <div className="absolute bottom-8 left-8">
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          From the Farm
        </span>
      </div>
    </div>

    <div className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1721637713270-5470ea1d6389?auto=format&fit=crop&q=80&w=1200"
        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
      />
      {/* Right label */}
      <div className="absolute bottom-8 right-8">
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          To the Kitchen
        </span>
      </div>
    </div>
  </div>

  {/* Balanced overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Center divider line */}
  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/15 z-10" />

  {/* Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">

    {/* Eyebrow */}
    <div className="inline-flex items-center gap-3 mb-6">
      <span className="h-px w-6 bg-green-400 block" />
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-green-400">
        Farm-to-table, reimagined
      </span>
      <span className="h-px w-6 bg-green-400 block" />
    </div>

    {/* Headline */}
    <h1
      className="text-5xl md:text-6xl font-bold leading-tight tracking-tight"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      Bridging <em className="italic text-green-400">Fields</em>
      <br />
      and Kitchens
    </h1>

    {/* Subtext */}
    <p className="mt-5 max-w-lg text-sm md:text-base text-white/75 leading-relaxed">
      Connecting farmers and chefs for a fresher future —
      buy and sell farm-fresh produce directly with no middlemen.
    </p>

    {/* CTAs */}
    <div className="mt-8 flex gap-3 flex-wrap justify-center">
      <Link to="/login">
      <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/40">
        <span>🌾</span> Sell Your Produce
      </button>
      </Link>
      <Link to="/login">
      <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white hover:text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5">
        <span>🥕</span> Find Fresh Ingredients
      </button>
      </Link>
    </div>

    

  </div>
</section>


      {/* Stats Section */}
      {/* <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-4xl font-bold text-green-600">10K+</h2>
            <p className="text-gray-600 mt-2">Farmers Connected</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-green-600">2K+</h2>
            <p className="text-gray-600 mt-2">Restaurants Served</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-green-600">50K+</h2>
            <p className="text-gray-600 mt-2">Orders Completed</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-green-600">₹5Cr+</h2>
            <p className="text-gray-600 mt-2">Trade Volume</p>
          </div>

        </div>
      </section> */}


{/* Features */}
<section className="relative bg-gray-50 py-24 overflow-hidden">
  <span
    className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-bold leading-none tracking-tighter"
    style={{ color: "rgba(22,101,52,0.04)", fontFamily: "Georgia, serif" }}
    aria-hidden
  >
    AGRI
  </span>

  <div className="relative max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="h-px w-6 bg-green-600 block" />
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-600">
          What we offer
        </span>
        <span className="h-px w-6 bg-green-600 block" />
      </div>
      <h2
        className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Built for the{" "}
        <em className="italic text-green-600" style={{ fontStyle: "italic" }}>field,</em>{" "}
        <br className="hidden md:block" />
        designed for trust
      </h2>
    </div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid md:grid-cols-3 gap-6"
    >
      {features.map((f) => (
        <motion.div
          key={f.num}
          variants={cardVariants}
          className="group relative bg-white rounded-2xl border border-gray-100 p-7 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-gray-200 hover:shadow-xl"
        >
          <span
            className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${f.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
          />
          <span
            className="absolute top-4 right-5 text-5xl font-bold leading-none select-none transition-opacity duration-300 opacity-[0.08] group-hover:opacity-[0.15]"
            style={{ color: f.accent, fontFamily: "Georgia, serif" }}
            aria-hidden
          >
            {f.num}
          </span>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: f.iconBg }}
          >
            {f.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
            {f.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          <span
            className="inline-block mt-5 text-xs font-semibold tracking-wide uppercase border-b pb-px opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ color: f.accent, borderColor: f.accent }}
          >
            {f.tag} →
          </span>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
      {/* How It Works */}
<section className="relative bg-white py-24 overflow-hidden">

  {/* Ghost watermark */}
  <span
    className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-bold leading-none tracking-tighter"
    style={{ color: "rgba(22,101,52,0.04)", fontFamily: "Georgia, serif" }}
    aria-hidden
  >
    FLOW
  </span>

  <div className="relative max-w-5xl mx-auto px-6">

    {/* Header */}
    <div className="text-center mb-20">
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="h-px w-6 bg-green-600 block" />
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-600">
          The process
        </span>
        <span className="h-px w-6 bg-green-600 block" />
      </div>
      <h2
        className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        From <em className="italic text-green-600">farm</em> to table,{" "}
        <br className="hidden md:block" />
        in three steps
      </h2>
    </div>

    {/* Steps */}
    <div className="relative grid md:grid-cols-3 gap-8">

      {/* Connector line */}
      <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gray-200 z-0" />

      {[
        {
          step: "01",
          icon: "🌱",
          title: "Farmers List Produce",
          desc: "Upload fresh produce directly to the marketplace.",
          accent: "#16a34a",
          iconBg: "#dcfce7",
          tagBg: "#dcfce7",
          tagText: "#166534",
          popupTitle: "List your harvest in minutes",
          popupDesc: "Farmers create a profile, upload produce with photos, set prices, and go live instantly — no middlemen involved.",
          popupImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=160&fit=crop",
          bullets: ["Photo & description upload", "Real-time inventory management", "AI-powered price suggestions"],
        },
        {
          step: "02",
          icon: "🛒",
          title: "Restaurants Order",
          desc: "Browse seasonal produce and place orders easily.",
          accent: "#0369a1",
          iconBg: "#e0f2fe",
          tagBg: "#e0f2fe",
          tagText: "#0c4a6e",
          popupTitle: "Browse, compare & order fresh",
          popupDesc: "Restaurants discover local farmers, filter by produce type, compare prices, and place bulk or one-time orders.",
          popupImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=160&fit=crop",
          bullets: ["Filter by region & season", "Scheduled recurring orders", "Direct chat with farmers"],
        },
        {
          step: "03",
          icon: "🚚",
          title: "Delivery & Payment",
          desc: "GPS-tracked delivery with secure escrow payment.",
          accent: "#ca8a04",
          iconBg: "#fef9c3",
          tagBg: "#fef9c3",
          tagText: "#713f12",
          popupTitle: "Track it, receive it, pay securely",
          popupDesc: "Real-time GPS tracking keeps everyone informed. Payment is held in escrow and released automatically on delivery confirmation.",
          popupImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=160&fit=crop",
          bullets: ["Live GPS map updates", "Auto escrow payment release", "Digital delivery receipt"],
        },
      ].map((s) => (
        <motion.div
          key={s.step}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="group relative z-10 flex flex-col items-center text-center"
        >
          {/* Icon bubble */}
          <div className="relative mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
              style={{ background: s.iconBg }}
            >
              {s.icon}
            </div>
            <span
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style={{ background: s.accent }}
            >
              {s.step}
            </span>
          </div>

          <h3
            className="text-base font-semibold text-gray-900 mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {s.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{s.desc}</p>

          <span
            className="mt-4 h-[2px] rounded-full transition-all duration-300 w-7 group-hover:w-14"
            style={{ background: s.accent }}
          />

          {/* Hover popup */}
          <div className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl border border-gray-200 overflow-hidden opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 shadow-xl">

            <img
              src={s.popupImage}
              alt={s.title}
              className="w-full h-32 object-cover"
            />

            <div className="p-4">
              <span
                className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-md mb-2"
                style={{ background: s.tagBg, color: s.tagText }}
              >
                Step {s.step}
              </span>
              <p
                className="text-sm font-semibold text-gray-900 mb-2 leading-snug"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {s.popupTitle}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.popupDesc}</p>
              <ul className="space-y-1">
                {s.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: s.accent }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow */}
            <div
              className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-gray-200 rotate-45"
            />
          </div>

        </motion.div>
      ))}
    </div>
  </div>
</section>
      {/* Testimonials */}
<section className="relative bg-gray-50 py-24 overflow-hidden">

  {/* Ghost watermark */}
  <span
    className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-bold leading-none tracking-tighter"
    style={{ color: "rgba(22,101,52,0.04)", fontFamily: "Georgia, serif" }}
    aria-hidden
  >
    TRUST
  </span>

  <div className="relative max-w-6xl mx-auto px-6">

    {/* Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-3 mb-4">
        <span className="h-px w-6 bg-green-600 block" />
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-600">
          Testimonials
        </span>
        <span className="h-px w-6 bg-green-600 block" />
      </div>
      <h2
        className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Trusted by <em className="italic text-green-600">farmers</em>{" "}
        <br className="hidden md:block" />
        and restaurants alike
      </h2>
    </div>

    {/* Scroll track */}
    <div className="relative">

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 to-transparent" />

      <div
        id="testimonial-track"
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[
          {
            quote: "AgriTrust completely changed how we source ingredients. Fresh vegetables arrive directly from farmers — the quality is unmatched.",
            name: "Chef Rahul Sharma",
            role: "Head Chef, The Green Table",
            image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=80&h=80&fit=crop",
            accent: "#16a34a",
            iconBg: "#dcfce7",
          },
          {
            quote: "Now I sell my produce without middlemen. My profits have doubled and I have direct relationships with restaurant owners.",
            name: "Farmer Ramesh Patil",
            role: "Organic Farmer, Pune",
            image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=80&h=80&fit=crop",
            accent: "#0369a1",
            iconBg: "#e0f2fe",
          },
          {
            quote: "The GPS tracking feature gives us peace of mind. We always know exactly when our produce will arrive — no more uncertainty.",
            name: "Priya Menon",
            role: "Operations Manager, Spice Route",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop",
            accent: "#7c3aed",
            iconBg: "#ede9fe",
          },
          {
            quote: "The escrow payment system means I always get paid fairly. AgriTrust has made farming a viable and trustworthy business for me.",
            name: "Suresh Kumar",
            role: "Vegetable Farmer, Karnataka",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop",
            accent: "#ca8a04",
            iconBg: "#fef9c3",
          },
        ].map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-100 p-7 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            {/* Top accent bar */}
            <span
              className="block h-[3px] rounded-full w-8 mb-6 transition-all duration-300 group-hover:w-16"
              style={{ background: t.accent }}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill={t.accent}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <p
              className="text-sm text-gray-600 leading-relaxed flex-1 mb-6"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover"
                style={{ border: `2px solid ${t.iconBg}` }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Dot indicators */}
    <div id="testimonial-dots" className="flex justify-center gap-2 mt-8">
      {[0,1,2,3].map((i) => (
        <button
          key={i}
          onClick={() => {
            const track = document.getElementById('testimonial-track');
            track.scrollTo({ left: i * 336, behavior: 'smooth' });
          }}
          className="h-1.5 rounded-full transition-all duration-300 bg-gray-300"
          style={{ width: i === 0 ? '24px' : '6px' }}
          id={`dot-${i}`}
        />
      ))}
    </div>

  </div>

  {/* Auto-scroll script */}
  <style>{`#testimonial-track::-webkit-scrollbar { display: none; }`}</style>
</section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16 text-center text-white">

        <h2 className="text-4xl font-bold">
          Join the Future of Farm-to-Restaurant Trade
        </h2>

        <p className="mt-4">
          Start buying or selling fresh produce today.
        </p>
      <Link to="/login">
        <button className="mt-8 bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </Link>
      </section>


      {/* Footer */}
<footer className="relative bg-gray-900 text-white overflow-hidden">

  {/* Ghost watermark */}
  <span
    className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-bold leading-none tracking-tighter"
    style={{ color: "rgba(255,255,255,0.03)", fontFamily: "Georgia, serif" }}
    aria-hidden
  >
    AGRI
  </span>

  <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8">

    {/* Top grid */}
    <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

      {/* Brand */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌿</span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            AgriTrust
          </span>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Connecting farmers and restaurants with full transparency —
          no middlemen, no surprises, just fresh produce and fair prices.
        </p>

        {/* Social icons */}
        <div className="flex gap-3 mt-6">

          {[
            {
              label: "Twitter",
              path: "M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2-4.52 4.48 0 .35.04.7.11 1.03C7.69 5.3 4.07 3.55 1.64.92a4.49 4.49 0 0 0-.61 2.25c0 1.56.8 2.93 2 3.73a4.48 4.48 0 0 1-2.05-.56v.06c0 2.18 1.55 4 3.6 4.41a4.52 4.52 0 0 1-2.04.08c.57 1.8 2.24 3.1 4.2 3.13A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.85l-.01-.58A9.17 9.17 0 0 0 22 5.92a8.99 8.99 0 0 1-2.6.71A4.51 4.51 0 0 0 21.34.5 9.02 9.02 0 0 1 18.5 1.6 4.52 4.52 0 0 0 15.25 0"
            },
            {
              label: "Instagram",
              path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"
            },
            {
              label: "LinkedIn",
              path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
            },
          ].map((s) => (
            <a
              key={s.label}
              href="#"
              aria-label={s.label}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600/20 hover:border-green-500/40 hover:scale-110 transition-all duration-200"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <path d={s.path} />
              </svg>
            </a>
          ))}

        </div>
      </div>

      {/* Platform */}
      <div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-green-500 mb-5">
          Platform
        </p>

        <ul className="space-y-3">
          {["Marketplace", "Track Delivery", "Crop Advisory", "Secure Payments"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-green-500 mb-5">
          Company
        </p>

        <ul className="space-y-3">
          {["About Us", "Blog", "Careers", "Contact"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* Bottom */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">

      <p className="text-xs text-gray-500">
        © 2026 AgriTrust. All rights reserved.
      </p>

      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-gray-500">
          All systems operational
        </span>
      </div>

      <div className="flex gap-6">
        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            {item}
          </a>
        ))}
      </div>

    </div>

  </div>
</footer>


    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* Public Routes */}

          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FarmerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Marketplace />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddProduct />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Marketplace />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/products/edit/:id" element={<EditProduct />} />

          <Route
              path="/restaurant/dashboard"
              element={
                <ProtectedRoute role="restaurant">
                  <DashboardLayout>
                    <RestaurantDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* <Route path="/advisory" element={<AdvisoryLanding />} /> */}
            <Route path="/crop-advisory-landing" element={<CropAdvisoryLanding />} />

                      <Route
            path="/advisory"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SmartCropAdvisor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

                      <Route
            path="/restaurant/browse"
            element={
              <ProtectedRoute role="restaurant">
                <DashboardLayout>
                  <Browse />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
  path="/restaurant/cart"
  element={
    <ProtectedRoute role="restaurant">
      <DashboardLayout>
        <Cart />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/restaurant/checkout"
  element={
    <ProtectedRoute role="restaurant">
      <DashboardLayout>
        <Checkout />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

        </Routes>

      </Router>

    </AuthProvider>

  );

}
export default App;