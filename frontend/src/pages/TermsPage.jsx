import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileContract,
  FaGavel,
  FaUserLock,
  FaCopyright,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaShieldAlt,
  FaHandsHelping,
  FaBan,
  FaMoneyBillWave,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaGlobe,
  FaMobile,
  FaLaptop,
  FaUsers,
  FaBuilding,
  FaBell 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  const [lastUpdated] = useState('15 मार्च 2026');
  const [effectiveDate] = useState('1 अप्रैल 2026');
  const [accepted, setAccepted] = useState(false);

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

  // Table of Contents
  const toc = [
    { id: 'acceptance', title: 'स्वीकृति', icon: FaCheckCircle },
    { id: 'eligibility', title: 'पात्रता', icon: FaUserLock },
    { id: 'account', title: 'खाता पंजीकरण', icon: FaUsers },
    { id: 'user-conduct', title: 'उपयोगकर्ता आचरण', icon: FaGavel },
    { id: 'content', title: 'सामग्री और पोस्टिंग', icon: FaCopyright },
    { id: 'intellectual-property', title: 'बौद्धिक संपदा', icon: FaCopyright },
    { id: 'prohibited-activities', title: 'निषिद्ध गतिविधियां', icon: FaBan },
    { id: 'termination', title: 'खाता समाप्ति', icon: FaTimesCircle },
    { id: 'disclaimers', title: 'अस्वीकरण', icon: FaExclamationTriangle },
    { id: 'limitation', title: 'दायित्व सीमा', icon: FaShieldAlt },
    { id: 'indemnification', title: 'क्षतिपूर्ति', icon: FaGavel },
    { id: 'governing-law', title: 'शासकीय कानून', icon: FaBuilding },
    { id: 'changes', title: 'शर्तों में बदलाव', icon: FaClock },
    { id: 'contact', title: 'संपर्क करें', icon: FaEnvelope }
  ];

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-6">
              <FaFileContract className="text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              सेवा की शर्तें
            </h1>
            <p className="text-xl mb-4 text-primary-50">
              कृपया इन शर्तों को ध्यान से पढ़ें
            </p>
            <p className="text-sm bg-white/20 inline-block px-4 py-2 rounded-full">
              अंतिम अपडेट: {lastUpdated} | प्रभावी तिथि: {effectiveDate}
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

      {/* Quick Summary */}
      <section className="py-8 container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-50 border-l-8 border-accent-500 rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <div className="flex items-start">
            <FaExclamationTriangle className="text-accent-600 text-2xl mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-accent-800 mb-2">संक्षिप्त सारांश</h3>
              <p className="text-accent-700 text-sm leading-relaxed">
                ये सेवा की शर्तें ("शर्तें") नागरिक ऐप प्लेटफॉर्म के आपके उपयोग को नियंत्रित करती हैं। 
                इस प्लेटफॉर्म का उपयोग करके, आप इन शर्तों से बंधे होने के लिए सहमत होते हैं। 
                यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया प्लेटफॉर्म का उपयोग न करें।
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-8 container-custom">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFileContract className="mr-2 text-primary-500" />
                अनुक्रमणिका
              </h3>
              <ul className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                {toc.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors flex items-center text-sm group"
                    >
                      <item.icon className="mr-3 text-gray-400 group-hover:text-primary-500" />
                      <span>{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Download Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">डाउनलोड करें</h4>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center">
                    <FaFileContract className="mr-2" />
                    PDF डाउनलोड करें
                  </button>
                  <button className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center">
                    <FaLaptop className="mr-2" />
                    प्रिंट करें
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Terms Content */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-3 space-y-8"
          >
            {/* Acceptance of Terms */}
            <motion.div variants={fadeInUp} id="acceptance" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-primary-500" />
                1. शर्तों की स्वीकृति
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  नागरिक ऐप ("हम", "हमारा", "हमें") में आपका स्वागत है। नागरिक ऐप प्लेटफॉर्म 
                  (वेबसाइट और मोबाइल एप्लिकेशन) का उपयोग करके, आप इन सेवा की शर्तों से बंधे होने के 
                  लिए सहमत होते हैं। यदि आप इन शर्तों के किसी भी भाग से असहमत हैं, तो आप हमारे 
                  प्लेटफॉर्म का उपयोग नहीं कर सकते हैं।
                </p>
                <p>
                  ये शर्तें आपके और नागरिक ऐप के बीच पूरे समझौते का गठन करती हैं और हमारे प्लेटफॉर्म 
                  के आपके उपयोग को नियंत्रित करती हैं, पूर्व या समकालीन समझौतों को प्रतिस्थापित करती हैं।
                </p>
              </div>
            </motion.div>

            {/* Eligibility */}
            <motion.div variants={fadeInUp} id="eligibility" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUserLock className="mr-3 text-primary-500" />
                2. पात्रता
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  हमारे प्लेटफॉर्म का उपयोग करने के लिए, आपको निम्नलिखित मानदंडों को पूरा करना होगा:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>आपकी आयु कम से कम 18 वर्ष होनी चाहिए</li>
                  <li>आपके पास एक वैध ईमेल पता और फोन नंबर होना चाहिए</li>
                  <li>आपको इन शर्तों को स्वीकार करने का कानूनी अधिकार होना चाहिए</li>
                  <li>आप किसी भी न्यायालय द्वारा प्लेटफॉर्म के उपयोग से प्रतिबंधित नहीं होने चाहिए</li>
                </ul>

                <div className="p-4 bg-yellow-50 rounded-xl mt-4">
                  <p className="text-sm text-yellow-700">
                    <strong>नोट:</strong> 13 से 18 वर्ष के उपयोगकर्ता केवल माता-पिता या अभिभावक की 
                    सहमति से ही प्लेटफॉर्म का उपयोग कर सकते हैं।
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Account Registration */}
            <motion.div variants={fadeInUp} id="account" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUsers className="mr-3 text-primary-500" />
                3. खाता पंजीकरण
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  प्लेटफॉर्म की कुछ सुविधाओं का उपयोग करने के लिए, आपको एक खाता पंजीकृत करना होगा। 
                  खाता पंजीकरण के संबंध में:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      आपकी जिम्मेदारी
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>सटीक और पूरी जानकारी प्रदान करें</li>
                      <li>अपने पासवर्ड की गोपनीयता बनाए रखें</li>
                      <li>अपने खाते की सभी गतिविधियों के लिए जिम्मेदार रहें</li>
                      <li>अनधिकृत उपयोग की स्थिति में हमें सूचित करें</li>
                    </ul>
                  </div>

                  <div className="p-4 border border-red-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <FaTimesCircle className="text-red-500 mr-2" />
                      प्रतिबंध
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                      <li>एक से अधिक खाता न बनाएं</li>
                      <li>दूसरे के खाते का उपयोग न करें</li>
                      <li>फर्जी जानकारी न दें</li>
                      <li>खाता बेचें या ट्रांसफर न करें</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Conduct */}
            <motion.div variants={fadeInUp} id="user-conduct" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGavel className="mr-3 text-primary-500" />
                4. उपयोगकर्ता आचरण
              </h2>
              
              <p className="text-gray-700 mb-4">
                प्लेटफॉर्म का उपयोग करते समय, आप निम्नलिखित का पालन करने के लिए सहमत होते हैं:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'कानून का पालन करें',
                  'दूसरों के अधिकारों का सम्मान करें',
                  'सटीक और सच्ची जानकारी प्रदान करें',
                  'गलत या भ्रामक जानकारी न दें',
                  'अन्य उपयोगकर्ताओं को परेशान न करें',
                  'अश्लील या आपत्तिजनक सामग्री न डालें',
                  'स्पैम या अनचाहे संदेश न भेजें',
                  'प्लेटफॉर्म की सुरक्षा भंग न करें'
                ].map((rule, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Content and Posting */}
            <motion.div variants={fadeInUp} id="content" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCopyright className="mr-3 text-primary-500" />
                5. सामग्री और पोस्टिंग
              </h2>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">आपकी सामग्री के अधिकार</h3>
                <p className="text-gray-700">
                  आप अपने द्वारा पोस्ट की गई सामग्री (फोटो, विवरण, टिप्पणियां) के स्वामित्व अधिकार 
                  बनाए रखते हैं। हालांकि, प्लेटफॉर्म पर पोस्ट करके, आप हमें निम्नलिखित लाइसेंस प्रदान करते हैं:
                </p>

                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>आपकी सामग्री को प्रदर्शित करने, वितरित करने का अधिकार</li>
                  <li>सामग्री को प्रचारित करने के लिए उपयोग करने का अधिकार</li>
                  <li>सामग्री को अन्य उपयोगकर्ताओं के साथ साझा करने का अधिकार</li>
                  <li>सामग्री को बैकअप और संग्रहीत करने का अधिकार</li>
                </ul>

                <div className="p-4 bg-blue-50 rounded-xl mt-4">
                  <p className="text-sm text-blue-700">
                    <strong>महत्वपूर्ण:</strong> आप सुनिश्चित करते हैं कि आपके पास अपनी पोस्ट की गई 
                    सामग्री को साझा करने का अधिकार है और यह किसी तीसरे पक्ष के अधिकारों का उल्लंघन नहीं करता है।
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div variants={fadeInUp} id="intellectual-property" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCopyright className="mr-3 text-primary-500" />
                6. बौद्धिक संपदा
              </h2>
              
              <p className="text-gray-700 mb-4">
                प्लेटफॉर्म और उसकी मूल सामग्री, विशेषताएं और कार्यक्षमता नागरिक ऐप की बौद्धिक संपदा हैं और 
                कॉपीराइट, ट्रेडमार्क और अन्य कानूनों द्वारा संरक्षित हैं।
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <FaCopyright className="text-3xl text-primary-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">कॉपीराइट</h4>
                  <p className="text-xs text-gray-600">सभी अधिकार सुरक्षित</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <FaGavel className="text-3xl text-primary-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">ट्रेडमार्क</h4>
                  <p className="text-xs text-gray-600">पंजीकृत ट्रेडमार्क</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <FaShieldAlt className="text-3xl text-primary-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">पेटेंट</h4>
                  <p className="text-xs text-gray-600">लंबित</p>
                </div>
              </div>
            </motion.div>

            {/* Prohibited Activities */}
            <motion.div variants={fadeInUp} id="prohibited-activities" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaBan className="mr-3 text-primary-500" />
                7. निषिद्ध गतिविधियां
              </h2>
              
              <div className="space-y-3">
                {[
                  'अवैध गतिविधियों के लिए प्लेटफॉर्म का उपयोग करना',
                  'दूसरों की निजता का उल्लंघन करना',
                  'हानिकारक कोड या मैलवेयर फैलाना',
                  'सेवा को बाधित करने का प्रयास करना',
                  'अनधिकृत पहुंच प्राप्त करना',
                  'डेटा माइनिंग या स्क्रैपिंग',
                  'फर्जी रिपोर्ट या सूचना बनाना',
                  'दूसरों को धमकाना या परेशान करना',
                  'अश्लील या आपत्तिजनक सामग्री पोस्ट करना',
                  'कॉपीराइट सामग्री का उल्लंघन'
                ].map((activity, index) => (
                  <div key={index} className="flex items-center text-gray-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <FaTimesCircle className="text-red-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Termination */}
            <motion.div variants={fadeInUp} id="termination" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaTimesCircle className="mr-3 text-primary-500" />
                8. खाता समाप्ति
              </h2>
              
              <p className="text-gray-700 mb-4">
                हम निम्नलिखित स्थितियों में आपके खाते को समाप्त या निलंबित कर सकते हैं:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>इन शर्तों का उल्लंघन करने पर</li>
                <li>कानूनी आवश्यकताओं के अनुपालन में</li>
                <li>लंबे समय तक निष्क्रिय रहने पर</li>
                <li>हमारे अनुरोध पर, किसी भी समय, कारण सहित या बिना कारण के</li>
              </ul>

              <p className="text-sm text-gray-600 mt-4">
                समाप्ति पर, प्लेटफॉर्म तक आपकी पहुंच तुरंत समाप्त हो जाएगी।
              </p>
            </motion.div>

            {/* Disclaimers */}
            <motion.div variants={fadeInUp} id="disclaimers" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-3 text-primary-500" />
                9. अस्वीकरण
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  प्लेटफॉर्म "जैसा है" और "जैसा उपलब्ध है" आधार पर प्रदान किया जाता है, 
                  बिना किसी प्रकार की वारंटी के।
                </p>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <strong>हम गारंटी नहीं देते हैं कि:</strong>
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-sm text-gray-600 space-y-1">
                    <li>प्लेटफॉर्म आपकी सभी आवश्यकताओं को पूरा करेगा</li>
                    <li>सेवा निर्बाध, समय पर या त्रुटि-मुक्त होगी</li>
                    <li>परिणाम सटीक या विश्वसनीय होंगे</li>
                    <li>किसी भी त्रुटि को ठीक किया जाएगा</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div variants={fadeInUp} id="limitation" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="mr-3 text-primary-500" />
                10. दायित्व की सीमा
              </h2>
              
              <p className="text-gray-700 mb-4">
                किसी भी स्थिति में नागरिक ऐप, उसके निदेशकों, कर्मचारियों या एजेंटों को किसी भी 
                प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष या परिणामी क्षतियों के लिए उत्तरदायी नहीं ठहराया जाएगा।
              </p>

              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-700">
                  <strong>कानून द्वारा अनुमत अधिकतम सीमा तक,</strong> हमारा कुल दायित्व उस राशि से 
                  अधिक नहीं होगा जो आपने पिछले छह महीनों में हमें भुगतान की है।
                </p>
              </div>
            </motion.div>

            {/* Indemnification */}
            <motion.div variants={fadeInUp} id="indemnification" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGavel className="mr-3 text-primary-500" />
                11. क्षतिपूर्ति
              </h2>
              
              <p className="text-gray-700">
                आप नागरिक ऐप को सभी दावों, देनदारियों, क्षतियों, हानियों और खर्चों से बचाने और 
                क्षतिपूर्ति करने के लिए सहमत हैं, जो निम्न से उत्पन्न होते हैं:
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
                <li>प्लेटफॉर्म के आपके उपयोग से</li>
                <li>इन शर्तों के आपके उल्लंघन से</li>
                <li>आपके द्वारा पोस्ट की गई सामग्री से</li>
                <li>किसी तीसरे पक्ष के अधिकारों के उल्लंघन से</li>
              </ul>
            </motion.div>

            {/* Governing Law */}
            <motion.div variants={fadeInUp} id="governing-law" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaBuilding className="mr-3 text-primary-500" />
                12. शासकीय कानून
              </h2>
              
              <p className="text-gray-700">
                इन शर्तों को भारत के कानूनों के अनुसार शासित और व्याख्या किया जाएगा। 
                इन शर्तों से उत्पन्न होने वाले किसी भी विवाद का समाधान नई दिल्ली, भारत के 
                अदालतों में किया जाएगा।
              </p>

              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>विवाद समाधान:</strong> किसी भी विवाद को पहले अनौपचारिक रूप से हल करने का 
                  प्रयास किया जाएगा। यदि 30 दिनों के भीतर समाधान नहीं होता है, तो इसे मध्यस्थता के 
                  माध्यम से हल किया जा सकता है।
                </p>
              </div>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div variants={fadeInUp} id="changes" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaClock className="mr-3 text-primary-500" />
                13. शर्तों में बदलाव
              </h2>
              
              <p className="text-gray-700 mb-4">
                हम किसी भी समय इन शर्तों को संशोधित या बदलने का अधिकार सुरक्षित रखते हैं। 
                किसी भी बदलाव की स्थिति में, हम इस पेज पर अपडेटेड शर्तें पोस्ट करेंगे और 
                "अंतिम अपडेट" तिथि बदल देंगे।
              </p>

              <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                <FaBell className="text-2xl text-blue-500 mr-3" />
                <p className="text-sm text-blue-700">
                  महत्वपूर्ण बदलावों की स्थिति में हम आपको ईमेल या प्लेटफॉर्म पर नोटिफिकेशन भी भेज सकते हैं।
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                किसी भी बदलाव के बाद प्लेटफॉर्म का उपयोग जारी रखना नई शर्तों की आपकी स्वीकृति माना जाएगा।
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeInUp} id="contact" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaEnvelope className="mr-3 text-primary-500" />
                14. संपर्क करें
              </h2>
              
              <p className="text-gray-700 mb-6">
                अगर आपके पास इन शर्तों के बारे में कोई सवाल हैं, तो कृपया हमसे संपर्क करें:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-primary-500 mr-3" />
                  <span className="text-gray-700">legal@nagarikapp.com</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-primary-500 mr-3" />
                  <span className="text-gray-700">1800-123-4567 (सुबह 10 से शाम 6)</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-primary-500 mr-3" />
                  <span className="text-gray-700">
                    नागरिक ऐप, प्लॉट नंबर 123, सेक्टर 62, नोएडा, उत्तर प्रदेश - 201301
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors group"
                >
                  हमसे संपर्क करें
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Acceptance Checkbox */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="accept"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 mr-3 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="accept" className="text-sm text-gray-700">
                  मैंने इन सेवा की शर्तों को पढ़ लिया है और समझ गया हूं। मैं इन शर्तों से बंधे 
                  होने के लिए सहमत हूं और पुष्टि करता हूं कि मैं प्लेटफॉर्म का उपयोग करने के लिए 
                  पात्र हूं।
                </label>
              </div>

              {accepted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-100 rounded-xl"
                >
                  <p className="text-sm text-green-700 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    धन्यवाद! आपने सेवा की शर्तों को स्वीकार कर लिया है।
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/privacy"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <FaShieldAlt className="text-3xl text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">गोपनीयता नीति</h3>
              <p className="text-sm text-gray-600">हमारी गोपनीयता नीति पढ़ें</p>
            </Link>

            <Link
              to="/faq"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <FaQuestionCircle className="text-3xl text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-sm text-gray-600">अक्सर पूछे जाने वाले सवाल</p>
            </Link>

            <Link
              to="/about"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <FaGlobe className="text-3xl text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">हमारे बारे में</h3>
              <p className="text-sm text-gray-600">नागरिक ऐप के बारे में जानें</p>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
};

export default TermsPage;