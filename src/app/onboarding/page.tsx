'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '../../config/environment';
import Image from 'next/image';

interface OnboardingData {
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
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

const roles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'compliance_manager', label: 'Compliance Manager' },
  { value: 'team_member', label: 'Team Member' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'entity_manager', label: 'Entity Manager' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    countries: [],
    industry: '',
    consent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.company.trim()) newErrors.company = 'Company is required';
    if (!data.role.trim()) newErrors.role = 'Role is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid';
    if (!data.password.trim()) newErrors.password = 'Password is required';
    else if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!data.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    else if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (data.countries.length === 0) newErrors.countries = 'Please select at least one country';
    if (!data.industry) newErrors.industry = 'Industry is required';
    if (!data.consent) newErrors.consent = 'Consent is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      // Use the separate first and last name fields
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();

      // First, create the organization
      const orgResponse = await fetch(`${env.apiUrl}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.company,
          industry: data.industry,
          country: data.countries[0] || 'Kenya', // Use first selected country
        }),
      });

      if (!orgResponse.ok) {
        throw new Error('Failed to create organization');
      }

      const orgData = await orgResponse.json();

      // Then, create the user
      const userResponse = await fetch(`${env.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: data.email,
          password: data.password,
          organizationId: orgData.organization.id,
          role: data.role,
          department: roles.find(r => r.value === data.role)?.label || data.role,
          jobTitle: roles.find(r => r.value === data.role)?.label || data.role,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'Failed to create user account');
      }

      // Success! Redirect to login page
      router.push('/login?message=Account created successfully! Please sign in.');
    } catch (error) {
      console.error('Onboarding error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
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
              Let&apos;s get you started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                What&apos;s your first name?
              </label>
              <input
                type="text"
                value={data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                What&apos;s your last name?
              </label>
              <input
                type="text"
                value={data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
                💼 What&apos;s your role there?
              </label>
              <p className="text-sm text-gray-500 mb-3">This helps us tailor our communications</p>
              <select
                value={data.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.role ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                📧 Your work email address
              </label>
              <p className="text-sm text-gray-500 mb-3">We&apos;ll send updates and early access invitations here</p>
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                🔐 Create a password
              </label>
              <p className="text-sm text-gray-500 mb-3">Choose a strong password for your account</p>
              <input
                type="password"
                value={data.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.password ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                🔐 Confirm your password
              </label>
              <input
                type="password"
                value={data.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-[#41c3d6]/30 focus:border-[#41c3d6] transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 hover:border-[#41c3d6]/50'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Countries */}
            <div>
              <label className="block text-sm font-semibold text-[#26558e] mb-2">
                Which country(ies) are you based in?
              </label>
              <p className="text-sm text-gray-500 mb-3">We&apos;re building compliance tools globally</p>
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

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 text-sm">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#26558e] to-[#41c3d6] text-white rounded-xl font-semibold text-lg hover:from-[#1e4470] hover:to-[#2dd4da] hover:shadow-2xl hover:shadow-[#41c3d6]/25 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}



