import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaClock,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
  FaHeadset,
  FaBuilding,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

const ContactPage = () => {
  const { showSuccess, showError } = useAlert();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showError('कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    try {
      // यहाँ आप अपना API call करेंगे
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('आपका संदेश भेज दिया गया है। हम जल्द ही संपर्क करेंगे।');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showError('संदेश भेजने में समस्या हुई। कृपया पुन: प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Contact information
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'पता',
      details: [
        'नागरिक ऐप हेड ऑफिस',
        'प्लॉट नंबर 123, सेक्टर 62',
        'नोएडा, उत्तर प्रदेश - 201301',
        'भारत'
      ],
      color: 'primary',
      bgColor: 'primary'
    },
    {
      icon: FaPhone,
      title: 'फोन नंबर',
      details: [
        'टोल फ्री: 1800-123-4567',
        'लैंडलाइन: 0120-4567890',
        'मोबाइल: +91 98765 43210',
        '(सुबह 10 से शाम 6 बजे तक)'
      ],
      color: 'green',
      bgColor: 'green'
    },
    {
      icon: FaEnvelope,
      title: 'ईमेल',
      details: [
        'सहायता: support@nagarikapp.com',
        'शिकायत: complaint@nagarikapp.com',
        'मीडिया: media@nagarikapp.com',
        'करियर: careers@nagarikapp.com'
      ],
      color: 'blue',
      bgColor: 'blue'
    },
    {
      icon: FaClock,
      title: 'कार्यालय समय',
      details: [
        'सोमवार - शुक्रवार: सुबह 9 से शाम 6',
        'शनिवार: सुबह 10 से शाम 4',
        'रविवार: बंद',
        'राष्ट्रीय अवकाश: बंद'
      ],
      color: 'purple',
      bgColor: 'purple'
    }
  ];

  // Social media links
  const socialLinks = [
    { icon: FaFacebook, name: 'Facebook', link: 'https://facebook.com/nagarikapp', color: 'blue' },
    { icon: FaTwitter, name: 'Twitter', link: 'https://twitter.com/nagarikapp', color: 'blue' },
    { icon: FaInstagram, name: 'Instagram', link: 'https://instagram.com/nagarikapp', color: 'pink' },
    { icon: FaLinkedin, name: 'LinkedIn', link: 'https://linkedin.com/company/nagarikapp', color: 'blue' },
    { icon: FaYoutube, name: 'YouTube', link: 'https://youtube.com/@nagarikapp', color: 'red' },
    { icon: FaWhatsapp, name: 'WhatsApp', link: 'https://wa.me/919876543210', color: 'green' }
  ];

  // Department tabs
  const departments = [
    { id: 'general', name: 'सामान्य पूछताछ', icon: FaUser },
    { id: 'technical', name: 'तकनीकी सहायता', icon: FaHeadset },
    { id: 'complaint', name: 'शिकायत', icon: FaComment },
    { id: 'business', name: 'व्यावसायिक सहयोग', icon: FaBuilding }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-custom py-20">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              संपर्क करें
            </h1>
            <p className="text-xl mb-[100px] text-primary-50">
              हमसे जुड़ें, हम आपकी हर समस्या का समाधान करने के लिए तैयार हैं।
              कोई सवाल, सुझाव या शिकायत हो तो हमें बताएं।
            </p>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* Contact Information Cards */}
      <section className="py-16 container-custom">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className={`bg-white rounded-2xl shadow-xl p-6 border-l-8 border-${info.color}-500 hover:shadow-2xl transition-all`}
            >
              <div className={`inline-flex p-3 bg-${info.bgColor}-100 rounded-xl mb-4`}>
                <info.icon className={`text-3xl text-${info.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Map and Form Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden h-[500px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.223703312718!2d77.08919031508077!3d28.50298278246868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1e5c3c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
                className="w-full h-full"
              ></iframe>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                हमें संदेश भेजें
              </h2>

              {/* Department Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setActiveTab(dept.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${activeTab === dept.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <dept.icon className="mr-2" />
                    {dept.name}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      आपका नाम <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                        placeholder="अपना नाम लिखें"
                        required
                      />
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ईमेल <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                        placeholder="आपका ईमेल"
                        required
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    फोन नंबर
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                      placeholder="आपका फोन नंबर"
                    />
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    विषय
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                    placeholder="संदेश का विषय"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    संदेश <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all resize-none"
                      placeholder="अपना संदेश लिखें..."
                      required
                    ></textarea>
                    <FaComment className="absolute left-4 top-4 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      भेज रहे हैं...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      संदेश भेजें
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                <span className="text-red-500">*</span> चिह्नित फील्ड आवश्यक हैं
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            हमारे कार्यालय
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            देशभर में हमारे कार्यालय आपकी सेवा के लिए तैयार हैं
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              city: 'नई दिल्ली',
              address: 'प्लॉट नंबर 123, सेक्टर 62, नोएडा, उत्तर प्रदेश - 201301',
              phone: '+91 98765 43210',
              email: 'delhi@nagarikapp.com'
            },
            {
              city: 'मुंबई',
              address: 'बिल्डिंग नंबर 45, बीकेसी, बांद्रा ईस्ट, मुंबई - 400051',
              phone: '+91 98765 43211',
              email: 'mumbai@nagarikapp.com'
            },
            {
              city: 'बेंगलुरु',
              address: 'टेक पार्क, सेक्टर 1, व्हाइटफील्ड, बेंगलुरु - 560066',
              phone: '+91 98765 43212',
              email: 'bangalore@nagarikapp.com'
            }
          ].map((office, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{office.city}</h3>
              <p className="text-gray-600 text-sm mb-3">{office.address}</p>
              <div className="space-y-2">
                <p className="text-sm flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-primary-500 text-xs" />
                  {office.phone}
                </p>
                <p className="text-sm flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-primary-500 text-xs" />
                  {office.email}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {/* FAQ Link */}
      <section className="py-12">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto"
          >
            <FaComment className="text-5xl text-primary-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              तुरंत जवाब चाहिए?
            </h3>
            <p className="text-gray-600 mb-6">
              हमारे FAQ पेज पर जाएं जहां आपको सामान्य प्रश्नों के जवाब मिल जाएंगे
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors group"
            >
              FAQ देखें
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

     
    </div>
  );
};

export default ContactPage;