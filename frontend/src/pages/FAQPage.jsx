import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuestionCircle,
  FaSearch,
  FaPlus,
  FaMinus,
  FaUser,
  FaFileAlt,
  FaMapMarkedAlt,
  FaCamera,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaComments,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaArrowRight,
  FaExclamationTriangle,
  FaEye 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FAQPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  // Toggle FAQ item
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Categories
  const categories = [
    { id: 'all', name: 'सभी प्रश्न', icon: FaQuestionCircle, color: 'primary' },
    { id: 'account', name: 'खाता संबंधित', icon: FaUser, color: 'blue' },
    { id: 'reporting', name: 'समस्या रिपोर्ट करना', icon: FaFileAlt, color: 'green' },
    { id: 'tracking', name: 'स्थिति ट्रैकिंग', icon: FaMapMarkedAlt, color: 'purple' },
    { id: 'technical', name: 'तकनीकी सहायता', icon: FaCamera, color: 'orange' },
    { id: 'privacy', name: 'गोपनीयता और सुरक्षा', icon: FaShieldAlt, color: 'red' }
  ];

  // FAQ Data
  const faqData = [
    // Account Related
    {
      id: 1,
      category: 'account',
      question: 'नागरिक ऐप पर खाता कैसे बनाएं?',
      answer: 'खाता बनाने के लिए:\n\n1. होम पेज पर "रजिस्टर" बटन पर क्लिक करें\n2. अपना नाम, ईमेल और मोबाइल नंबर दर्ज करें\n3. एक सुरक्षित पासवर्ड बनाएं\n4. "रजिस्टर" बटन पर क्लिक करें\n5. आपके ईमेल पर भेजे गए लिंक से ईमेल वेरिफाई करें\n\nइसके बाद आप लॉगिन करके सभी सुविधाओं का उपयोग कर सकते हैं।',
      icon: FaUser,
      color: 'blue'
    },
    {
      id: 2,
      category: 'account',
      question: 'पासवर्ड भूल गए हैं तो क्या करें?',
      answer: 'पासवर्ड रीसेट करने के लिए:\n\n1. लॉगिन पेज पर "पासवर्ड भूल गए?" लिंक पर क्लिक करें\n2. अपना रजिस्टर्ड ईमेल दर्ज करें\n3. "भेजें" बटन पर क्लिक करें\n4. अपने ईमेल में भेजे गए लिंक पर क्लिक करें\n5. नया पासवर्ड बनाएं और कन्फर्म करें\n\nइसके बाद आप नए पासवर्ड से लॉगिन कर सकते हैं।',
      icon: FaUser,
      color: 'blue'
    },
    {
      id: 3,
      category: 'account',
      question: 'क्या मैं अपनी प्रोफाइल जानकारी बदल सकता हूँ?',
      answer: 'हाँ, आप अपनी प्रोफाइल जानकारी कभी भी बदल सकते हैं:\n\n1. लॉगिन करके डैशबोर्ड पर जाएं\n2. "प्रोफाइल" सेक्शन पर क्लिक करें\n3. "एडिट प्रोफाइल" बटन पर क्लिक करें\n4. अपनी जानकारी अपडेट करें\n5. "सेव" बटन पर क्लिक करें\n\nनोट: ईमेल आईडी बदलने के लिए आपको नए ईमेल को वेरिफाई करना होगा।',
      icon: FaUser,
      color: 'blue'
    },

    // Reporting Issues
    {
      id: 4,
      category: 'reporting',
      question: 'नई समस्या कैसे रिपोर्ट करें?',
      answer: 'समस्या रिपोर्ट करने के लिए:\n\n1. लॉगिन करें और "नई समस्या रिपोर्ट करें" बटन पर क्लिक करें\n2. समस्या का शीर्षक और विस्तृत विवरण दर्ज करें\n3. श्रेणी चुनें (कचरा, पानी, सड़क, बिजली, अन्य)\n4. समस्या की फोटो अपलोड करें\n5. मैप पर सही लोकेशन चुनें या ऑटो-डिटेक्ट का उपयोग करें\n6. "सबमिट" बटन पर क्लिक करें\n\nआपकी रिपोर्ट सबमिट होते ही एडमिन को नोटिफिकेशन भेज दिया जाएगा।',
      icon: FaFileAlt,
      color: 'green'
    },
    {
      id: 5,
      category: 'reporting',
      question: 'क्या बिना फोटो के समस्या रिपोर्ट कर सकते हैं?',
      answer: 'नहीं, समस्या की पुष्टि के लिए फोटो अनिवार्य है। फोटो से:\n\n• समस्या की गंभीरता का पता चलता है\n• प्रशासन को सही जानकारी मिलती है\n• फर्जी रिपोर्ट से बचाव होता है\n• समस्या का रिकॉर्ड रहता है\n\nआप मोबाइल कैमरे से साफ फोटो ले सकते हैं। अधिकतम 5MB साइज की फोटो अपलोड कर सकते हैं।',
      icon: FaCamera,
      color: 'green'
    },
    {
      id: 6,
      category: 'reporting',
      question: 'क्या मैं गुमनाम रहकर रिपोर्ट कर सकता हूँ?',
      answer: 'हाँ, आप गुमनाम रहकर भी रिपोर्ट कर सकते हैं। आपकी व्यक्तिगत जानकारी:\n\n• सार्वजनिक नहीं की जाएगी\n• सिर्फ एडमिन ही देख सकते हैं\n• रिपोर्ट में आपका नाम नहीं दिखेगा\n• पूरी तरह सुरक्षित रखी जाएगी\n\nहालांकि, रिपोर्ट ट्रैक करने और अपडेट पाने के लिए लॉगिन करना जरूरी है।',
      icon: FaShieldAlt,
      color: 'green'
    },

    // Tracking Issues
    {
      id: 7,
      category: 'tracking',
      question: 'अपनी रिपोर्ट की स्थिति कैसे ट्रैक करें?',
      answer: 'रिपोर्ट की स्थिति ट्रैक करने के कई तरीके:\n\n1. डैशबोर्ड पर "मेरी रिपोर्ट्स" सेक्शन देखें\n2. हर रिपोर्ट के सामने स्टेटस दिखेगा (लंबित/प्रगति पर/हल हुआ/अस्वीकृत)\n3. रिपोर्ट पर क्लिक करके डिटेल देखें\n4. स्टेटस बदलने पर ईमेल/नोटिफिकेशन मिलेगा\n5. टिप्पणी सेक्शन में एडमिन के अपडेट देखें',
      icon: FaMapMarkedAlt,
      color: 'purple'
    },
    {
      id: 8,
      category: 'tracking',
      question: 'रिपोर्ट का स्टेटस बदलने में कितना समय लगता है?',
      answer: 'स्टेटस अपडेट का समय रिपोर्ट की प्रकृति पर निर्भर करता है:\n\n• लंबित → प्रगति पर: 24-48 घंटे\n• प्रगति पर → हल हुआ: 3-7 दिन\n• गंभीर समस्याएं: 24 घंटे में\n• साधारण समस्याएं: 3-5 दिन में\n\nआप कमेंट सेक्शन में पूछकर भी जानकारी ले सकते हैं।',
      icon: FaClock,
      color: 'purple'
    },
    {
      id: 9,
      category: 'tracking',
      question: 'रिपोर्ट अस्वीकृत होने पर क्या करें?',
      answer: 'अगर आपकी रिपोर्ट अस्वीकृत हो जाए:\n\n1. अस्वीकृति का कारण जानें (नोट सेक्शन में)\n2. कमियां दूर करें (सही फोटो/लोकेशन/विवरण)\n3. दोबारा रिपोर्ट करें\n4. एडमिन से संपर्क करें\n5. अपील करें अगर गलत तरीके से अस्वीकृत हुई हो\n\nहर रिपोर्ट की समीक्षा एडमिन करते हैं, इसलिए सही जानकारी देना जरूरी है।',
      icon: FaExclamationTriangle,
      color: 'purple'
    },

    // Technical Support
    {
      id: 10,
      category: 'technical',
      question: 'फोटो अपलोड नहीं हो रही है, क्या करें?',
      answer: 'फोटो अपलोड की समस्या के समाधान:\n\n1. फोटो का साइज चेक करें (अधिकतम 5MB)\n2. JPG, PNG फॉर्मेट में हो\n3. इंटरनेट कनेक्शन चेक करें\n4. दूसरा ब्राउज़र इस्तेमाल करें\n5. कैश और कुकीज क्लियर करें\n6. मोबाइल ऐप में स्टोरेज परमिशन दें\n\nफिर भी समस्या हो तो हमें ईमेल करें।',
      icon: FaCamera,
      color: 'orange'
    },
    {
      id: 11,
      category: 'technical',
      question: 'लोकेशन डिटेक्ट नहीं हो रही है?',
      answer: 'लोकेशन की समस्या ठीक करने के लिए:\n\n1. GPS ऑन करें\n2. ब्राउज़र/ऐप को लोकेशन परमिशन दें\n3. अच्छे इंटरनेट कनेक्शन पर हों\n4. मैन्युअली लोकेशन चुनें\n5. पिन ड्रैग करके सही जगह सेट करें\n6. WiFi ऑन रखें (सटीकता के लिए)\n\nलोकेशन नहीं मिलने पर आप मैप पर पिन लगा सकते हैं।',
      icon: FaMapMarkedAlt,
      color: 'orange'
    },
    {
      id: 12,
      category: 'technical',
      question: 'मोबाइल ऐप कहां से डाउनलोड करें?',
      answer: 'नागरिक ऐप डाउनलोड करने के लिए:\n\nAndroid (Google Play Store):\n• "Nagarik App" सर्च करें\n• इंस्टॉल बटन पर क्लिक करें\n\niPhone (App Store):\n• "Nagarik App" सर्च करें\n• गेट बटन पर क्लिक करें\n\nया सीधे हमारी वेबसाइट से लिंक पर क्लिक करें। ऐप पूरी तरह मुफ्त है।',
      icon: FaQuestionCircle,
      color: 'orange'
    },

    // Privacy & Security
    {
      id: 13,
      category: 'privacy',
      question: 'मेरी व्यक्तिगत जानकारी सुरक्षित है?',
      answer: 'हाँ, आपकी जानकारी पूरी तरह सुरक्षित है:\n\n• डेटा एन्क्रिप्टेड है\n• सिर्फ अधिकृत कर्मचारी ही देख सकते हैं\n• तीसरे पक्ष को नहीं बेची जाती\n• सुरक्षित सर्वर पर स्टोर होती है\n• आप चाहें तो डेटा डिलीट कर सकते हैं\n\nहम सभी सुरक्षा मानकों का पालन करते हैं।',
      icon: FaShieldAlt,
      color: 'red'
    },
    {
      id: 14,
      category: 'privacy',
      question: 'क्या मैं अपना डेटा डिलीट कर सकता हूँ?',
      answer: 'हाँ, आप अपना डेटा डिलीट कर सकते हैं:\n\n1. सेटिंग्स में जाएं\n2. "खाता डिलीट करें" विकल्प चुनें\n3. कारण बताएं (वैकल्पिक)\n4. पासवर्ड डालकर कन्फर्म करें\n5. डिलीट रिक्वेस्ट सबमिट करें\n\nहम 30 दिनों में डेटा डिलीट कर देंगे। इस बीच आप खाता रिकवर कर सकते हैं।',
      icon: FaShieldAlt,
      color: 'red'
    },
    {
      id: 15,
      category: 'privacy',
      question: 'क्या मेरी रिपोर्ट सार्वजनिक दिखती है?',
      answer: 'आपकी रिपोर्ट की जानकारी:\n\nसार्वजनिक दिखती है:\n• समस्या का शीर्षक\n• श्रेणी और स्थिति\n• अनुमानित लोकेशन\n• टिप्पणियां\n\nनिजी रहती है:\n• आपका नाम\n• ईमेल और फोन\n• सटीक लोकेशन\n• व्यक्तिगत जानकारी\n\nइससे पारदर्शिता बनी रहती है और गोपनीयता भी सुरक्षित रहती है।',
      icon: FaEye,
      color: 'red'
    },

    // General
    {
      id: 16,
      category: 'all',
      question: 'क्या यह सेवा पूरी तरह मुफ्त है?',
      answer: 'हाँ, नागरिक ऐप पूरी तरह मुफ्त है:\n\n• खाता बनाना मुफ्त\n• रिपोर्ट करना मुफ्त\n• ट्रैकिंग मुफ्त\n• टिप्पणी करना मुफ्त\n• कोई छुपा शुल्क नहीं\n\nहमारा उद्देश्य सेवा देना है, कमाई नहीं।',
      icon: FaCheckCircle,
      color: 'primary'
    },
    {
      id: 17,
      category: 'all',
      question: 'एडमिन से सीधे संपर्क कैसे करें?',
      answer: 'एडमिन से संपर्क के तरीके:\n\n📧 ईमेल: support@nagarikapp.com\n📞 हेल्पलाइन: 1800-123-4567 (सुबह 10 से शाम 6)\n💬 व्हाट्सएप: +91 98765 43210\n📝 कमेंट सेक्शन: किसी भी रिपोर्ट पर\n🏢 दफ्तर: नागरिक ऐप, नई दिल्ली - 110001\n\nहम 24 घंटे में जवाब देते हैं।',
      icon: FaComments,
      color: 'primary'
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

        <div className="relative container-custom py-16">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              अक्सर पूछे जाने वाले प्रश्न
            </h1>
            <p className="text-xl mb-[150px] text-primary-50">
              आपके सवाल, हमारे जवाब। कोई सवाल हो तो पूछें, हम मदद के लिए तैयार हैं।
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="कोई सवाल पूछें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-300"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* Categories */}
      <section className="py-8 container-custom">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={fadeInUp}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === category.id
                  ? `bg-${category.color}-500 text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <category.icon className={`mr-2 ${
                activeCategory === category.id ? 'text-white' : `text-${category.color}-500`
              }`} />
              {category.name}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* FAQ List */}
      <section className="py-8 container-custom">
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  variants={fadeInUp}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-start justify-between focus:outline-none"
                  >
                    <div className="flex items-start flex-1">
                      <div className={`p-2 bg-${faq.color}-100 rounded-lg mr-4`}>
                        <faq.icon className={`text-${faq.color}-500`} />
                      </div>
                      <span className="text-lg font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                    </div>
                    <div className={`p-1 rounded-full transition-all duration-300 ${
                      openItems[faq.id] ? `bg-${faq.color}-500 text-white` : 'bg-gray-100 text-gray-600'
                    }`}>
                      {openItems[faq.id] ? <FaMinus /> : <FaPlus />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems[faq.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-100 pt-4">
                            <div className="prose prose-sm max-w-none text-gray-600">
                              {faq.answer.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                  {line}
                                  {i < faq.answer.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaQuestionCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                कोई प्रश्न नहीं मिला
              </h3>
              <p className="text-gray-500">
                कृपया दूसरे शब्दों में खोजें या कैटेगरी बदलें
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-12 bg-gray-50 mt-8">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                अभी भी सवाल हैं?
              </h2>
              <p className="text-gray-600">
                हमारी टीम आपकी मदद के लिए हमेशा तैयार है। संपर्क करें और हम जल्द से जल्द जवाब देंगे।
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.a
                href="mailto:support@nagarikapp.com"
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-blue-50 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ईमेल करें</h3>
                <p className="text-sm text-gray-600 text-center">support@nagarikapp.com</p>
                <p className="text-xs text-gray-500 mt-2">24 घंटे में जवाब</p>
              </motion.a>

              <motion.a
                href="tel:18001234567"
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-green-50 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaPhone className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">कॉल करें</h3>
                <p className="text-sm text-gray-600 text-center">9608-483-662</p>
                <p className="text-xs text-gray-500 mt-2">सुबह 10 से शाम 6</p>
              </motion.a>

              <motion.a
                href="https://wa.me/919608483662"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-6 bg-green-100 rounded-xl hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">व्हाट्सएप</h3>
                <p className="text-sm text-gray-600 text-center">+91 98765 43210</p>
                <p className="text-xs text-gray-500 mt-2">तुरंत जवाब</p>
              </motion.a>
            </div>

            {!user && (
              <div className="mt-8 text-center border-t border-gray-100 pt-8">
                <p className="text-gray-600 mb-4">
                  नया खाता बनाएं और सीधे हमसे जुड़ें
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors group"
                >
                  मुफ्त में खाता बनाएं
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default FAQPage;