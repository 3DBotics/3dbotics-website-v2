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
} from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import logoImage from "@assets/Untitled_design_2_1766698542754.png";
import founderImage from "@assets/founder_veni_flores.png";
import slider1 from "@assets/slider_1.jpg";
import slider2 from "@assets/slider_2.jpg";
import slider3 from "@assets/slider_3.jpg";
import slider4 from "@assets/slider_4.jpg";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "TechDojo", href: "#techdojo" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-brand-teal shadow-md" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
        <a href="#home" className="flex-shrink-0 flex items-center gap-2" data-testid="link-logo">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#1a5a5a] p-1 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="3DBotics Logo" 
              className="w-full h-full object-contain rounded-full"
              data-testid="img-logo"
            />
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            3D<span className="text-brand-coral">Botics</span><sup className="text-xs">®</sup>
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
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#1a5a5a] p-2 flex items-center justify-center shadow-xl">
            <img 
              src={logoImage} 
              alt="3DBotics Robot" 
              className="w-full h-full object-contain rounded-full"
              data-testid="img-hero-robot"
            />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 tracking-tight" data-testid="text-hero-title">
          Welcome to{" "}
          <span className="text-brand-green">3DBotics</span>{" "}
          <span className="text-brand-teal">TechDojo</span>
        </h1>
        
        <div className="max-w-3xl mx-auto mb-10 space-y-2" data-testid="text-hero-subtitle">
          <p className="text-lg md:text-xl text-gray-700 font-semibold">
            China–Japan Standard Technology Education
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            中日标准科技教育
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            日中基準のテクノロジー教育
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button 
            size="lg" 
            className="bg-brand-yellow text-gray-800 font-bold px-8 py-6 text-lg rounded-xl shadow-lg"
            data-testid="button-explore-programs"
          >
            Explore Programs
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-gray-800 text-gray-800 font-bold px-8 py-6 text-lg bg-white/50 rounded-xl"
            data-testid="button-learn-more"
          >
            Learn More
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
              3DBotics was founded by Veni Flores, an internationally recognized public speaker, bestselling author, and business mentor. With over 14 years of experience empowering corporations to achieve exponential growth, Veni has now focused his passion for technology and education to create 3DBotics—a movement designed to equip Filipino youth with future-ready skills in 3D printing, robotics, and artificial intelligence.
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
      title: "Robotics",
      description: "Design, build, and program robots. Compete in challenges and develop engineering skills.",
      iconBgClass: "bg-brand-green/20",
      iconColorClass: "text-brand-green",
      bgColor: "#7CB342"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="text-contact-title">
            Get in <span className="text-brand-teal">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-brand-teal mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-gray-50 border-2 rounded-2xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#7DD3D8' }} data-testid="card-contact-form">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                  data-testid="input-contact-email"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 min-h-32"
                  data-testid="input-contact-message"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-brand-teal text-white font-bold py-6 rounded-xl"
                disabled={contactMutation.isPending}
                data-testid="button-submit-contact"
              >
                {contactMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="bg-gray-50 border-2 rounded-2xl p-6 md:p-8 shadow-lg" style={{ borderColor: '#7DD3D8' }} data-testid="card-contact-info">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-1">Address</p>
                  <p className="text-gray-600" data-testid="text-contact-address">
                    123 Innovation Drive, Tech City<br />
                    Philippines
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
                    hello@3dbotics.ph
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
                    +63 123 456 7890
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-800 font-medium mb-4">Follow Us</p>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors shadow-sm"
                  data-testid="link-social-facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors shadow-sm"
                  data-testid="link-social-instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors shadow-sm"
                  data-testid="link-social-youtube"
                >
                  <SiYoutube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </Card>
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
            <div className="w-10 h-10 rounded-full bg-[#1a5a5a] p-1 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="3DBotics" 
                className="w-full h-full object-contain rounded-full"
                data-testid="img-footer-logo"
              />
            </div>
            <span className="text-gray-800 font-bold">
              3D<span className="text-brand-coral">Botics</span><sup className="text-xs">®</sup>
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
        <div className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-white rounded-2xl overflow-hidden shadow-2xl border-2" style={{ borderColor: '#7DD3D8' }} data-testid="chatbot-window">
          <div className="bg-brand-teal p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a5a5a] p-1 flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="AI Assistant" 
                className="w-full h-full object-contain rounded-full"
                data-testid="img-chatbot-avatar"
              />
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
            src="https://chat.3dbotics.ph"
            title="3DBotics Chatbot"
            className="w-full h-[calc(100%-56px)] border-0"
            data-testid="iframe-chatbot"
          />
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1a5a5a] p-1 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        data-testid="button-open-chat"
      >
        <img 
          src={logoImage} 
          alt="Chat" 
          className="w-full h-full object-contain rounded-full"
        />
      </button>
      {!isOpen && (
        <span className="absolute -top-2 -left-2 bg-brand-teal text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
          Ask Me Anything
        </span>
      )}
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
        <TechDojoSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <ExternalChatbot />
    </div>
  );
}
