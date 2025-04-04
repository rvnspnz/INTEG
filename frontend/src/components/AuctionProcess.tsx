import { motion, useAnimation, useInView } from "framer-motion";
import { Gavel, ShieldCheck, Percent, Truck, ArrowRight, Sparkles, Gem } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

const AuctionProcess = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50px", once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const steps = [
    {
      icon: <Gavel className="text-gallery-accent" size={24} />,
      title: "Place Your Bid",
      summary: "Binding bids with minimum increments. 18+ only. Shill bidding prohibited.",
      details: [
        "All bids are final",
        "Follow increment guidelines",
        "Payment method required"
      ],
      accentColor: "from-purple-500/20 to-purple-700/10",
      particles: ["💰", "🖋️"]
    },
    {
      icon: <ShieldCheck className="text-gallery-accent" size={24} />,
      title: "Verify Authenticity",
      summary: "Certificate of authenticity with full condition disclosure.",
      details: [
        "Creation date & materials documented",
        "High-quality photos from all angles",
        "Provenance information included"
      ],
      accentColor: "from-blue-500/20 to-blue-700/10",
      particles: ["🔍", "📜"]
    },
    {
      icon: <Percent className="text-gallery-accent" size={24} />,
      title: "Pay Securely",
      summary: "15% commission + payment fees. Payout in 14 days.",
      details: [
        "Major credit cards & PayPal",
        "Escrow protection",
        "No upfront listing fees"
      ],
      accentColor: "from-amber-500/20 to-amber-700/10",
      particles: ["💳", "🔒"]
    },
    {
      icon: <Truck className="text-gallery-accent" size={24} />,
      title: "Receive Your Art",
      summary: "Worldwide insured shipping with real-time tracking.",
      details: [
        "Climate-controlled transport",
        "Customs fees calculated upfront",
        "White glove delivery available"
      ],
      accentColor: "from-emerald-500/20 to-emerald-700/10",
      particles: ["✈️", "📦"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-gallery-beige/20 to-gallery-beige/10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-60 h-60 rounded-full bg-gallery-accent/5 blur-xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-gallery-accent/10 blur-xl animate-float-slow animation-delay-2000"></div>
        
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            initial={{
              x: Math.random() * 80 - 40,
              y: Math.random() * 80 - 40,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, Math.random() * 30 - 15],
              x: [0, Math.random() * 30 - 15],
              rotate: [0, Math.random() * 45 - 22.5]
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {["🖼️", "🎨", "🖌️", "🧑‍🎨"][i % 4]}
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-20">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-50px", once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-medium text-gallery-accent mb-2 tracking-widest">
            THE ART AUCTION JOURNEY
          </h2>
          <div className="relative inline-block mb-4 group">
            <h3 className="text-2xl md:text-3xl font-medium relative z-10 group-hover:text-gallery-accent transition-colors duration-300">
              <span className="text-gallery-accent font-bold">HOW</span> MASTERPIECES FIND HOMES
            </h3>
            <div className="absolute -bottom-1 left-0 w-3/4 h-1 bg-gradient-to-r from-gallery-accent to-transparent z-0 group-hover:w-full transition-all duration-500"></div>
          </div>
          <p className="text-base text-center text-gallery-text/70 max-w-xl mx-auto">
            A <span className="font-medium text-gallery-text">curated, competitive</span> process designed to maximize value
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Sparkles className="text-gallery-accent/50 animate-pulse" size={20} />
            <Sparkles className="text-gallery-accent/50 animate-pulse animation-delay-1000" size={20} />
          </div>
        </motion.div>

        {/* Process cards */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="group relative h-full"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {step.particles.map((particle, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                    initial={{
                      x: Math.random() * 30 - 15,
                      y: Math.random() * 30 - 15
                    }}
                    animate={{
                      y: [0, Math.random() * 20 - 10],
                      x: [0, Math.random() * 20 - 10]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{
                      left: `${20 + (i * 20)}%`,
                      top: `${20 + (i * 10)}%`
                    }}
                  >
                    {particle}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                variants={hoverVariants}
                className={`bg-gradient-to-br ${step.accentColor} p-0.5 rounded-xl h-full shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-[12px] h-full flex flex-col border border-gallery-beige/50 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gallery-accent/5 group-hover:bg-gallery-accent/10 transition-all duration-500"></div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-gallery-accent to-gallery-accent-dark flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gallery-accent/10 flex items-center justify-center group-hover:bg-gallery-accent/20 transition-all duration-300">
                        {step.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gallery-text group-hover:text-gallery-accent transition-colors duration-300">
                        {step.title}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-gallery-text/80 mb-4 flex-grow">{step.summary}</p>
                    
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      whileHover={{ 
                        height: "auto",
                        opacity: 1,
                        transition: { 
                          duration: 0.4,
                          ease: "easeOut"
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-gallery-beige/50">
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Gem className="text-gallery-accent mt-0.5 flex-shrink-0" size={14} />
                              <span className="text-gallery-text/90">{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                    
                    <Link 
  to="/faqs" // This should match your route path to the FAQsPage
  className="mt-6 flex items-center gap-1 text-gallery-accent group-hover:text-gallery-accent-dark font-medium text-sm transition-colors duration-300 self-start"
>
  <span className="relative">
    <span className="relative z-10">Explore Details</span>
    <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gallery-accent group-hover:w-full transition-all duration-300"></span>
  </span>
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
</Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "-50px", once: true }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mt-16 text-center"
        >
          <Link to="/auctions">
            <button className="relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-gallery-accent to-gallery-accent-dark text-white px-6 py-2.5 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base font-medium group">
                <span className="relative z-10 flex items-center gap-2">
                Begin Your Auction Journey
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-gallery-accent-dark to-gallery-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            </button>
            </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AuctionProcess;