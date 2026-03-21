import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Cpu, 
  Brain, 
  Printer, 
  GraduationCap, 
  Users, 
  Target,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Menu,
  X,
  Loader2,
  Gamepad2,
} from "lucide-react";
import { SiFacebook } from "react-icons/si";
import logoImage from "@assets/2026_3DBotics®_LOGO_1766703414890.jpg";
import founderImage from "@assets/veni_founder.jpg";
import slider1 from "@assets/slider_1.jpg";
import slider2 from "@assets/slider_2.jpg";
import slider3 from "@assets/slider_3.jpg";
import slider4 from "@assets/slider_4.jpg";
import chatbotAvatar from "@assets/Gemini_Generated_Image_8t7xmn8t7xmn8t7x_1766711043630.png";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Videos", href: "#videos" },
    { label: "Operational Branches", href: "#branches" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-brand-teal shadow-md" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
        <a href="#home" className="flex-shrink-0 flex items-center gap-2" data-testid="link-logo">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[2px] border-[#1a5a5a] p-[2px] bg-white">
            <div className="w-full h-full rounded-full border-[2px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="3DBotics Logo" 
                className="w-full h-full object-cover"
                data-testid="img-logo"
              />
            </div>
          </div>
          <span className="text-xl md:text-2xl font-bold">
            <span className="text-[#1a5a5a]">3DBotics</span><sup className="text-xs text-[#1a5a5a]">®</sup>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 flex-wrap">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-800 hover:text-brand-coral transition-colors font-medium text-sm tracking-wide"
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <Button
            className="bg-brand-coral text-white font-medium rounded-full px-6"
            data-testid="button-login"
          >
            Login
          </Button>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-brand-teal shadow-lg py-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-6 py-3 text-gray-800 hover:text-brand-coral hover:bg-white/20 transition-colors"
              onClick={() => setIsOpen(false)}
              data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <div className="px-6 pt-3">
            <Button 
              className="bg-brand-coral text-white font-medium rounded-full px-6 w-full"
              data-testid="button-login-mobile"
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-teal" data-testid="section-hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5L35 15L45 15L37 23L40 33L30 27L20 33L23 23L15 15L25 15Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-52 h-52 md:w-72 md:h-72 rounded-full border-[3px] border-[#1a5a5a] p-[3px] bg-white shadow-xl">
            <div className="w-full h-full rounded-full border-[3px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="3DBotics Robot" 
                className="w-full h-full object-cover"
                data-testid="img-hero-robot"
              />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 tracking-tight" data-testid="text-hero-title">
          Welcome to{" "}
          <span className="text-[#1a5a5a]">3DBotics</span><sup className="text-lg text-[#1a5a5a]">®</sup>{" "}
          <span className="text-[#1a5a5a]">Tech</span><span className="text-brand-coral">Dojo</span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-10 space-y-2" data-testid="text-hero-subtitle">
          <p className="text-lg md:text-xl text-white font-semibold">
            China–Japan Standard Technology Education
          </p>
          <p className="text-lg md:text-xl text-white">
            中日标准科技教育
          </p>
          <p className="text-lg md:text-xl text-white">
            日中基準のテクノロジー教育
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button 
            size="lg" 
            className="bg-brand-yellow text-gray-800 font-bold px-8 py-6 text-lg rounded-xl shadow-lg"
            data-testid="button-explore-programs"
            onClick={() => document.getElementById('techdojo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore TechDojo Program
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ImageSlideshow() {
  const slides = [slider1, slider2, slider3, slider4];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="w-full bg-white py-4" data-testid="section-slideshow">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full flex-shrink-0 object-cover"
                data-testid={`img-slide-${index}`}
              />
            ))}
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-brand-teal' : 'bg-white/50'
                }`}
                data-testid={`button-slide-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white" data-testid="section-about">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="text-about-title">
            About <span className="text-brand-teal">3DBotics®</span>
          </h2>
          <div className="w-24 h-1 bg-brand-teal mx-auto rounded-full" />
        </div>

        <Card className="bg-gray-50 border-2 rounded-2xl p-6 md:p-10 shadow-lg" style={{ borderColor: '#7DD3D8' }} data-testid="card-about">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6" data-testid="text-about-description">
                3DBotics® is a pioneering educational technology company dedicated to empowering the next generation of innovators. We provide cutting-edge STEM education programs that combine 3D printing, artificial intelligence, and robotics to create immersive learning experiences.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed" data-testid="text-about-mission">
                Our mission is to make advanced technology education accessible, engaging, and fun for students of all ages. Through our TechDojo programs, we nurture creativity, problem-solving skills, and a passion for technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Innovation", value: "Focus" },
                { icon: Users, label: "Students", value: "10,000+" },
                { icon: GraduationCap, label: "Programs", value: "50+" },
                { icon: Brain, label: "AI Powered", value: "Learning" },
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white border border-brand-teal/30 rounded-xl p-4 text-center shadow-sm"
                  data-testid={`stat-${stat.label.toLowerCase()}`}
                >
                  <stat.icon className="w-8 h-8 text-brand-teal mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50" data-testid="section-founder">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 uppercase tracking-wide" data-testid="text-founder-title">
              Message from the Founder
            </h2>
            
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6" data-testid="text-founder-bio-1">
              3DBotics was founded by Veni Flores, an internationally recognized public speaker, bestselling author, and business mentor. With over 30 years of experience empowering individuals and corporations to achieve exponential growth, Veni has now focused his passion for technology and education to create 3DBotics—a movement designed to equip Filipino youth with future-ready skills in 3D printing, robotics, and artificial intelligence.
            </p>
            
            <p className="text-gray-700 text-base md:text-lg leading-relaxed" data-testid="text-founder-bio-2">
              Veni's innovation journey began during the pandemic with the success of Toydemic, the largest home-based 3D printing farm in the Philippines. From this venture, 3DBotics was born, combining his expertise in entrepreneurship with a mission to prepare the next generation for the demands of Industry 4.0.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <img 
              src={founderImage} 
              alt="Veni Flores - CEO and Founder of 3DBotics" 
              className="w-full max-w-md rounded-lg shadow-xl object-cover"
              data-testid="img-founder"
            />
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold text-gray-800" data-testid="text-founder-name">Veni Flores</h3>
              <p className="text-gray-600" data-testid="text-founder-role">CEO and Founder of 3DBotics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const programs = [
    {
      icon: Printer,
      title: "3D Printing",
      description: "Learn the fundamentals of 3D design and printing. Create amazing projects from concept to physical reality.",
      iconBgClass: "bg-brand-yellow/20",
      iconColorClass: "text-brand-yellow",
      bgColor: "#EAB93F"
    },
    {
      icon: Brain,
      title: "Artificial Intelligence",
      description: "Explore the world of artificial intelligence. Build smart applications and understand how AI shapes our future.",
      iconBgClass: "bg-brand-teal/20",
      iconColorClass: "text-brand-teal",
      bgColor: "#7DD3D8"
    },
    {
      icon: Cpu,
      title: "Kit-Free Robotics",
      description: "Design, build, and program robots without traditional kits. Compete in challenges and develop engineering skills.",
      iconBgClass: "bg-brand-green/20",
      iconColorClass: "text-brand-green",
      bgColor: "#7CB342"
    },
    {
      icon: Gamepad2,
      title: "Game and Mobile App AI Development",
      description: "Create engaging games and mobile applications powered by AI. Learn to build interactive experiences for the digital age.",
      iconBgClass: "bg-brand-coral/20",
      iconColorClass: "text-brand-coral",
      bgColor: "#E8755E"
    },
  ];

  return (
    <section id="programs" className="py-16 md:py-24 bg-brand-green" data-testid="section-programs">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-programs-title">
            Four Emerging Technologies Into One Learning System
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto" data-testid="text-programs-subtitle">
            Comprehensive STEM education programs designed for the innovators of tomorrow
          </p>
          <div className="w-24 h-1 bg-brand-yellow mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <Card 
              key={program.title}
              className="bg-white border-2 rounded-2xl p-6 md:p-8 group transition-all duration-300 shadow-lg"
              style={{ borderColor: program.bgColor }}
              data-testid={`card-program-${index}`}
            >
              <div className={`w-16 h-16 rounded-xl ${program.iconBgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <program.icon className={`w-8 h-8 ${program.iconColorClass}`} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4" data-testid={`text-program-title-${index}`}>
                {program.title}
              </h3>
              <p className="text-gray-600 leading-relaxed" data-testid={`text-program-description-${index}`}>
                {program.description}
              </p>
              <Button 
                variant="ghost" 
                className={`mt-6 p-0 ${program.iconColorClass}`}
                data-testid={`button-learn-more-${index}`}
              >
                Learn More <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechDojoSection() {
  return (
    <section id="techdojo" className="py-16 md:py-24 bg-white" data-testid="section-techdojo">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="text-techdojo-title">
            <span className="text-brand-teal">Tech</span>Dojo Portal
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto" data-testid="text-techdojo-subtitle">
            Access your learning dashboard and exclusive resources
          </p>
          <div className="w-24 h-1 bg-brand-teal mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <Card className="bg-white border-2 rounded-2xl p-6 md:p-10 text-center group shadow-lg" style={{ borderColor: '#E8755E' }} data-testid="card-student-login">
            <div className="w-20 h-20 rounded-full bg-brand-coral/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-10 h-10 text-brand-coral" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" data-testid="text-student-portal-title">
              Student Portal
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed" data-testid="text-student-portal-description">
              Access your courses, track progress, submit projects, and connect with mentors.
            </p>
            <Button 
              className="w-full bg-brand-coral text-white font-bold py-6 text-lg rounded-full"
              data-testid="button-student-login"
            >
              Student Login
            </Button>
          </Card>

          <Card className="bg-white border-2 rounded-2xl p-6 md:p-10 text-center group shadow-lg" style={{ borderColor: '#7DD3D8' }} data-testid="card-franchisee-login">
            <div className="w-20 h-20 rounded-full bg-brand-teal/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
              <Users className="w-10 h-10 text-brand-teal" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" data-testid="text-franchisee-portal-title">
              Franchisee Portal
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed" data-testid="text-franchisee-portal-description">
              Manage your TechDojo center, access resources, and monitor student performance.
            </p>
            <Button 
              className="w-full bg-brand-teal text-white font-bold py-6 text-lg rounded-full"
              data-testid="button-franchisee-login"
            >
              Franchisee Login
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function LabgownPromotion() {
  const slides = [
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="py-16 md:py-24 bg-gray-50" data-testid="section-labgown">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="text-labgown-title">
            TechDojo <span className="text-brand-teal">Program Presentation</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore how the TechDojo program works — from the Career Rank System to daily sessions, sparring, and beyond.
          </p>
          <div className="w-24 h-1 bg-brand-teal mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
          <img
            key={slides[current]}
            src={`/assets/td_slide_${slides[current]}.jpg`}
            alt={`TechDojo Slide ${current + 1}`}
            className="w-full h-auto object-cover transition-opacity duration-500"
          />

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Slide counter */}
          <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {current + 1} / {slides.length}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? 'bg-brand-teal scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "3DBotics transformed my son's interest in technology into a real passion. The hands-on approach to learning is incredible!",
      author: "Maria Santos",
      role: "Parent"
    },
    {
      quote: "As a franchisee, the support and resources provided by 3DBotics are outstanding. It's a rewarding business with real impact.",
      author: "John Reyes",
      role: "TechDojo Franchisee"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-teal" data-testid="section-testimonials">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-testimonials-title">
            What People <span className="text-brand-yellow">Say</span>
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white border-2 rounded-2xl p-6 md:p-8 shadow-lg"
              style={{ borderColor: '#EAB93F' }}
              data-testid={`card-testimonial-${index}`}
            >
              <div className="text-4xl text-brand-yellow mb-4">"</div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6" data-testid={`text-testimonial-quote-${index}`}>
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-yellow/20 flex items-center justify-center">
                  <span className="text-brand-yellow font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800 font-semibold" data-testid={`text-testimonial-author-${index}`}>
                    {testimonial.author}
                  </p>
                  <p className="text-gray-500 text-sm" data-testid={`text-testimonial-role-${index}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-white" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="text-contact-title">
            Get in <span className="text-brand-teal">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-brand-teal mx-auto rounded-full" />
        </div>

        <div className="flex justify-center">
          <Card className="bg-gray-50 border-2 rounded-2xl p-6 md:p-8 shadow-lg w-full max-w-lg" style={{ borderColor: '#7DD3D8' }} data-testid="card-contact-info">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">Address</p>
                  <p className="text-gray-600" data-testid="text-contact-address">
                    3DBotics 2nd Floor Laguna Central Shopping Mall<br />
                    Don Jose street Paseo De Sta Rosa Greenfield<br />
                    Santa Rosa Laguna, Philippines<br />
                    (Beside Shopwise)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">Email</p>
                  <p className="text-gray-600" data-testid="text-contact-email">
                    3dbotics.LC@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-coral/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">Phone</p>
                  <p className="text-gray-600" data-testid="text-contact-phone">
                    09199727899
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-800 font-medium mb-4">Follow Us</p>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="https://www.facebook.com/share/14TWvvRRUpB/?mibextid=wwXIfr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors shadow-sm"
                  data-testid="link-social-facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

const videos = [
  { 
    title: "Welcome to 3DBotics TechDojo", 
    vimeoUrl: "https://player.vimeo.com/video/1149372357"
  },
];

function VideosSection() {
  return (
    <section id="videos" className="py-16 md:py-24 bg-gray-50" data-testid="videos-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center" data-testid="text-videos-title">
          Videos
        </h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              data-testid={`card-video-${index}`}
            >
              <div className="aspect-video">
                <iframe
                  src={video.vimeoUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                  data-testid={`iframe-video-${index}`}
                />
              </div>
              <div className="p-4 bg-brand-teal">
                <h3 className="text-lg font-bold text-[#1a5a5a]" data-testid={`text-video-title-${index}`}>
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const branches = [
  { name: "3DBotics Nuvali, Sta. Rosa (Main Branch)", contact: "0915 775 5321", address: "Unit 8 Level 2 Laguna Central Mall, Brgy. Don Jose, Sta. Rosa Tagaytay Road Corner, Sta. Rosa City, Laguna" },
  { name: "3DBotics Makati", contact: "0917 887 9576", address: "Unit 127, Mile-Long Building, Amorsolo St., Legaspi Village, Makati City" },
  { name: "3DBotics Mandaluyong", contact: "0917 578 1611", address: "6th Floor, 6E MG Tower II, Shaw Blvd., Mandaluyong City" },
  { name: "3DBotics Quezon City", contact: "0977 832 4211 / 0917 806 8125", address: "3rd Floor, Fishermall, Quezon City" },
  { name: "3DBotics Tacloban City", contact: "0917 850 2008", address: "Ground Floor, Primark Center, Caibaan, Tacloban City" },
  { name: "3DBotics Imus", contact: "0956 895 0278", address: "#2 Sampaguita St., Plaridel Subd., Bayan Luma 8, Imus, Cavite" },
  { name: "3DBotics Cabuyao", contact: "0917 574 3761 / 0919 236 4078", address: "LI Building 2, Southpoint Banay-Banay, Cabuyao, Laguna" },
  { name: "3DBotics Ormoc City", contact: "0917 896 1768", address: "Unit 113, UGF Chinatown East Gate, Lilia Ave., Brgy. Cogon, Ormoc City, Leyte" },
  { name: "3DBotics Las Pinas", contact: "0998 530 9437", address: "Las Pinas City" },
  { name: "3DBotics Sto. Tomas", contact: "0945 289 0343 / 0936 535 6711", address: "Blk 18 Lot 25, Kiwi St., The Mango Grove Subdivision, Brgy. San Roque, Sto. Tomas City, Batangas" },
  { name: "3DBotics San Pablo", contact: "0945 289 0343 / 0936 535 6711", address: "4 Lt. Brion St., Brgy. III-F, San Pablo City, Laguna" },
  { name: "3DBotics Bacoor", contact: "0917 532 4671", address: "Main Square Mall, 2nd Level, Bacoor Blvd., Barangay Bayanan, Bacoor City, Cavite" },
  { name: "3DBotics Paranaque City", contact: "0962 629 8135", address: "2F Unit 2, El Grande Arcade, 316 El Grande Arcade, BF Homes, Paranaque City" },
];

function Branches() {
  return (
    <section id="branches" className="py-16 md:py-24 bg-white" data-testid="branches-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12" data-testid="text-branches-title">
          Operational Branches
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center"
              data-testid={`card-branch-${index}`}
            >
              <div className="w-20 h-20 rounded-full border-[2px] border-[#1a5a5a] p-[2px] bg-white mb-4">
                <div className="w-full h-full rounded-full border-[2px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
                  <img 
                    src={logoImage} 
                    alt="3DBotics" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#EAB93F] mb-3" data-testid={`text-branch-name-${index}`}>
                {branch.name}
              </h3>
              <p className="text-gray-700 text-sm mb-1">
                <span className="font-medium">Contact #:</span> <span className="font-bold">{branch.contact}</span>
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Address:</span> {branch.address}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-lg font-semibold text-brand-teal" data-testid="text-branches-coming-soon">
            40 more branches are opening soon!
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 bg-brand-teal" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-[2px] border-[#1a5a5a] p-[2px] bg-white">
              <div className="w-full h-full rounded-full border-[2px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="3DBotics" 
                  className="w-full h-full object-cover"
                  data-testid="img-footer-logo"
                />
              </div>
            </div>
            <span className="font-bold">
              <span className="text-[#1a5a5a]">3DBotics</span><sup className="text-xs text-[#1a5a5a]">®</sup>
            </span>
            <span className="text-gray-700 text-sm">
              3D Printing | AI | Robotics
            </span>
          </div>
          <p className="text-gray-700 text-sm" data-testid="text-copyright">
            © 2026 3DBotics®. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ExternalChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50" data-testid="chatbot-container">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[700px] bg-white rounded-2xl overflow-hidden shadow-2xl border-2" style={{ borderColor: '#7DD3D8' }} data-testid="chatbot-window">
          <div className="bg-brand-teal p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-[2px] border-[#1a5a5a] p-[2px] bg-white">
              <div className="w-full h-full rounded-full border-[2px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
                <img 
                  src={chatbotAvatar} 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover"
                  data-testid="img-chatbot-avatar"
                />
              </div>
            </div>
            <div>
              <p className="text-gray-800 font-semibold">3DBotics Assistant</p>
              <p className="text-gray-700 text-xs">Online</p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="ml-auto text-gray-700"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <iframe
            src="https://3dbotics.ph/concierge"
            title="3DBotics Chatbot"
            className="w-full h-[calc(100%-56px)] border-0"
            data-testid="iframe-chatbot"
          />
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-20 h-20 rounded-full border-[3px] border-[#1a5a5a] p-[3px] bg-white shadow-lg transition-transform hover:scale-105"
          data-testid="button-open-chat"
        >
          <div className="w-full h-full rounded-full border-[3px] border-[#1a5a5a] bg-white overflow-hidden flex items-center justify-center">
            <img 
              src={chatbotAvatar} 
              alt="Chat" 
              className="w-full h-full object-cover"
            />
          </div>
        </button>
        {!isOpen && (
          <span className="mt-2 bg-brand-teal text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
            Ask Me Anything
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <ImageSlideshow />
        <AboutSection />
        <FounderSection />
        <ProgramsSection />
        <LabgownPromotion />
        <TestimonialsSection />
        <VideosSection />
        <Branches />
        <ContactSection />
      </main>
      <Footer />
      <ExternalChatbot />
    </div>
  );
}
