import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt,
  FaLock,
  FaUserSecret,
  FaCookieBite,
  FaDatabase,
  FaEnvelope,
  FaFileSignature,
  FaHandsHelping,
  FaChild,
  FaGlobe,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaUserLock,
  FaServer,
  FaCreditCard,
  FaMobile,
  FaCloud,
  FaBell,
  FaCamera ,
  FaChartLine ,
  FaMapMarkerAlt ,
  FaQuestionCircle 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  const [lastUpdated] = useState('15 मार्च 2026');
  const [effectiveDate] = useState('1 अप्रैल 2026');

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
    { id: 'introduction', title: 'परिचय', icon: FaFileSignature },
    { id: 'information-collect', title: 'हम क्या जानकारी इकट्ठा करते हैं', icon: FaDatabase },
    { id: 'information-use', title: 'जानकारी का उपयोग कैसे करते हैं', icon: FaHandsHelping },
    { id: 'information-share', title: 'जानकारी साझा करना', icon: FaGlobe },
    { id: 'cookies', title: 'कुकीज़ और ट्रैकिंग', icon: FaCookieBite },
    { id: 'data-security', title: 'डेटा सुरक्षा', icon: FaLock },
    { id: 'user-rights', title: 'आपके अधिकार', icon: FaUserSecret },
    { id: 'children-privacy', title: 'बच्चों की गोपनीयता', icon: FaChild },
    { id: 'policy-changes', title: 'नीति में बदलाव', icon: FaHistory },
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
              <FaShieldAlt className="text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              गोपनीयता नीति
            </h1>
            <p className="text-xl mb-4 text-primary-50">
              आपकी निजता हमारी प्राथमिकता है
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
                हम आपकी निजता को गंभीरता से लेते हैं। यह नीति बताती है कि हम आपकी जानकारी कैसे इकट्ठा करते हैं, 
                उपयोग करते हैं और सुरक्षित रखते हैं। कृपया पूरी नीति पढ़ें। किसी भी सवाल के लिए हमसे संपर्क करें।
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
                <FaFileSignature className="mr-2 text-primary-500" />
                अनुक्रमणिका
              </h3>
              <ul className="space-y-2">
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
                    <FaCloud className="mr-2" />
                    PDF डाउनलोड करें
                  </button>
                  <button className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center">
                    <FaFileSignature className="mr-2" />
                    प्रिंट करें
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Policy Content */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-3 space-y-8"
          >
            {/* Introduction */}
            <motion.div variants={fadeInUp} id="introduction" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaFileSignature className="mr-3 text-primary-500" />
                1. परिचय
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  नागरिक ऐप ("हम", "हमारा", "हमें") आपकी निजता का सम्मान करता है और आपकी व्यक्तिगत जानकारी 
                  की सुरक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट और 
                  मोबाइल ऐप ("प्लेटफॉर्म") का उपयोग करते हैं तो हम आपकी जानकारी कैसे इकट्ठा करते हैं, 
                  उपयोग करते हैं और सुरक्षित रखते हैं।
                </p>
                <p>
                  इस प्लेटफॉर्म का उपयोग करके, आप इस गोपनीयता नीति के तहत जानकारी के संग्रह और उपयोग से 
                  सहमत होते हैं। जब तक अन्यथा परिभाषित नहीं किया गया है, इस गोपनीयता नीति में उपयोग किए 
                  गए शब्दों के वही अर्थ हैं जो हमारी सेवा की शर्तों में हैं।
                </p>
              </div>
            </motion.div>

            {/* Information We Collect */}
            <motion.div variants={fadeInUp} id="information-collect" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaDatabase className="mr-3 text-primary-500" />
                2. हम क्या जानकारी इकट्ठा करते हैं
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FaUserLock className="mr-2 text-accent-500" />
                    व्यक्तिगत जानकारी
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>नाम, ईमेल पता, फोन नंबर (खाता बनाते समय)</li>
                    <li>प्रोफाइल फोटो (वैकल्पिक)</li>
                    <li>लोकेशन डेटा (समस्या रिपोर्ट करते समय)</li>
                    <li>डिवाइस की जानकारी (IP पता, ब्राउज़र प्रकार, OS)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FaMobile className="mr-2 text-accent-500" />
                    स्वचालित रूप से इकट्ठा की गई जानकारी
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>लॉग डेटा (आपके द्वारा देखे गए पेज, क्लिक)</li>
                    <li>उपयोग पैटर्न और प्राथमिकताएं</li>
                    <li>कुकीज़ और ट्रैकिंग तकनीक</li>
                    <li>ऐप उपयोग आंकड़े</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FaCamera className="mr-2 text-accent-500" />
                    समस्या रिपोर्ट से जानकारी
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>अपलोड की गई तस्वीरें और वीडियो</li>
                    <li>विवरण और टिप्पणियां</li>
                    <li>जीपीएस लोकेशन</li>
                    <li>रिपोर्ट की गई समस्या का प्रकार</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How We Use Information */}
            <motion.div variants={fadeInUp} id="information-use" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaHandsHelping className="mr-3 text-primary-500" />
                3. जानकारी का उपयोग कैसे करते हैं
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: FaCheckCircle,
                    title: 'सेवा प्रदान करना',
                    desc: 'आपकी रिपोर्ट प्रोसेस करना और समस्या का समाधान करना'
                  },
                  {
                    icon: FaBell,
                    title: 'सूचनाएं भेजना',
                    desc: 'रिपोर्ट स्टेटस, अपडेट और महत्वपूर्ण जानकारी'
                  },
                  {
                    icon: FaShieldAlt,
                    title: 'सुरक्षा',
                    desc: 'प्लेटफॉर्म को सुरक्षित रखना और धोखाधड़ी रोकना'
                  },
                  {
                    icon: FaChartLine,
                    title: 'सुधार',
                    desc: 'सेवाओं को बेहतर बनाना और नई सुविधाएं जोड़ना'
                  },
                  {
                    icon: FaUserSecret,
                    title: 'अनुकूलन',
                    desc: 'आपकी प्राथमिकताओं के अनुसार अनुभव को निजीकृत करना'
                  },
                  {
                    icon: FaGlobe,
                    title: 'विश्लेषण',
                    desc: 'उपयोग पैटर्न का विश्लेषण और रिपोर्ट तैयार करना'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <item.icon className="text-2xl text-primary-500 mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Information Sharing */}
            <motion.div variants={fadeInUp} id="information-share" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGlobe className="mr-3 text-primary-500" />
                4. जानकारी साझा करना
              </h2>
              
              <p className="text-gray-700 mb-4">
                हम आपकी व्यक्तिगत जानकारी निम्नलिखित स्थितियों में साझा कर सकते हैं:
              </p>

              <div className="space-y-4">
                <div className="flex items-start p-4 bg-green-50 rounded-xl">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">प्रशासन के साथ</h4>
                    <p className="text-sm text-gray-600">
                      आपकी रिपोर्ट संबंधित सरकारी विभागों और प्रशासनिक अधिकारियों को भेजी जाती है
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-blue-50 rounded-xl">
                  <FaCheckCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">सेवा प्रदाता</h4>
                    <p className="text-sm text-gray-600">
                      तीसरे पक्ष की सेवाएं (जैसे क्लाउड स्टोरेज, एनालिटिक्स) जो हमारी मदद करती हैं
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-yellow-50 rounded-xl">
                  <FaCheckCircle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">कानूनी आवश्यकता</h4>
                    <p className="text-sm text-gray-600">
                      अगर कानून, अदालत या सरकारी आदेश के तहत जानकारी देना जरूरी हो
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-red-50 rounded-xl">
                <p className="text-sm text-red-700">
                  <strong>महत्वपूर्ण:</strong> हम आपकी व्यक्तिगत जानकारी कभी भी तीसरे पक्ष को मार्केटिंग 
                  या विज्ञापन के लिए नहीं बेचते हैं।
                </p>
              </div>
            </motion.div>

            {/* Cookies and Tracking */}
            <motion.div variants={fadeInUp} id="cookies" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCookieBite className="mr-3 text-primary-500" />
                5. कुकीज़ और ट्रैकिंग
              </h2>
              
              <p className="text-gray-700 mb-4">
                हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ और समान ट्रैकिंग तकनीकों का उपयोग करते हैं।
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">कुकी प्रकार</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">उद्देश्य</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">अवधि</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">आवश्यक कुकीज़</td>
                      <td className="px-6 py-4 text-sm text-gray-600">लॉगिन, सुरक्षा, बुनियादी कार्य</td>
                      <td className="px-6 py-4 text-sm text-gray-600">सत्र अवधि</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">प्रदर्शन कुकीज़</td>
                      <td className="px-6 py-4 text-sm text-gray-600">उपयोग विश्लेषण, साइट सुधार</td>
                      <td className="px-6 py-4 text-sm text-gray-600">2 वर्ष</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">कार्यात्मक कुकीज़</td>
                      <td className="px-6 py-4 text-sm text-gray-600">प्राथमिकताएं याद रखना</td>
                      <td className="px-6 py-4 text-sm text-gray-600">1 वर्ष</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                आप अपनी ब्राउज़र सेटिंग्स में कुकीज़ को अक्षम कर सकते हैं, लेकिन इससे कुछ सुविधाएं प्रभावित हो सकती हैं।
              </p>
            </motion.div>

            {/* Data Security */}
            <motion.div variants={fadeInUp} id="data-security" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaLock className="mr-3 text-primary-500" />
                6. डेटा सुरक्षा
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 border border-green-200 rounded-xl">
                  <FaServer className="text-2xl text-green-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-2">एन्क्रिप्शन</h4>
                  <p className="text-sm text-gray-600">
                    सभी डेटा SSL/TLS प्रोटोकॉल से एन्क्रिप्टेड है
                  </p>
                </div>
                
                <div className="p-4 border border-blue-200 rounded-xl">
                  <FaShieldAlt className="text-2xl text-blue-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-2">फायरवॉल</h4>
                  <p className="text-sm text-gray-600">
                    एडवांस फायरवॉल और सुरक्षा प्रोटोकॉल
                  </p>
                </div>
                
                <div className="p-4 border border-purple-200 rounded-xl">
                  <FaHistory className="text-2xl text-purple-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-2">बैकअप</h4>
                  <p className="text-sm text-gray-600">
                    नियमित बैकअप और डिजास्टर रिकवरी
                  </p>
                </div>
                
                <div className="p-4 border border-orange-200 rounded-xl">
                  <FaUserSecret className="text-2xl text-orange-500 mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-2">एक्सेस कंट्रोल</h4>
                  <p className="text-sm text-gray-600">
                    सख्त पहुंच नियंत्रण और प्रमाणीकरण
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                हम आपके डेटा की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं। 
                हालांकि, कोई भी ऑनलाइन ट्रांसमिशन 100% सुरक्षित नहीं है।
              </p>
            </motion.div>

            {/* Your Rights */}
            <motion.div variants={fadeInUp} id="user-rights" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUserSecret className="mr-3 text-primary-500" />
                7. आपके अधिकार
              </h2>
              
              <div className="space-y-3">
                {[
                  'अपनी व्यक्तिगत जानकारी देखने का अधिकार',
                  'गलत जानकारी सुधारने का अधिकार',
                  'जानकारी हटाने का अधिकार (भूल जाने का अधिकार)',
                  'डेटा प्रोसेसिंग पर आपत्ति करने का अधिकार',
                  'डेटा एक्सपोर्ट करने का अधिकार',
                  'सहमति वापस लेने का अधिकार'
                ].map((right, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                इन अधिकारों का उपयोग करने के लिए कृपया हमसे संपर्क करें। हम 30 दिनों के भीतर जवाब देंगे।
              </p>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div variants={fadeInUp} id="children-privacy" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaChild className="mr-3 text-primary-500" />
                8. बच्चों की गोपनीयता
              </h2>
              
              <p className="text-gray-700 mb-4">
                हमारा प्लेटफॉर्म 13 वर्ष से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर 13 वर्ष से 
                कम उम्र के बच्चों से व्यक्तिगत जानकारी नहीं इकट्ठा करते हैं।
              </p>
              
              <div className="p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-yellow-700">
                  <strong>अगर आपको लगता है कि हमने गलती से किसी बच्चे की जानकारी इकट्ठा कर ली है,</strong> 
                  तो कृपया तुरंत हमसे संपर्क करें। हम ऐसी जानकारी तुरंत हटा देंगे।
                </p>
              </div>
            </motion.div>

            {/* Policy Changes */}
            <motion.div variants={fadeInUp} id="policy-changes" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaHistory className="mr-3 text-primary-500" />
                9. नीति में बदलाव
              </h2>
              
              <p className="text-gray-700 mb-4">
                हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। किसी भी बदलाव की स्थिति में, 
                हम इस पेज पर अपडेटेड नीति पोस्ट करेंगे और "अंतिम अपडेट" तिथि बदल देंगे।
              </p>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <FaBell className="text-2xl text-primary-500 mr-3" />
                <p className="text-sm text-gray-700">
                  महत्वपूर्ण बदलावों की स्थिति में हम आपको ईमेल या प्लेटफॉर्म पर नोटिफिकेशन भी भेज सकते हैं।
                </p>
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeInUp} id="contact" className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaEnvelope className="mr-3 text-primary-500" />
                10. संपर्क करें
              </h2>
              
              <p className="text-gray-700 mb-6">
                अगर आपके पास इस गोपनीयता नीति के बारे में कोई सवाल हैं, तो कृपया हमसे संपर्क करें:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="text-primary-500 mr-3" />
                  <span className="text-gray-700">privacy@nagarikapp.com</span>
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

            {/* Consent Acknowledgement */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 text-2xl mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">सहमति</h3>
                  <p className="text-sm text-gray-600">
                    इस प्लेटफॉर्म का उपयोग करके, आप इस गोपनीयता नीति से सहमत होते हैं और 
                    आपकी जानकारी के संग्रह और उपयोग के लिए सहमति देते हैं।
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/terms"
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow group"
            >
              <FaFileSignature className="text-3xl text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">सेवा की शर्तें</h3>
              <p className="text-sm text-gray-600">हमारे प्लेटफॉर्म के उपयोग की शर्तें पढ़ें</p>
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

export default PrivacyPage;