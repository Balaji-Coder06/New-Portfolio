import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Send, CheckCircle2, Copy, Check, MessageSquare, MapPin, Sparkles, AlertCircle, ArrowUpRight, Clock, User, MessageCircle, Info } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Magnetic from '../ui/Magnetic';
import { personalData, socialLinks } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, WhatsAppIcon } from '../ui/SocialIcons';

const socialIconMap = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Mail: Mail,
  MessageSquare: WhatsAppIcon,
  Instagram: InstagramIcon,
  Twitter: TwitterIcon
};

// Default fallback EmailJS credentials
const DEFAULT_SERVICE_ID = 'service_yrjs0qe';
const DEFAULT_TEMPLATE_ID = 'template_mcg259s';
const DEFAULT_PUBLIC_KEY = 'b3IfTAebHMVrhKISN';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  const showToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5500);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject line is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct form errors before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const fullTimestamp = `${formattedDate} at ${formattedTime}`;

    // Comprehensive parameter map matching any EmailJS template configuration
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      name: formData.name,
      email: formData.email,
      user_name: formData.name,
      user_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: formattedTime,
      date: formattedDate,
      sent_at: fullTimestamp,
      submitted_at: fullTimestamp,
      timestamp: fullTimestamp,
      current_time: formattedTime,
      reply_to: formData.email,
      to_name: 'S Balaji',
      to_email: 'sbalaji272006@gmail.com'
    };

    try {
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('EmailJS Success:', response);

      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('✨ Message delivered directly to sbalaji272006@gmail.com!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('EmailJS Error details:', err);
      setIsSubmitting(false);

      const errText = err?.text || err?.message || '';

      if (errText.includes('template ID not found') || errText.includes('Template ID')) {
        showToast('EmailJS Error: Template ID not found in EmailJS account. Please verify your Template ID in dashboard.emailjs.com/admin/templates', 'error');
      } else if (errText.includes('public key') || errText.includes('Public Key')) {
        showToast('EmailJS Error: Invalid Public Key. Please check your EmailJS account settings.', 'error');
      } else {
        showToast(`Transmission Error: ${errText || 'Failed to send message via EmailJS.'}`, 'error');
      }
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sbalaji272006@gmail.com');
    setCopied(true);
    showToast('Email address copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-transparent">
      
      {/* Dynamic Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 glass-card px-5 py-4 rounded-2xl border shadow-2xl flex items-start gap-3 max-w-md text-xs font-mono ${
              toastType === 'error'
                ? 'border-red-500/50 shadow-red-500/20 text-red-300 bg-red-950/90'
                : 'border-emerald-500/40 shadow-emerald-500/20 text-emerald-300 bg-neutral-900/90'
            }`}
          >
            {toastType === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Gradient Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Get in Touch"
          title="Let's Build Something"
          highlight="Extraordinary Together"
          subtitle="Have a project in mind, an internship opportunity, or want to connect? Send a direct message or copy my email."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Social Matrix */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 sm:p-8 space-y-6">
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">Direct Email</span>
                    <span className="text-base font-bold text-neutral-100 font-mono">sbalaji272006@gmail.com</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    onClick={handleCopyEmail}
                    variant="primary"
                    size="sm"
                    icon={copied ? Check : Copy}
                  >
                    {copied ? 'Copied!' : 'Copy Email Address'}
                  </Button>

                  <Button
                    href="mailto:sbalaji272006@gmail.com"
                    variant="outline"
                    size="sm"
                    icon={ArrowUpRight}
                    iconPosition="right"
                  >
                    Open Mail App
                  </Button>
                </div>

                {/* Status Badges */}
                <div className="pt-6 border-t border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Availability:
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">{personalData.status}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Response Time:
                    </span>
                    <span className="font-mono text-neutral-200">Within 24 Hours</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-violet-400" />
                      Location:
                    </span>
                    <span className="font-mono text-neutral-200">{personalData.location}</span>
                  </div>
                </div>

              </Card>
            </motion.div>

            {/* Social Links Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-base font-bold text-neutral-200 mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Connect Across Platforms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((social) => {
                  const IconComp = socialIconMap[social.icon] || Mail;
                  return (
                    <Magnetic key={social.name} strength={0.15}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-2xl glass-card border border-neutral-800/80 hover:border-emerald-500/40 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors block">
                              {social.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {social.handle}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </Magnetic>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Premium Animated Glass Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Card className="p-6 sm:p-10 relative overflow-hidden">
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-neutral-100 mb-1 flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" />
                  Send a Direct Message
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Fill out the form below to deliver a message directly to sbalaji272006@gmail.com.
                </p>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-semibold">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Vance"
                        className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {errors.name && (
                        <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {errors.name && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-semibold">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500'
                        }`}
                      />
                      {errors.email && (
                        <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {errors.email && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-semibold">
                    Subject / Project Opportunity <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Engineer Role / Project Consultation"
                      className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors ${
                        errors.subject ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500'
                      }`}
                    />
                    {errors.subject && (
                      <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.subject && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.subject}</p>}
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5 font-semibold">
                    Message Details <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share project details, timelines, or role descriptions..."
                      className={`w-full bg-neutral-900/90 border rounded-xl px-4 py-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors resize-none ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-emerald-500'
                      }`}
                    />
                    {errors.message && (
                      <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-4" />
                    )}
                  </div>
                  {errors.message && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.message}</p>}
                </div>

                {/* Animated Submit Button */}
                <div className="pt-2">
                  <Magnetic strength={0.25} className="w-full block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-4 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                        isSuccess
                          ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/10 hover:shadow-emerald-500/25 scale-[1.01]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="whitespace-nowrap">Transmitting to Inbox...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-neutral-950 shrink-0" />
                          <span className="whitespace-nowrap">Message Delivered Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-neutral-950 shrink-0" />
                          <span className="whitespace-nowrap">Send Message Now</span>
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>

                {/* Direct Delivery Notice */}
                <p className="text-[11px] font-mono text-neutral-400 text-center pt-2 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct EmailJS delivery to <strong>sbalaji272006@gmail.com</strong>.</span>
                </p>

              </form>

            </Card>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
