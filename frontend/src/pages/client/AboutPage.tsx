import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import { Clock, Mail, Phone, Gavel, Award, Globe, ChevronDown, ChevronUp, Play, Pause, Quote, ArrowRight, ChevronLeft, ChevronRight, TrendingUp, Repeat, Sparkles, Gem, Palette, Brush } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { artworks, formatCurrency, formatTimeRemaining } from "@/data/artworks";
import { Link } from "react-router-dom";
import AuctionButton from "@/components/AuctionButton";
import AuctionProcess from "@/components/AuctionProcess";
import { Instagram, Facebook, Twitter, } from "lucide-react";


const AboutPage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredSpecialist, setHoveredSpecialist] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);

  // Filter featured artworks
  const featuredArtworks = artworks.filter(artwork => artwork.featured);
  
  // Get 6 artworks for the cube
  const cubeArtworks = React.useMemo(() => {
    const featured = artworks.filter(artwork => artwork.featured);
    return featured.length >= 6 
      ? featured.slice(0, 6) 
      : [...featured, ...artworks.slice(0, 6 - featured.length)];
  }, []);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const platformRef = useRef(null);
  const statsRef = useRef(null);
  const artworksRef = useRef(null);
  const processRef = useRef(null);
  const teamRef = useRef(null);
  const successRef = useRef(null);
  const contactRef = useRef(null);

  // Animation controls
  const heroControls = useAnimation();
  const platformControls = useAnimation();
  const statsControls = useAnimation();
  const artworksControls = useAnimation();
  const processControls = useAnimation();
  const teamControls = useAnimation();
  const successControls = useAnimation();
  const contactControls = useAnimation();

  // Set up inView triggers
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.5 });
  const isPlatformInView = useInView(platformRef, { once: true, amount: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const isArtworksInView = useInView(artworksRef, { once: true, amount: 0.3 });
  const isProcessInView = useInView(processRef, { once: true, amount: 0.3 });
  const isTeamInView = useInView(teamRef, { once: true, amount: 0.3 });
  const isSuccessInView = useInView(successRef, { once: true, amount: 0.3 });
  const isContactInView = useInView(contactRef, { once: true, amount: 0.3 });

  // Trigger animations when elements come into view
  useEffect(() => {
    if (isHeroInView) heroControls.start("visible");
    if (isPlatformInView) platformControls.start("visible");
    if (isStatsInView) statsControls.start("visible");
    if (isArtworksInView) artworksControls.start("visible");
    if (isProcessInView) processControls.start("visible");
    if (isTeamInView) teamControls.start("visible");
    if (isSuccessInView) successControls.start("visible");
    if (isContactInView) contactControls.start("visible");
  }, [
    isHeroInView, isPlatformInView, isStatsInView, isArtworksInView, 
    isProcessInView, isTeamInView, isSuccessInView, isContactInView,
    heroControls, platformControls, statsControls, artworksControls,
    processControls, teamControls, successControls, contactControls
  ]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate featured artworks
  useEffect(() => {
    const artworkInterval = setInterval(() => {
      setCurrentArtworkIndex((prev) => (prev + 1) % featuredArtworks.length);
    }, 4000);
    return () => clearInterval(artworkInterval);
  }, [featuredArtworks.length]);

  // Animated counters for stats
  useEffect(() => {
    const targetValues = [850, 42, 28, 96];
    const duration = 2000;
    const startTime = Date.now();
    
    const easeOutQuad = (t: number) => t * (2 - t);
    
    const animateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      
      const newCounters = targetValues.map((target, index) => {
        if (index === 3) {
          return Math.floor(easedProgress * target);
        } else {
          const increment = target / 20;
          return Math.floor(easedProgress * target / increment) * increment;
        }
      });
      
      setCounters(newCounters);
      
      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };
    
    animateCounters();
  }, []);

  const handleTestimonialNavigation = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTestimonial(index);
      setIsTransitioning(false);
    }, 500);
  };

  const teamMembers = [
    {
      name: "Maria Santos",
      title: "Artist Relations Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      expertise: "Artist Development",
      years: "3 years with us",
      achievements: [
        "Curated 200+ successful auctions",
        "Artist mentorship program founder",
        "International exhibition coordinator"
      ]
    },
    {
      name: "Juan Dela Cruz",
      title: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      expertise: "Platform Innovation",
      years: "4 years with us",
      achievements: [
        "Built real-time bidding system",
        "AI-powered art valuation",
        "Blockchain authentication"
      ]
    },
    {
      name: "Sofia Reyes",
      title: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      expertise: "Visionary Leadership",
      years: "4 years with us",
      achievements: [
        "Established global collector network",
        "Pioneered digital art auctions",
        "Featured in Forbes 30 Under 30"
      ]
    },
    {
      name: "James Tan",
      title: "Marketing Director",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      expertise: "Brand Strategy",
      years: "3 years with us",
      achievements: [
        "500% audience growth",
        "Viral auction campaigns",
        "Celebrity art partnerships"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Andrea Lopez",
      title: "Visual Artist",
      quote: "This platform transformed my career. My first auction exceeded expectations by 300%, and now international collectors compete for my work. The team's expertise in positioning emerging artists is unparalleled.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      medium: "Oil paintings",
      location: "Manila, Philippines",
      result: "₱420,000 final bid",
      increase: "320% over reserve"
    },
    {
      name: "Carlos Hernandez",
      title: "Digital Artist",
      quote: "As a digital creator, I doubted my work could command serious bids. The auction format proved me wrong - my NFT collection sold for ₱780,000, with bidding wars between collectors from 5 countries.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      medium: "Digital art",
      location: "Cebu, Philippines",
      result: "₱780,000 final bid",
      increase: "490% over reserve"
    },
    {
      name: "Ling Zhang",
      title: "Art Collector",
      quote: "I've acquired 14 pieces through these auctions. The competitive environment surfaces extraordinary talent, and the authentication process gives me confidence in every acquisition. My collection has appreciated 200% thanks to discoveries here.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      medium: "Collects various media",
      location: "Hong Kong",
      result: "14 artworks collected",
      increase: "200% appreciation"
    }
  ];

  const SectionDivider = ({ variant = "default", sectionBg = "white" }) => {
    const variants = {
      default: (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gallery-beige/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className={`px-4 ${sectionBg === 'white' ? 'bg-white' : 'bg-gallery-beige/30'} rounded-full`}>
              <Brush className="h-5 w-5 text-gallery-accent p-0.5 bg-gallery-accent/10 rounded-full" />
            </span>
          </div>
        </div>
      ),
      wavy: (
        <div className="relative py-6 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-8"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".35"
              className="fill-current text-gallery-beige/50"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-current text-gallery-beige/50"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current text-gallery-beige/50"
            ></path>
          </svg>
          <div className="relative flex justify-center">
            <span className={`px-4 ${sectionBg === 'white' ? 'bg-white' : 'bg-gallery-beige/30'} rounded-full`}>
              <Palette className="h-5 w-5 text-gallery-accent p-0.5 bg-gallery-accent/10 rounded-full" />
            </span>
          </div>
        </div>
      ),
      dots: (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t-2 border-dashed border-gallery-beige/50"></div>
          </div>
          <div className="relative flex justify-center">
            <div className={`flex space-x-2 ${sectionBg === 'white' ? 'bg-white' : 'bg-gallery-beige/30'} px-4 py-0.5 rounded-full`}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gallery-accent/50"></div>
              ))}
            </div>
          </div>
        </div>
      ),
      brush: (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gallery-accent/50 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className={`${sectionBg === 'white' ? 'bg-white' : 'bg-gallery-beige/30'} px-4 rounded-full`}>
              <svg
                className="h-5 w-5 text-gallery-accent p-0.5 bg-gallery-accent/10 rounded-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
          </div>
        </div>
      )
    };

    return variants[variant] || variants.default;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gallery-text">
      <Navbar />

      {/* HERO SECTION */}
      <motion.div 
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={fadeIn}
        className="relative h-screen max-h-[800px] overflow-hidden bg-[#e9e3dd] flex items-center justify-between px-6 md:px-12 lg:px-20"
      >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gallery-accent/10 rounded-full filter blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-gallery-accent/5 rounded-full filter blur-xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* 3D Artwork Cube - Left Side */}
      <div className="w-1/2 h-full flex items-center justify-center z-10">
        <div className="cube-container w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] perspective-800">
          <div className="cube relative w-full h-full transform-style-preserve-3d animate-rotate-cube">
            {/* Front Face */}
            <div className="face front absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[0].image}
                alt={cubeArtworks[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[0].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[0].artist}</p>
              </div>
            </div>
            
            {/* Back Face */}
            <div className="face back absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[1].image}
                alt={cubeArtworks[1].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[1].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[1].artist}</p>
              </div>
            </div>
            
            {/* Right Face */}
            <div className="face right absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[2].image}
                alt={cubeArtworks[2].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[2].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[2].artist}</p>
              </div>
            </div>
            
            {/* Left Face */}
            <div className="face left absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[3].image}
                alt={cubeArtworks[3].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[3].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[3].artist}</p>
              </div>
            </div>
            
            {/* Top Face */}
            <div className="face top absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[4].image}
                alt={cubeArtworks[4].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[4].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[4].artist}</p>
              </div>
            </div>
            
            {/* Bottom Face */}
            <div className="face bottom absolute w-full h-full overflow-hidden">
              <img
                src={cubeArtworks[5].image}
                alt={cubeArtworks[5].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-sm sm:text-base">{cubeArtworks[5].title}</h3>
                <p className="text-white/80 text-xs sm:text-sm">{cubeArtworks[5].artist}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Content - Right Side */}
      <div className="w-1/2 h-full flex flex-col items-start justify-center pl-8 z-10">
        <motion.h1 
          variants={fadeIn}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif tracking-tight text-gray-900"
        >
          WHERE <span className="text-gallery-accent">MASTERPIECE</span> FINDS ITS{' '}
          <span className="relative">
            HOME
            <Sparkles className="absolute -top-3 -right-5 text-gallery-accent animate-pulse" size={20} />
          </span>
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-lg md:text-xl max-w-lg font-light text-gray-700 mb-8 leading-relaxed"
        >
          The world's most <span className="font-medium text-gray-900">prestigious</span> auction platform connecting visionary artists with discerning collectors
        </motion.p>
        
        <motion.div variants={fadeIn} className="pointer-events-auto">
          <AuctionButton />
        </motion.div>
      </div>

      {/* Cube animation styles */}
      <style>
        {`
          .perspective-800 {
            perspective: 800px;
          }
          .transform-style-preserve-3d {
            transform-style: preserve-3d;
          }
          .animate-rotate-cube {
            animation: rotate-cube 15s infinite linear;
          }
          .face {
            position: absolute;
            width: 100%;
            height: 100%;
            background: transparent;
            opacity: 0.9;
            border: 2px solid;
            border-image: linear-gradient(
              90deg,
              rgba(244, 162, 97, 0.8) 0%,
              rgba(244, 162, 97, 0.6) 50%,
              rgba(244, 162, 97, 0.8) 100%
            );
            box-shadow: 0 0 50px rgba(244, 162, 97, 0.4);
          }
          .front {
            transform: translateZ(150px);
          }
          .back {
            transform: rotateY(180deg) translateZ(150px);
          }
          .right {
            transform: rotateY(90deg) translateZ(150px);
          }
          .left {
            transform: rotateY(-90deg) translateZ(150px);
          }
          .top {
            transform: rotateX(90deg) translateZ(150px);
          }
          .bottom {
            transform: rotateX(-90deg) translateZ(150px);
          }
          .cube-container:hover .cube {
            animation-play-state: paused;
          }
          @keyframes rotate-cube {
            0% {
              transform: rotateX(0) rotateY(0) rotateZ(0);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
            }
          }
        `}
      </style>
    </motion.div>

      <SectionDivider variant="wavy" sectionBg="gallery-beige" />

      {/* Our Platform Section */}
      <motion.div 
        ref={platformRef}
        initial="hidden"
        animate={platformControls}
        variants={fadeIn}
        className="relative py-12 bg-white overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-gallery-accent/10 blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 -right-20 w-60 h-60 rounded-full bg-gallery-accent/5 blur-xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gallery-accent/20 blur-lg animate-pulse-slow animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div 
            variants={fadeIn}
            className="mb-12 text-center"
          >
            <h2 className="text-base font-medium text-gallery-accent mb-1 tracking-widest">OUR MISSION</h2>
            <div className="relative inline-block mb-6 group">
              <h3 className="text-3xl md:text-4xl font-medium relative z-10 group-hover:text-gallery-accent transition-colors duration-300">
                <span className="text-gallery-accent font-bold">REVOLUTIONIZING</span> ART COMMERCE
              </h3>
              <div className="absolute -bottom-1 left-0 w-3/4 h-1 bg-gradient-to-r from-gallery-accent to-transparent z-0 group-hover:w-full transition-all duration-500"></div>
            </div>
            <p className="text-lg text-center text-gallery-text/70 max-w-2xl mx-auto">
              Creating a fair, transparent marketplace for artists and collectors
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-10 items-center"
          >
            <motion.div variants={slideInFromLeft} className="lg:w-1/2 relative">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-xl relative group">
                <img
                  src="https://static01.nyt.com/images/2021/05/12/arts/12auctions-sothebys-nina-4/merlin_187675863_2ea4fde6-7eaf-4f44-90ef-35633d607c97-superJumbo.jpg"
                  alt="Artist uploading artwork"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gallery-accent flex items-center justify-center shadow-xl transform hover:rotate-12 transition-all duration-300">
                  <span className="text-white text-2xl font-bold font-serif">2020</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md transform hover:-rotate-12 transition-all duration-300">
                  <Palette className="text-gallery-accent" size={24} />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={slideInFromRight} className="lg:w-1/2">
              <div className="space-y-4">
                <p className="text-gallery-text/80 leading-relaxed text-base border-l-2 border-gallery-accent pl-3 hover:border-gallery-accent-dark transition-colors duration-300">
                  Our <span className="font-semibold text-gallery-accent">exclusive auction platform</span> was designed to create a fair, transparent marketplace where artists receive proper 
                  value for their work and collectors discover exceptional pieces. The competitive bidding process ensures 
                  market-driven pricing that often exceeds expectations.
                </p>
                
                <div className="p-4 bg-gradient-to-br from-gallery-beige/20 to-gallery-accent/10 rounded-lg border border-gallery-beige/50 hover:bg-gallery-beige/30 transition-colors duration-300 shadow-md hover:shadow-lg">
                  <div className="flex items-start">
                    <Gavel className="text-gallery-accent mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gallery-text/80 leading-relaxed italic text-sm">
                        "Traditional galleries often dictate prices. Our auction system lets the global market decide, resulting in 
                        fairer valuations and <span className="font-semibold">exciting opportunities</span> for both artists and collectors."
                      </p>
                      <p className="mt-2 text-xs text-gallery-accent font-medium">
                        — Our Auction Philosophy
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-base font-medium mb-3 text-gallery-accent hover:underline transition-all duration-300 flex items-center">
                    <Brush className="mr-2" size={16} /> Premium Auction Features
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { feature: "Transparent bidding", description: "Real-time updates on all bids", icon: "👁️" },
                      { feature: "Reserve prices", description: "Protect your minimum value", icon: "🛡️" },
                      { feature: "Timed auctions", description: "Flexible closing times", icon: "⏳" },
                      { feature: "Global reach", description: "Bidders from 50+ countries", icon: "🌎" }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        variants={fadeIn}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-colors duration-300 shadow-sm hover:shadow border border-gray-100"
                      >
                        <div className="flex items-center mb-1">
                          <span className="text-lg mr-1">{item.icon}</span>
                          <div className="text-gallery-accent font-bold hover:text-gallery-accent-dark transition-colors duration-300 text-sm">{item.feature}</div>
                        </div>
                        <div className="text-xs text-gallery-text/80 pl-5">{item.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <SectionDivider variant="dots" />

      {/* Enhanced Stats Section */}
      <motion.div 
        ref={statsRef}
        initial="hidden"
        animate={statsControls}
        variants={fadeIn}
        className="py-5 bg-gradient-to-br from-gallery-beige/30 to-gallery-accent/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,162,97,0.05)_0%,_transparent_70%)]"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-gallery-accent/10 blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-gallery-accent/5 blur-xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-base font-medium text-gallery-accent mb-1 tracking-widest">BY THE NUMBERS</h2>
            <h3 className="text-3xl md:text-4xl font-medium mb-4 font-serif relative inline-block">
              <span className="relative z-10">Our Auction Impact</span>
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gallery-accent/30 z-0"></span>
            </h3>
            <p className="text-lg text-center text-gallery-text/70 max-w-2xl mx-auto">
              Quantifying our transformative effect on art sales through our premium auction platform
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { 
                value: counters[0], 
                suffix: "M+", 
                label: "Artist Earnings", 
                description: "Generated through our auctions",
                icon: "💰"
              },
              { 
                value: counters[1], 
                suffix: "", 
                label: "Countries", 
                description: "With active collectors bidding",
                icon: "🌍"
              },
              { 
                value: counters[2], 
                suffix: "K+", 
                label: "Artworks Sold", 
                description: "Through successful auctions",
                icon: "🖼️"
              },
              { 
                value: counters[3], 
                suffix: "%", 
                label: "Sell-Through", 
                description: "Rate of auction listings",
                icon: "📈"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={scaleUp}
                className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-white hover:border-gallery-accent/20 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gallery-beige/30 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="flex items-end mb-3">
                    <span className="text-4xl md:text-5xl font-bold text-gallery-accent">
                      {stat.value}
                    </span>
                    <span className="text-2xl font-bold text-gallery-accent ml-1">
                      {stat.suffix}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-1 group-hover:text-gallery-accent transition-colors duration-300">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-gallery-text/70">
                    {stat.description}
                  </p>
                </div>
                
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 border border-transparent group-hover:border-gallery-accent/30 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_20%,#f4a26180_25%,transparent_30%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-12 text-center"
          >
            <Link to="/auctions">
  <button className="inline-flex items-center justify-center bg-gradient-to-r from-gallery-accent to-gallery-accent-dark text-white px-8 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group text-sm">
    <span className="mr-2 text-base font-medium">Start Your Auction Journey</span>
    <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} />
  </button>
</Link>
          </motion.div>
        </div>
      </motion.div>

      <SectionDivider variant="brush" sectionBg="gallery-beige/30" />

      {/* Featured Artworks Section */}
      <motion.div 
        ref={artworksRef}
        initial="hidden"
        animate={artworksControls}
        variants={fadeIn}
        className="py-12 bg-white relative overflow-hidden"
      >
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')] opacity-10"></div>
  <div className="container mx-auto px-4 max-w-6xl relative z-10">
    <motion.div 
      variants={fadeIn}
      className="text-center mb-12"
    >
      <h2 className="text-base font-medium text-gallery-accent mb-1 tracking-widest">CURRENTLY FEATURED</h2>
      <h3 className="text-3xl md:text-4xl font-medium mb-4 font-serif relative inline-block">
        <span className="relative z-10">Masterpieces in Auction</span>
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gallery-accent/30 z-0"></span>
      </h3>
      <p className="text-lg text-center text-gallery-text/70 max-w-2xl mx-auto">
        Extraordinary artworks currently available through our exclusive auctions
      </p>
    </motion.div>

    <div className="relative h-[500px] max-w-4xl mx-auto">
      {/* Carousel Container */}
      <motion.div 
        className="relative h-full w-full rounded-xl overflow-hidden shadow-lg"
        variants={scaleUp}
      >
        {featuredArtworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            className={`absolute inset-0 ${currentArtworkIndex === index ? 'z-10' : 'z-0'}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentArtworkIndex === index ? 1 : 0,
              transition: { duration: 0.5 }
            }}
          >
            <div className="relative h-full w-full">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e9e3dd/aa8f66?text=Artwork";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-medium mb-1">{artwork.title}</h3>
                      <p className="text-xl opacity-90 mb-4">by {artwork.artist}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-gallery-accent font-bold text-sm">
                        {formatCurrency(artwork.currentBid)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                      <p className="text-xs text-white/70">Medium</p>
                      <p className="text-sm capitalize">{artwork.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Bids</p>
                      <p className="text-sm">{artwork.bids.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Time Left</p>
                      <p className="text-sm">{formatTimeRemaining(artwork.auctionEnds)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/artwork/${artwork.id}`}
                      className="bg-gallery-accent hover:bg-gallery-accent-dark text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 shadow-md text-sm"
                      onClick={(e) => e.stopPropagation()} // Prevent carousel navigation
                    >
                      Place Bid
                    </Link>
                    <Link
                      to={`/artwork/${artwork.id}`}
                      className="border border-white hover:border-gallery-accent text-white hover:text-gallery-accent px-6 py-2 rounded-full transition-colors duration-300 text-sm"
                      onClick={(e) => e.stopPropagation()} // Prevent carousel navigation
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {featuredArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentArtworkIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${currentArtworkIndex === index ? 'bg-gallery-accent w-6' : 'bg-white/50'}`}
            aria-label={`View artwork ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</motion.div>

<SectionDivider variant="default" />

{/*AUCTION PROCESS */}
<motion.div 
        ref={processRef}
        initial="hidden"
        animate={processControls}
        variants={fadeIn}
      >
  <AuctionProcess />
</motion.div>

<SectionDivider variant="wavy" />

      {/* Team Section */}
      {/* Developers Section with White Background and Beige Cards */}
<motion.div 
  ref={teamRef}
  initial="hidden"
  animate={teamControls}
  variants={fadeIn}
  className="py-12 bg-white relative overflow-hidden"
>
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png')] opacity-10"></div>
  
  <div className="container mx-auto px-4 max-w-7xl relative z-10">
    <motion.div variants={fadeIn} className="text-center mb-12">
      <h2 className="text-base font-medium text-gallery-accent mb-1 tracking-widest">DEVELOPMENT TEAM</h2>
      <h3 className="text-3xl md:text-4xl font-medium mb-4 font-serif relative inline-block">
        <span className="relative z-10">Developers of This Auction Website</span>
        <span className="absolute -bottom-1 left-0 w-full h-1 bg-gallery-accent/30 z-0"></span>
      </h3>
      <p className="text-lg text-center text-gallery-text/70 max-w-2xl mx-auto">
        The technical experts who built and maintain this platform
      </p>
    </motion.div>

    {/* Horizontal Scrolling Container */}
    <div className="relative pb-16">
      <div className="flex gap-8 px-4 overflow-x-auto pb-6 -mx-4">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 w-[280px] relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { delay: index * 0.1, duration: 0.6 }
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            onMouseEnter={() => setHoveredSpecialist(index)}
            onMouseLeave={() => setHoveredSpecialist(null)}
          >
            {/* Beige Card with Frame */}
            <div className={`relative transition-all duration-500 ${hoveredSpecialist === index ? 'shadow-2xl' : 'shadow-lg'}`}>
              {/* Decorative frame elements */}
              <div className="absolute -inset-2 overflow-hidden rounded-xl">
                <div className={`absolute inset-0 border-2 ${hoveredSpecialist === index ? 'border-gallery-accent' : 'border-gallery-beige/70'} rounded-xl`}></div>
                <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full ${hoveredSpecialist === index ? 'bg-gallery-accent' : 'bg-gallery-beige'}`}></div>
                <div className={`absolute -bottom-3 -left-3 w-6 h-6 rounded-full ${hoveredSpecialist === index ? 'bg-gallery-accent' : 'bg-gallery-beige'}`}></div>
              </div>
              
              {/* Main card content - Beige */}
              <div className="relative bg-gallery-beige/30 rounded-lg overflow-hidden">
                {/* Developer Image */}
                <div className="relative pt-4 px-4">
                  <div className="aspect-square overflow-hidden shadow-inner border border-gallery-beige/50">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${hoveredSpecialist === index ? 'scale-105' : 'scale-100'}`}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Info Panel - Beige */}
                <div className={`relative -mt-6 mx-4 p-4 rounded-lg shadow-md transition-all duration-300 ${hoveredSpecialist === index ? 'bg-gallery-accent text-white' : 'bg-gallery-beige/50 text-gallery-text'}`}>
                  <h4 className="text-lg font-medium mb-1">{member.name}</h4>
                  <p className="text-xs uppercase tracking-wider mb-2">{member.title}</p>
                  
                  {/* Tech Stack Tag */}
                  <div className={`absolute -top-3 right-4 px-2 py-1 rounded-full text-xs font-medium ${hoveredSpecialist === index ? 'bg-white text-gallery-accent' : 'bg-gallery-accent text-white'}`}>
                    {member.expertise}
                  </div>
                  
                  {/* Expanded Tech Details */}
                  {hoveredSpecialist === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-3 border-t border-white/20"
                    >
                      <ul className="text-xs space-y-1 mb-3">
                        {member.achievements.slice(0, 2).map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <Sparkles className="mr-1 mt-0.5 flex-shrink-0" size={12} />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                      <button className="text-xs flex items-center justify-center w-full py-1 border border-white/30 rounded hover:bg-white/10 transition-colors">
                        View Profile <ArrowRight className="ml-1" size={12} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Connection lines between cards */}
            {index < teamMembers.length - 1 && (
              <svg 
                className={`absolute hidden lg:block ${hoveredSpecialist === index ? 'opacity-100' : 'opacity-30'} transition-opacity duration-300`}
                style={{
                  top: '50%',
                  left: '100%',
                  width: '80px'
                }}
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path 
                  d="M0,5 Q25,10 50,5 T100,5" 
                  stroke={hoveredSpecialist === index ? "#F4A261" : "#AA8F66"} 
                  strokeWidth="1.5" 
                  fill="none" 
                  strokeDasharray="4 3"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</motion.div>

      <SectionDivider variant="dots" />

                  {/* Enhanced Auction Success Section */}
                  <motion.div 
        ref={successRef}
        initial="hidden"
        animate={successControls}
        variants={fadeIn}
        className="py-10 bg-gradient-to-br from-gallery-beige/20 to-gallery-accent/10 relative"
      >
  {/* Optimized Floating Artwork Particles (reduced quantity) */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-12 h-12 rounded-lg overflow-hidden shadow-sm"
        style={{
          backgroundImage: `url(${artworks[i % artworks.length].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 90}%`,
          opacity: 0.2,
          filter: 'blur(0.5px)'
        }}
        animate={{
          y: [0, Math.random() * 20 - 10],
          x: [0, Math.random() * 20 - 10],
          rotate: [0, Math.random() * 10 - 5],
          transition: {
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }
        }}
      />
    ))}
  </div>

  <div className="container mx-auto px-4 max-w-4xl relative z-10">
    <motion.div 
      variants={fadeIn}
      className="text-center mb-8"
    >
      <h2 className="text-sm font-medium text-gallery-accent mb-1 tracking-widest">SUCCESS STORIES</h2>
      <motion.h3 
        className="text-2xl md:text-3xl font-medium mb-1 font-serif"
        whileHover={{ scale: 1.02 }}
      >
        Auction <span className="text-gallery-accent">Success</span>
      </motion.h3>
      <p className="text-sm text-gallery-text/70 max-w-lg mx-auto">
        How our platform transforms artists' careers
      </p>
    </motion.div>

    {/* Compact Timeline */}
    <motion.div 
      variants={staggerContainer}
      className="relative py-6"
    >
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gallery-accent/20 to-transparent"></div>
      
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          variants={fadeIn}
          className={`relative mb-10 ${index % 2 === 0 ? 'pr-6 lg:pr-0 lg:pl-6' : 'pl-6 lg:pl-0 lg:pr-6'}`}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          animate={{ 
            opacity: activeTestimonial === index ? 1 : 0.5,
            x: 0,
            transition: { duration: 0.4 }
          }}
          onClick={() => handleTestimonialNavigation(index)}
          whileHover={{ scale: activeTestimonial === index ? 1 : 1.01 }}
          style={{
            cursor: 'pointer',
            marginLeft: index % 2 === 0 ? 0 : 'auto',
            maxWidth: '600px'
          }}
        >
          {/* Timeline Dot */}
          <div className={`absolute top-6 ${index % 2 === 0 ? 'right-0 lg:right-auto lg:left-0' : 'left-0 lg:left-auto lg:right-0'} transform translate-x-1/2 lg:translate-x-0 ${index % 2 === 0 ? 'lg:-translate-x-1/2' : 'lg:translate-x-1/2'} w-4 h-4 rounded-full flex items-center justify-center z-10 ${activeTestimonial === index ? 'bg-gallery-accent scale-125' : 'bg-gallery-beige'}`}>
            {activeTestimonial === index && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-gallery-accent/30 animate-ping"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1.2 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </div>

          {/* Compact Story Card */}
          <div className={`relative ${activeTestimonial === index ? 'bg-white shadow-lg' : 'bg-white/50 shadow-sm'} rounded-lg overflow-hidden transition-all duration-200 p-4`}>
            <div className="flex items-start gap-4">
              <motion.div
                className={`w-16 h-16 rounded-full overflow-hidden border-2 ${activeTestimonial === index ? 'border-gallery-accent' : 'border-white'} shadow-md`}
                whileHover={{ rotate: activeTestimonial === index ? 0 : 3 }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-base font-medium ${activeTestimonial === index ? 'text-gallery-accent' : 'text-gallery-text'}`}>
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-gallery-text/60">{testimonial.title}</p>
                  </div>
                  {activeTestimonial === index && (
                    <div className="bg-gallery-accent text-white px-2 py-0.5 rounded-full text-2xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                
                <motion.div
                  className={`text-xs text-gallery-text/70 mt-2 ${activeTestimonial === index ? 'block' : 'hidden lg:block'}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: activeTestimonial === index ? 'auto' : 0,
                    opacity: activeTestimonial === index ? 1 : 0
                  }}
                >
                  <Quote className="float-left mr-1 text-gallery-accent/20 w-4 h-4" />
                  <p className="text-xs italic">
                    "{testimonial.quote.substring(0, 100)}..."
                  </p>
                </motion.div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-2xs bg-gallery-beige/30 px-1.5 py-0.5 rounded">
                    {testimonial.result}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Expanded Mini Stats */}
            {activeTestimonial === index && (
              <motion.div
                className="mt-3 pt-3 border-t border-gallery-beige/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { 
                      label: "Starting", 
                      value: `₱${Math.floor(parseInt(testimonial.result.replace(/\D/g, '')) / 4)}K`,
                    },
                    { 
                      label: "Bids", 
                      value: `${Math.floor(Math.random() * 15) + 5}`,
                    }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xs text-gallery-text/60">{stat.label}</div>
                      <div className="text-sm font-bold text-gallery-accent">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* Compact Navigation */}
    <motion.div
      className="flex justify-center gap-2 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {testimonials.map((_, index) => (
        <button
          key={index}
          onClick={() => handleTestimonialNavigation(index)}
          className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === index ? 'bg-gallery-accent w-4' : 'bg-gallery-beige/50'}`}
        />
      ))}
    </motion.div>

    {/* Simple CTA */}
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
    </motion.div>
  </div>
</motion.div>

      <SectionDivider variant="wavy" />


      {/* Contact Section */}
<motion.div 
  ref={contactRef}
  initial="hidden"
  animate={contactControls}
  variants={fadeIn}
  className="py-5 bg-white relative"
>
  {/* Scaled-down decorative elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-0 w-40 h-40 bg-gallery-accent/5 rounded-full filter blur-xl"></div>
    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gallery-accent/10 rounded-full filter blur-xl"></div>
    <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gallery-accent/10 rounded-full filter blur-md animate-pulse-slow"></div>
  </div>

  <div className="container mx-auto px-4 max-w-4xl relative z-10">
    <motion.div 
      variants={fadeIn}
      className="text-center mb-8"
    >
      <h2 className="text-xs font-medium text-gallery-accent mb-1 tracking-widest">GET IN TOUCH</h2>
      <h3 className="text-xl md:text-2xl font-medium mb-2 font-serif relative inline-block">
        <span className="relative z-10">Connect With Our Art Specialists</span>
        <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gallery-accent/30 z-0"></span>
      </h3>
      <p className="text-sm text-center text-gallery-text/70 max-w-md mx-auto">
        Have questions about auctions? Our team is ready to assist.
      </p>
    </motion.div>

    <motion.div 
      variants={staggerContainer}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Compact Contact Cards */}
      <motion.div 
        variants={slideInFromLeft}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {[
          {
            icon: <Mail className="text-gallery-accent" size={20} />,
            title: "Email Support",
            desc: "For general inquiries",
            items: [
              "support@artauctions.ph",
              "artists@artauctions.ph"
            ],
            decor: "right-[-1rem] top-[-1rem] w-16 h-16"
          },
          {
            icon: <Phone className="text-gallery-accent" size={20} />,
            title: "Phone Assistance",
            desc: "Direct specialist line",
            items: [
              "+63 (2) 8555-0123",
              "+63 (917) 555-0124"
            ],
            decor: "left-[-1rem] bottom-[-1rem] w-16 h-16"
          },
          {
            icon: <Clock className="text-gallery-accent" size={20} />,
            title: "Auction Hours",
            desc: "Philippine Standard Time",
            items: [
              "Mon-Fri: 9AM-8PM",
              "Sat: 10AM-6PM"
            ],
            decor: "right-[-1rem] bottom-[-1rem] w-12 h-12"
          },
          {
            icon: <Globe className="text-gallery-accent" size={20} />,
            title: "Global Offices",
            desc: "Worldwide service",
            items: [
              "Manila: +63 2 8555 0123",
              "HK: +852 1234 5678"
            ],
            decor: "left-[-1rem] top-[-1rem] w-12 h-12"
          }
        ].map((card, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -3 }}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-gallery-beige/50"
          >
            <div className={`absolute ${card.decor} bg-gallery-accent/10 rounded-full`}></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-gallery-accent/10 flex items-center justify-center mb-2">
                {card.icon}
              </div>
              <h3 className="text-base font-medium mb-1">{card.title}</h3>
              <p className="text-xs text-gallery-text/80 mb-2">{card.desc}</p>
              <div className="space-y-1">
                {card.items.map((item, i) => (
                  <div key={i} className="flex items-center text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-gallery-accent mr-1.5"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Compact Contact Form */}
      <motion.div 
        variants={slideInFromRight}
        className="bg-white rounded-xl shadow-md border border-gallery-beige/50 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gallery-accent/10 rounded-full filter blur-md transform translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gallery-accent/5 rounded-full filter blur-md transform -translate-x-8 translate-y-8"></div>
        
        <div className="relative z-10 p-5">
          <h3 className="text-lg font-medium mb-4 text-center">Send Us a Message</h3>
          
          <form className="space-y-3">
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-xs font-medium mb-1">Your Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-xs border border-gallery-beige/50 rounded-lg focus:ring-1 focus:ring-gallery-accent"
                placeholder="Full name"
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 text-xs border border-gallery-beige/50 rounded-lg focus:ring-1 focus:ring-gallery-accent"
                placeholder="your@email.com"
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-xs font-medium mb-1">Message</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 text-xs border border-gallery-beige/50 rounded-lg focus:ring-1 focus:ring-gallery-accent"
                placeholder="Your message..."
              ></textarea>
            </motion.div>
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-gallery-accent to-gallery-accent-dark text-white py-2 rounded text-sm flex items-center justify-center gap-1"
            >
              Send Message <ArrowRight size={14} />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>

    {/* Compact Social Media */}
    <motion.div variants={fadeIn} className="mt-8 text-center">
      <h4 className="text-xs text-gallery-text/70 mb-3">JOIN OUR COMMUNITY</h4>
      <div className="flex justify-center gap-2">
        {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map((platform) => (
          <motion.a
            key={platform}
            href="#"
            whileHover={{ y: -2 }}
            className="w-7 h-7 rounded-full bg-white border border-gallery-beige/30 flex items-center justify-center hover:bg-gallery-accent hover:text-white transition-colors"
            aria-label={platform}
          >
            {platform === 'Twitter' && <Twitter size={12} className="text-[#1DA1F2]" />}
            {platform === 'Instagram' && <Instagram size={12} className="text-[#E1306C]" />}
            {platform === 'Facebook' && <Facebook size={12} className="text-[#1877F2]" />}
            {platform === 'YouTube' && <Play size={12} className="text-[#FF0000]" />}
          </motion.a>
        ))}
      </div>
    </motion.div>
  </div>
</motion.div>
            </div>
          );
        };

        export default AboutPage;