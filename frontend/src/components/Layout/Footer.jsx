import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkedAlt, 
  FaGithub, 
  FaTwitter, 
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaNewspaper
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  // Smooth scroll to top function
  const handleLinkClick = (e, to) => {
    e.preventDefault();
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Navigate after a small delay to allow scroll to complete
    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/civicconnect', label: 'Twitter', color: '#1DA1F2' },
    { icon: FaFacebook, href: 'https://facebook.com/civicconnect', label: 'Facebook', color: '#1877F2' },
    { icon: FaInstagram, href: 'https://instagram.com/civicconnect', label: 'Instagram', color: '#E4405F' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/civicconnect', label: 'LinkedIn', color: '#0A66C2' },
    { icon: FaYoutube, href: 'https://youtube.com/civicconnect', label: 'YouTube', color: '#FF0000' },
    { icon: FaGithub, href: 'https://github.com/civicconnect', label: 'GitHub', color: '#333' }
  ];

  const quickLinks = [
    { to: '/', label: 'होम' },
    { to: '/issues', label: 'सभी Issues' },
    { to: '/create-issue', label: 'नया Issue' },
    { to: '/about', label: 'हमारे बारे में' }
  ];

  const supportLinks = [
    { to: '/faq', label: 'अक्सर पूछे जाने वाले सवाल' },
    { to: '/contact', label: 'संपर्क करें' },
    { to: '/privacy', label: 'गोपनीयता नीति' },
    { to: '/terms', label: 'नियम व शर्तें' }
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: 'support@civicconnect.com', href: 'mailto:support@civicconnect.com' },
    { icon: FaPhone, text: '0960-848-3662', href: 'tel:09608483662' },
    { icon: FaMapMarkerAlt, text: 'नई दिल्ली, भारत', href: 'https://maps.google.com/?q=New+Delhi+India' }
  ];

  // Newsletter subscription handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // Add your newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    // Show success message
    alert('न्यूज़लेटर के लिए धन्यवाद!');
    e.target.reset();
  };

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${'var(--color-primary-500)'} 0%, ${'var(--color-primary-800)'} 100%)`
          }}
        />
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <div className="absolute inset-0 rounded-full bg-white blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
          <div className="absolute inset-0 rounded-full bg-white blur-3xl" />
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container-custom pt-16 pb-8">
       
        {/* Main Footer Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8"
        >
          {/* About - 4 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
                <FaMapMarkedAlt 
                  className="text-2xl transition-transform group-hover:rotate-12" 
                  style={{ color: 'var(--color-accent-500)' }}
                />
              </div>
              <span className="font-bold text-xl text-white">CivicConnect</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              नागरिकों और प्रशासन के बीच सेतु, शहर की समस्याओं का त्वरित समाधान। 
              हमारा लक्ष्य है एक बेहतर और स्मार्ट शहर का निर्माण।
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/90">
                <FaShieldAlt className="mr-1" style={{ color: 'var(--color-accent-500)' }} />
                सुरक्षित
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/90">
                <FaHeart className="mr-1" style={{ color: 'var(--color-accent-500)' }} />
                विश्वसनीय
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white/10 text-white/90">
                🇮🇳 मेड इन इंडिया
              </span>
            </div>
          </motion.div>

          {/* Quick Links - 2 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              त्वरित लिंक
              <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: 'var(--color-accent-500)' }} />
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    onClick={(e) => handleLinkClick(e, link.to)}
                    className="text-white/70 hover:text-white transition-all duration-200 flex items-center group cursor-pointer"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 mr-0 group-hover:mr-2 transition-all" style={{ backgroundColor: 'var(--color-accent-500)' }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support - 2 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              सहायता
              <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: 'var(--color-accent-500)' }} />
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    onClick={(e) => handleLinkClick(e, link.to)}
                    className="text-white/70 hover:text-white transition-all duration-200 flex items-center group cursor-pointer"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 mr-0 group-hover:mr-2 transition-all" style={{ backgroundColor: 'var(--color-accent-500)' }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact - 4 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              संपर्क करें
              <span className="absolute bottom-0 left-0 w-12 h-0.5" style={{ backgroundColor: 'var(--color-accent-500)' }} />
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-white transition-all duration-200 flex items-center group"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <item.icon className="text-sm" style={{ color: 'var(--color-accent-500)' }} />
                    </div>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/80 mb-3">सोशल मीडिया पर जुड़ें</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                    aria-label={social.label}
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <social.icon 
                        className="text-lg transition-all duration-300"
                        style={{ color: social.color }}
                      />
                    </div>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/20 my-8"
          style={{ transformOrigin: 'left' }}
        />

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          {/* Copyright */}
          <div className="text-white/60 text-sm text-center md:text-left">
            <p>© {currentYear} CivicConnect. सभी अधिकार सुरक्षित।</p>
            <p className="text-xs mt-1">
              बनाया गया है ❤️ से भारत में
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick(e, '/privacy')}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              गोपनीयता नीति
            </a>
            <span className="text-white/20">|</span>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick(e, '/terms')}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              नियम व शर्तें
            </a>
            <span className="text-white/20">|</span>
            <a
              href="/cookies"
              onClick={(e) => handleLinkClick(e, '/cookies')}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              कुकी नीति
            </a>
            <span className="text-white/20">|</span>
            <a
              href="/sitemap"
              onClick={(e) => handleLinkClick(e, '/sitemap')}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              साइटमैप
            </a>
          </div>

          {/* Payment Methods or Trust Badges */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">सुरक्षित भुगतान:</span>
            <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
            <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* Back to Top Button - Only visible on mobile */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="md:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg"
          style={{ backgroundColor: 'var(--color-accent-500)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>

      {/* Wave SVG at bottom */}
      <div className="relative w-full -mb-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="white" 
            fillOpacity="0.05"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;