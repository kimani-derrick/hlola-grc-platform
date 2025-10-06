'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OnboardingData {
  name: string;
  company: string;
  role: string;
  email: string;
  countries: string[];
  industry: string;
  consent: boolean;
}

const countries = [
  'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Egypt', 'Morocco', 'Tunisia', 'Algeria',
  'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Botswana', 'Namibia', 'Zambia', 'Zimbabwe',
  'Mauritius', 'Seychelles', 'Senegal', 'Ivory Coast', 'Cameroon', 'Angola', 'Mozambique',
  'Madagascar', 'Malawi', 'Burkina Faso', 'Mali', 'Niger', 'Chad', 'Central African Republic',
  'Democratic Republic of Congo', 'Republic of Congo', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe',
  'Guinea', 'Guinea-Bissau', 'Sierra Leone', 'Liberia', 'Gambia', 'Cape Verde', 'Comoros',
  'Djibouti', 'Eritrea', 'Somalia', 'Sudan', 'South Sudan', 'Libya',
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
  'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
  'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia',
  'Estonia', 'Latvia', 'Lithuania', 'Portugal', 'Greece', 'Cyprus', 'Malta', 'Ireland',
  'Luxembourg', 'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Hong Kong',
  'India', 'China', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay',
  'Other'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Government',
  'Non-profit', 'Real Estate', 'Transportation', 'Energy', 'Telecommunications', 'Media',
  'Entertainment', 'Sports', 'Food & Beverage', 'Fashion', 'Automotive', 'Aerospace',
  'Pharmaceuticals', 'Biotechnology', 'Consulting', 'Legal', 'Accounting', 'Insurance',
  'Banking', 'Investment', 'Venture Capital', 'Private Equity', 'Cryptocurrency', 'Blockchain',
  'E-commerce', 'SaaS', 'Mobile Apps', 'Gaming', 'Social Media', 'Content Creation',
  'Marketing', 'Advertising', 'Public Relations', 'Human Resources', 'Recruitment',
  'Logistics', 'Supply Chain', 'Agriculture', 'Mining', 'Construction', 'Architecture',
  'Engineering', 'Research', 'Development', 'Other'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>({
    name: '',
    company: '',
    role: '',
    email: '',
    countries: [],
    industry: '',
    consent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = 'Name is required';
    if (!data.company.trim()) newErrors.company = 'Company is required';
    if (!data.role.trim()) newErrors.role = 'Role is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid';
    if (data.countries.length === 0) newErrors.countries = 'Please select at least one country';
    if (!data.industry) newErrors.industry = 'Industry is required';
    if (!data.consent) newErrors.consent = 'Consent is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save onboarding data
      localStorage.setItem('onboardingData', JSON.stringify(data));
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleInputChange = (field: keyof OnboardingData, value: string | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCountryToggle = (country: string) => {
    setData(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
    if (errors.countries) {
      setErrors(prev => ({ ...prev, countries: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#41c3d6] rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#26558e] rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-40 left-1/2 w-72 h-72 bg-gradient-to-r from-[#41c3d6] to-[#26558e] rounded-full blur-2xl opacity-10"></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#41c3d6]/10 via-[#26558e]/15 to-[#41c3d6]/10"></div>
        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/brand/Hlola Full Color.svg" alt="hlola" width={110} height={28} className="h-6 w-auto" />
            </div>
            <a href="/login" className="text-sm text-[#26558e] hover:text-[#1e4470] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[#26558e]/10">
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Enhanced brand gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#41c3d6]/15 via-[#26558e]/10 to-[#41c3d6]/20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#26558e]/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#26558e] to-[#41c3d6] bg-clip-text text-transparent mb-2">
              Welcome to Hlola
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              Let's get you started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                🏢 What company do you work for?
              </label>
              <input
                type="text"
                value={data.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.company ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your company name"
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                💼 What's your role there?
              </label>
              <p className="text-sm text-gray-500 mb-3">This helps us tailor our communications</p>
              <input
                type="text"
                value={data.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.role ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="e.g., Data Protection Officer, Compliance Manager, CEO"
              />
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                📧 Your work email address
              </label>
              <p className="text-sm text-gray-500 mb-3">We'll send updates and early access invitations here</p>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your work email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Countries */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                Which country(ies) are you based in?
              </label>
              <p className="text-sm text-gray-500 mb-3">We're building compliance tools globally</p>
              <div className="max-h-48 overflow-y-auto border-2 border-gray-300 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white hover:border-[#41c3d6]/50 transition-all duration-200">
                <div className="grid grid-cols-2 gap-2">
                  {countries.map(country => (
                    <label key={country} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.countries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 text-[#26558e] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#41c3d6]/30 hover:border-[#41c3d6]/50 transition-all duration-200"
                      />
                      <span className="text-sm text-gray-900">{country}</span>
                    </label>
                  ))}
                </div>
              </div>
              {errors.countries && <p className="text-red-500 text-sm mt-1">{errors.countries}</p>}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                🏭 What industry is your company in?
              </label>
              <p className="text-sm text-gray-500 mb-3">Different industries have unique compliance needs</p>
              <select
                value={data.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.industry ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
            </div>

            {/* Consent */}
            <div>
              <label className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-[#41c3d6]/5 hover:to-[#26558e]/5 hover:border-[#41c3d6]/30 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={data.consent}
                  onChange={(e) => handleInputChange('consent', e.target.checked)}
                  className="w-4 h-4 text-[#26558e] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#41c3d6]/30 hover:border-[#41c3d6]/50 mt-1 transition-all duration-200"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Privacy & Communication Consent</span>
                  <p className="text-sm text-gray-500 mt-1">We need your consent to contact you about hlola.io</p>
                </div>
              </label>
              {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-[#26558e] to-[#41c3d6] text-white rounded-xl font-semibold text-lg hover:from-[#1e4470] hover:to-[#2dd4da] hover:shadow-2xl hover:shadow-[#41c3d6]/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}



