import { useState } from "react";
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
  Loader2
} from "lucide-react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import logoImage from "@assets/Untitled_design_2_1766698542754.png";

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-black/30 backdrop-blur-lg border-b border-white/10" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
        <a href="#home" className="flex-shrink-0" data-testid="link-logo">
          <img 
            src={logoImage} 
            alt="3DBotics Logo" 
            className="h-10 md:h-14 w-auto object-contain"
            data-testid="img-logo"
          />
        </a>

        <div className="hidden md:flex items-center gap-8 flex-wrap">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/80 hover:text-brand-lime transition-colors font-medium text-sm tracking-wide"
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 py-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-6 py-3 text-white/80 hover:text-brand-lime hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
              data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-lime/5 via-transparent to-transparent" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(181, 211, 51, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(181, 211, 51, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src={logoImage} 
            alt="3DBotics Robot" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain animate-pulse"
            style={{ animationDuration: '3s' }}
            data-testid="img-hero-robot"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight" data-testid="text-hero-title">
          Welcome to{" "}
          <span className="text-brand-lime">3DBotics</span>
          <span className="text-brand-red">®</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed" data-testid="text-hero-subtitle">
          Pioneering the future of education through{" "}
          <span className="text-brand-teal font-semibold">3D Printing</span>,{" "}
          <span className="text-brand-lime font-semibold">AI</span>, and{" "}
          <span className="text-brand-red font-semibold">Robotics</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button 
            size="lg" 
            className="bg-brand-lime text-space-black font-bold px-8 py-6 text-lg border border-brand-lime"
            data-testid="button-explore-programs"
          >
            Explore Programs
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-brand-teal text-brand-teal font-bold px-8 py-6 text-lg bg-transparent"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-lime/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-brand-lime rounded-full" />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 relative" data-testid="section-about">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-about-title">
            About <span className="text-brand-lime">3DBotics®</span>
          </h2>
          <div className="w-24 h-1 bg-brand-lime mx-auto rounded-full" />
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-10" style={{ borderColor: '#B5D333' }} data-testid="card-about">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6" data-testid="text-about-description">
                3DBotics® is a pioneering educational technology company dedicated to empowering the next generation of innovators. We provide cutting-edge STEM education programs that combine 3D printing, artificial intelligence, and robotics to create immersive learning experiences.
              </p>
              <p className="text-white/80 text-base md:text-lg leading-relaxed" data-testid="text-about-mission">
                Our mission is to make advanced technology education accessible, engaging, and fun for students of all ages. Through our TechDojo programs, we nurture creativity, problem-solving skills, and a passion for technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, label: "Innovation", value: "Focus" },
                { icon: Users, label: "Students", value: "10,000+" },
                { icon: GraduationCap, label: "Programs", value: "50+" },
                { icon: Brain, label: "AI Powered", value: "Learning" },
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-sm border border-brand-lime/30 rounded-xl p-4 text-center"
                  data-testid={`stat-${stat.label.toLowerCase()}`}
                >
                  <stat.icon className="w-8 h-8 text-brand-lime mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const programs = [
    {
      icon: Printer,
      title: "3D Printing Mastery",
      description: "Learn the fundamentals of 3D design and printing. Create amazing projects from concept to physical reality.",
      iconBgClass: "bg-brand-lime/20",
      iconColorClass: "text-brand-lime",
      borderColor: "#B5D333"
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Explore the world of artificial intelligence. Build smart applications and understand how AI shapes our future.",
      iconBgClass: "bg-brand-teal/20",
      iconColorClass: "text-brand-teal",
      borderColor: "#5EC4C6"
    },
    {
      icon: Cpu,
      title: "Robotics Engineering",
      description: "Design, build, and program robots. Compete in challenges and develop engineering skills.",
      iconBgClass: "bg-brand-red/20",
      iconColorClass: "text-brand-red",
      borderColor: "#E8755E"
    },
  ];

  return (
    <section id="programs" className="py-16 md:py-24 relative" data-testid="section-programs">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-lime/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-programs-title">
            Our <span className="text-brand-lime">Programs</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto" data-testid="text-programs-subtitle">
            Comprehensive STEM education programs designed for the innovators of tomorrow
          </p>
          <div className="w-24 h-1 bg-brand-lime mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <Card 
              key={program.title}
              className="bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-8 group transition-all duration-300"
              style={{ borderColor: program.borderColor }}
              data-testid={`card-program-${index}`}
            >
              <div className={`w-16 h-16 rounded-xl ${program.iconBgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <program.icon className={`w-8 h-8 ${program.iconColorClass}`} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4" data-testid={`text-program-title-${index}`}>
                {program.title}
              </h3>
              <p className="text-white/70 leading-relaxed" data-testid={`text-program-description-${index}`}>
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
    <section id="techdojo" className="py-16 md:py-24 relative" data-testid="section-techdojo">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-techdojo-title">
            <span className="text-brand-lime">Tech</span>Dojo Portal
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto" data-testid="text-techdojo-subtitle">
            Access your learning dashboard and exclusive resources
          </p>
          <div className="w-24 h-1 bg-brand-lime mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <Card className="bg-brand-red/10 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-10 text-center group" style={{ borderColor: '#E8755E' }} data-testid="card-student-login">
            <div className="w-20 h-20 rounded-full bg-brand-red/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-10 h-10 text-brand-red" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-student-portal-title">
              Student Portal
            </h3>
            <p className="text-white/70 mb-8 leading-relaxed" data-testid="text-student-portal-description">
              Access your courses, track progress, submit projects, and connect with mentors.
            </p>
            <Button 
              className="w-full bg-brand-red text-white font-bold py-6 text-lg border border-brand-red"
              data-testid="button-student-login"
            >
              Student Login
            </Button>
          </Card>

          <Card className="bg-brand-teal/10 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-10 text-center group" style={{ borderColor: '#5EC4C6' }} data-testid="card-franchisee-login">
            <div className="w-20 h-20 rounded-full bg-brand-teal/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-10 h-10 text-brand-teal" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="text-franchisee-portal-title">
              Franchisee Portal
            </h3>
            <p className="text-white/70 mb-8 leading-relaxed" data-testid="text-franchisee-portal-description">
              Manage your TechDojo center, access resources, and monitor student performance.
            </p>
            <Button 
              className="w-full bg-brand-teal text-white font-bold py-6 text-lg border border-brand-teal"
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
    <section className="py-16 md:py-24 relative" data-testid="section-testimonials">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-teal/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-testimonials-title">
            What People <span className="text-brand-lime">Say</span>
          </h2>
          <div className="w-24 h-1 bg-brand-lime mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-8"
              style={{ borderColor: '#B5D333' }}
              data-testid={`card-testimonial-${index}`}
            >
              <div className="text-4xl text-brand-lime mb-4">"</div>
              <p className="text-white/80 text-lg leading-relaxed mb-6" data-testid={`text-testimonial-quote-${index}`}>
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-lime/20 flex items-center justify-center">
                  <span className="text-brand-lime font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold" data-testid={`text-testimonial-author-${index}`}>
                    {testimonial.author}
                  </p>
                  <p className="text-white/60 text-sm" data-testid={`text-testimonial-role-${index}`}>
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
    <section id="contact" className="py-16 md:py-24 relative" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-contact-title">
            Get in <span className="text-brand-lime">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-brand-lime mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-8" style={{ borderColor: '#B5D333' }} data-testid="card-contact-form">
            <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  data-testid="input-contact-email"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-32"
                  data-testid="input-contact-message"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-brand-lime text-space-black font-bold py-6 border border-brand-lime"
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

          <Card className="bg-white/5 backdrop-blur-lg border-2 rounded-2xl p-6 md:p-8" style={{ borderColor: '#B5D333' }} data-testid="card-contact-info">
            <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-lime/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-lime" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Address</p>
                  <p className="text-white/60" data-testid="text-contact-address">
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
                  <p className="text-white font-medium mb-1">Email</p>
                  <p className="text-white/60" data-testid="text-contact-email">
                    hello@3dbotics.ph
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Phone</p>
                  <p className="text-white/60" data-testid="text-contact-phone">
                    +63 123 456 7890
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white font-medium mb-4">Follow Us</p>
              <div className="flex gap-4 flex-wrap">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-lime hover:border-brand-lime transition-colors"
                  data-testid="link-social-facebook"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-lime hover:border-brand-lime transition-colors"
                  data-testid="link-social-instagram"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-lime hover:border-brand-lime transition-colors"
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
    <footer className="py-8 border-t border-white/10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="3DBotics" 
              className="h-8 w-auto object-contain"
              data-testid="img-footer-logo"
            />
            <span className="text-white/60 text-sm">
              3D Printing | AI | Robotics
            </span>
          </div>
          <p className="text-white/40 text-sm" data-testid="text-copyright">
            © 2026 3DBotics®. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! I'm the 3DBotics Assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/chat", { message: userMessage });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch {
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50" data-testid="chatbot-container">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-black/90 backdrop-blur-lg border-2 rounded-2xl overflow-hidden shadow-2xl" style={{ borderColor: '#B5D333' }} data-testid="chatbot-window">
          <div className="bg-brand-lime/10 border-b border-brand-lime/30 p-4 flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="AI Assistant" 
              className="w-10 h-10 object-contain rounded-full bg-white/10 p-1"
              data-testid="img-chatbot-avatar"
            />
            <div>
              <p className="text-white font-semibold">3DBotics Assistant</p>
              <p className="text-brand-lime text-xs">Online</p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="ml-auto text-white/60"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-4" data-testid="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.isUser 
                      ? 'bg-brand-lime text-space-black' 
                      : 'bg-white/10 text-white'
                  }`}
                  data-testid={`chat-message-${index}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-white/60">Typing...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                data-testid="input-chat-message"
              />
              <Button 
                size="icon"
                className="bg-brand-lime text-space-black border border-brand-lime"
                onClick={handleSend}
                disabled={isLoading}
                data-testid="button-send-chat"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-lime/20 backdrop-blur-lg border-2 border-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/20 transition-transform hover:scale-105"
        data-testid="button-open-chat"
      >
        <img 
          src={logoImage} 
          alt="Chat" 
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-space-black text-white">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <TechDojoSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}
