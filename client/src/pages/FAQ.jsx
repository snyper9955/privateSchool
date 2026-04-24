import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20' : 'hover:border-emerald-200'}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-neutral-400  transition-colors"
      >
        <span className="text-lg font-semibold text-neutral-7=600 pr-8">{question}</span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-100 text-emerald-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 text-slate-600 leading-relaxed bg-green-200  font-bold">
          <div className="h-px w-full bg-slate-100 mb-4" />
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Aap kis exam ke liye coaching dete hain?",
      answer: "CBSE Class VI to XII ke sabhi subjects ke liye coaching provides karte hain."
    },
    {
      question: "Class 10th result?",
      answer: "district topper"
    },
    {
      question: "Demo class available hai kya?",
      answer: "Haan, hum naye students ke liye 3 din ki bilkul FREE demo classes pradan karte hain taaki aap hamari teaching quality ko samajh saken aur phir admission ka faisla le saken."
    },
    {
      question: "Online + offline dono hai kya?",
      answer: "offline only + online (upcoming)"
    },
    {
      question: "Batch size kitna hota hai? ",
      answer: "Hum batch size ko hamesha limited rakhte hain (lagbhag 40-50 students) taaki har student par personal attention diya ja sake aur sabke sawalon ka answer easily mil sake."
    },
    {
      question: "Study material provide karte hain?",
      answer: "Haan, hum apne sabhi students ko comprehensive study material, printed notes, aur daily practice papers pradan karte hain jo latest exam patterns aur syllabus par aadharit hote hain."
    },
    {
      question: "Test series included hai kya?",
      answer: "Ji haan, hamare sabhi courses mein regular mock tests aur offline test series shamil hoti hain. Hum har hafte (weekly) test lete hain taaki aap apni progress ko track kar saken."
    },
  
    {
      question: "Admission ka process kya hai?",
      answer: "Visit our center mourya academy or contact us on 8809193796."
    }
  ];

  return (
    <div className="min-h-screen  pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-200 text-green-950 text-sm font-bold mb-6 border border-green-600">
            <HelpCircle className="w-4 h-4" />
            <span>KUCH PUCHNA HAI?</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h1>
     
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Abhi bhi sawal hain?</h2>
              <p className="text-slate-300 mb-8">
                Hamari team aapki sahayata ke liye hamesha taiyar hai. Aap hamein niche diye gaye contact options se kabhi bhi sampark kar sakte hain.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Hamein Call Karein</p>
                    <p className="text-lg font-semibold">+91 88091 93796</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email Karein</p>
                    <p className="text-lg font-semibold">mouryadbg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-purple-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Hamara Pata</p>
                    <p className="text-lg font-semibold">Shivdhara Chowk, Darbhanga, Bihar</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-6">Hamse Judiyiye</h3>
              <div className="space-y-4">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
                <button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 rounded-2xl transition-all active:scale-95">
                  Admission Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
