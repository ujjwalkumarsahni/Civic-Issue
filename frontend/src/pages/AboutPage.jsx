import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaBullseye, 
  FaEye, 
  FaHandsHelping,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaAward,
  FaHeart,
  FaMapMarkedAlt,
  FaCamera,
  FaComments,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaGlobeAsia
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutPage = () => {
  const { user } = useAuth();

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

  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'सक्रिय उपयोगकर्ता' },
    { icon: FaCheckCircle, value: '5,000+', label: 'समस्याएं हल' },
    { icon: FaMapMarkedAlt, value: '100+', label: 'शहरों में' },
    { icon: FaAward, value: '4.8/5', label: 'उपयोगकर्ता रेटिंग' }
  ];

  const features = [
    {
      icon: FaCamera,
      title: 'फोटो के साथ रिपोर्ट करें',
      description: 'समस्या की फोटो खींचकर तुरंत रिपोर्ट करें। सबूत के साथ समस्या दर्ज करें।',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaMapMarkedAlt,
      title: 'लाइव लोकेशन ट्रैकिंग',
      description: 'GPS की मदद से सटीक लोकेशन पर समस्या दर्ज करें। प्रशासन को सही जगह मिले।',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaComments,
      title: 'कमेंट और चर्चा',
      description: 'समस्या पर चर्चा करें, सुझाव दें और दूसरों के विचार जानें।',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FaChartLine,
      title: 'ट्रैकिंग सिस्टम',
      description: 'अपनी रिपोर्ट की स्थिति को ट्रैक करें। कब और क्या हुआ, यह जानें।',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaShieldAlt,
      title: 'सुरक्षित और निजी',
      description: 'आपकी जानकारी पूरी तरह सुरक्षित। डेटा एन्क्रिप्टेड और प्राइवेट।',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: FaClock,
      title: '24/7 सपोर्ट',
      description: 'कभी भी, कहीं भी समस्या दर्ज करें। हमारी टीम हमेशा तैयार।',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const timeline = [
    {
      year: '2023',
      title: 'नागरिक ऐप की शुरुआत',
      description: 'एक छोटे से विचार से शुरू हुआ - नागरिकों को आवाज देना',
      icon: FaRocket
    },
    {
      year: '2024',
      title: '1000+ समस्याएं हल',
      description: 'पहले साल में ही 1000 से ज्यादा समस्याओं का समाधान',
      icon: FaCheckCircle
    },
    {
      year: '2025',
      title: '100 शहरों में विस्तार',
      description: 'देशभर के 100 से ज्यादा शहरों में सेवा उपलब्ध',
      icon: FaGlobeAsia
    },
    {
      year: '2026',
      title: '10,000+ सक्रिय उपयोगकर्ता',
      description: 'आज 10,000 से ज्यादा नागरिक हमसे जुड़े हैं',
      icon: FaUsers
    }
  ];

  const team = [
    {
      name: 'राहुल शर्मा',
      role: 'संस्थापक और सीईओ',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'पूर्व आईएएस अधिकारी, शहरी विकास में 15 वर्षों का अनुभव'
    },
    {
      name: 'प्रिया सिंह',
      role: 'प्रौद्योगिकी निदेशक',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      bio: 'IIT दिल्ली से सॉफ्टवेयर इंजीनियरिंग में पीएचडी'
    },
    {
      name: 'अमित कुमार',
      role: 'संचालन प्रमुख',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      bio: 'पूर्व नगर निगम अधिकारी, प्रशासन में विशेषज्ञ'
    },
    {
      name: 'नेहा गुप्ता',
      role: 'ग्राहक सेवा प्रमुख',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      bio: 'जनसंपर्क और ग्राहक सेवा में 10 वर्षों का अनुभव'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container-custom py-20">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              हम <span className="text-yellow-300">नागरिकों</span> की आवाज हैं
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl mb-8 text-primary-50"
            >
              नागरिक ऐप - एक डिजिटल प्लेटफॉर्म जो नागरिकों और प्रशासन को जोड़ता है।
              आपकी समस्या, हमारी जिम्मेदारी।
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-4 justify-center"
            >
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    मुफ्त में जुड़ें
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-300"
                  >
                    लॉगिन करें
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100"
            >
              <div className="inline-flex p-3 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full mb-4">
                <stat.icon className="text-3xl text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-primary-500"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full mr-4">
                  <FaBullseye className="text-2xl text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">हमारा लक्ष्य</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                हर नागरिक की आवाज को सुनना और उनकी समस्याओं का त्वरित समाधान सुनिश्चित करना। 
                एक ऐसा प्लेटफॉर्म बनाना जहां हर व्यक्ति बिना किसी डर के अपनी समस्या रख सके 
                और उसका समाधान पा सके।
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-accent-500"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-accent-100 rounded-full mr-4">
                  <FaEye className="text-2xl text-accent-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">हमारा सपना</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                एक स्वच्छ, सुरक्षित और विकसित भारत का निर्माण करना जहां हर नागरिक को 
                बुनियादी सुविधाएं मिलें। टेक्नोलॉजी के माध्यम से प्रशासन और जनता के बीच 
                की दूरी को कम करना।
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">हमारी विशेषताएं</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            हम आपको बेहतर सेवा देने के लिए लगातार नए फीचर्स जोड़ रहे हैं
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-8">
                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">यह कैसे काम करता है?</h2>
            <p className="text-xl text-gray-600">चार आसान चरणों में अपनी समस्या का समाधान पाएं</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'रिपोर्ट करें', desc: 'समस्या की फोटो खींचकर रिपोर्ट करें', icon: FaCamera },
              { step: 2, title: 'ट्रैक करें', desc: 'अपनी रिपोर्ट की स्थिति ट्रैक करें', icon: FaMapMarkedAlt },
              { step: 3, title: 'चर्चा करें', desc: 'समस्या पर चर्चा करें और सुझाव दें', icon: FaComments },
              { step: 4, title: 'समाधान पाएं', desc: 'समस्या का समाधान होने पर सूचना पाएं', icon: FaCheckCircle }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-accent-300 text-2xl font-bold">
                    →
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <item.icon className="text-3xl text-accent-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">हमारा सफर</h2>
          <p className="text-xl text-gray-600">छोटी शुरुआत से बड़ा मुकाम तक</p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-500 hidden md:block"></div>

          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative mb-8 flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 md:w-1/2 p-6">
                <div className={`bg-white rounded-2xl shadow-xl p-6 ${
                  index % 2 === 0 ? 'md:ml-12' : 'md:mr-12'
                }`}>
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg text-white mr-3">
                      <item.icon />
                    </div>
                    <span className="text-primary-600 font-bold">{item.year}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>

              <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16">
                <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full z-10"></div>
                <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-primary-200 rounded-full animate-ping opacity-25"></div>
              </div>

              <div className="flex-1 md:w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">हमारी टीम</h2>
            <p className="text-xl text-gray-600">समर्पित पेशेवरों की टीम आपकी सेवा में</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Footer Note */}
      <section className="py-8 bg-gray-900 text-gray-400">
        <div className="container-custom text-center">
          <p className="text-sm">
            © 2026 नागरिक ऐप - सर्वाधिकार सुरक्षित। | 
            <Link to="/privacy" className="hover:text-white ml-2">गोपनीयता नीति</Link> | 
            <Link to="/terms" className="hover:text-white ml-2">उपयोग की शर्तें</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;