import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Framework } from '../types/frameworks';
import { useAuth } from '../context/AuthContext';

interface UseFrameworksDataResult {
  frameworks: Framework[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFrameworksData = (): UseFrameworksDataResult => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFrameworks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getFrameworks();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Transform API data to match our Framework interface
        const transformedFrameworks: Framework[] = response.data.map((apiFramework: any) => ({
          id: apiFramework.id,
          name: apiFramework.name,
          description: apiFramework.description,
          status: apiFramework.status as 'active' | 'draft' | 'inactive' | 'pending',
          compliance: 0, // We'll calculate this based on assigned frameworks
          controls: apiFramework.requirements_count || 0,
          lastUpdated: apiFramework.updated_at ? new Date(apiFramework.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          region: apiFramework.region || 'Global',
          category: apiFramework.category as 'Privacy' | 'Security' | 'Compliance' | 'Risk',
          icon: getCountryIcon(apiFramework.country, apiFramework.region),
          color: getColorByRegion(apiFramework.region),
          businessImpact: {
            penaltyAmount: apiFramework.max_fine_amount || '0',
            penaltyCurrency: apiFramework.max_fine_currency || 'USD',
            businessBenefits: getBusinessBenefits(apiFramework.region, apiFramework.category),
            marketAccess: getMarketAccess(apiFramework.region, apiFramework.country),
            competitiveAdvantages: getCompetitiveAdvantages(apiFramework.region, apiFramework.category)
          },
          tasks: [], // We'll fetch tasks separately if needed
          complianceDeadline: apiFramework.compliance_deadline || 'TBD',
          priority: apiFramework.priority as 'high' | 'medium' | 'low',
          riskLevel: apiFramework.risk_level as 'low' | 'medium' | 'high' | 'critical',
          type: apiFramework.type === 'Legal' ? 'Legal' : apiFramework.type === 'Standards' ? 'Standards' : 'Other',
          requirements: apiFramework.requirements_count || 0
        }));

        setFrameworks(transformedFrameworks);
      } else {
        setFrameworks([]);
        setError(response.error || 'Failed to fetch frameworks');
      }
    } catch (err) {
      console.error('Error fetching frameworks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch frameworks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameworks();
  }, []);

  return {
    frameworks,
    isLoading,
    error,
    refetch: fetchFrameworks
  };
};

// Helper functions to transform API data
const getCountryIcon = (country: string | null, region: string): string => {
  if (!country) {
    // Return region-based icons for global frameworks
    switch (region) {
      case 'Global': return '🌍';
      case 'Europe': return '🇪🇺';
      case 'Americas': return '🇺🇸';
      case 'Africa': return '🇦🇫';
      default: return '🌍';
    }
  }

  // Country flag mapping
  const countryFlags: { [key: string]: string } = {
    'Kenya': '🇰🇪',
    'Ghana': '🇬🇭',
    'Nigeria': '🇳🇬',
    'South Africa': '🇿🇦',
    'Uganda': '🇺🇬',
    'Ethiopia': '🇪🇹',
    'Rwanda': '🇷🇼',
    'Tanzania': '🇹🇿',
    'Morocco': '🇲🇦',
    'Egypt': '🇪🇬',
    'Mauritius': '🇲🇺',
    'Botswana': '🇧🇼',
    'Senegal': '🇸🇳',
    'Ivory Coast': '🇨🇮',
    'Burkina Faso': '🇧🇫',
    'Mali': '🇲🇱',
    'Niger': '🇳🇪',
    'Chad': '🇹🇩',
    'Cameroon': '🇨🇲',
    'Central African Republic': '🇨🇫',
    'Equatorial Guinea': '🇬🇶',
    'Gabon': '🇬🇦',
    'Algeria': '🇩🇿',
    'Tunisia': '🇹🇳',
    'Libya': '🇱🇾',
    'Sudan': '🇸🇩',
    'Zambia': '🇿🇲',
    'Zimbabwe': '🇿🇼',
    'Malawi': '🇲🇼',
    'Mozambique': '🇲🇿',
    'Angola': '🇦🇴',
    'Namibia': '🇳🇦',
    'United States': '🇺🇸',
    'European Union': '🇪🇺',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Peru': '🇵🇪',
    'Venezuela': '🇻🇪',
    'Ecuador': '🇪🇨',
    'Bolivia': '🇧🇴',
    'Paraguay': '🇵🇾',
    'Uruguay': '🇺🇾',
    'Guyana': '🇬🇾',
    'Suriname': '🇸🇷',
    'French Guiana': '🇬🇫',
    'Cabo Verde': '🇨🇻',
    'Comoros': '🇰🇲',
    'Congo': '🇨🇬',
    'Democratic Republic of Congo': '🇨🇩',
    'Cote d\'Ivoire': '🇨🇮',
    'Djibouti': '🇩🇯',
    'Eritrea': '🇪🇷',
    'Eswatini': '🇸🇿',
    'Guinea': '🇬🇳',
    'Guinea-Bissau': '🇬🇼',
    'Lesotho': '🇱🇸',
    'Liberia': '🇱🇷',
    'Madagascar': '🇲🇬',
    'Mauritania': '🇲🇷',
    'Sao Tome and Principe': '🇸🇹',
    'Sierra Leone': '🇸🇱',
    'Somalia': '🇸🇴',
    'South Sudan': '🇸🇸',
    'Togo': '🇹🇬',
    // Missing African countries commonly used in our datasets
    'Seychelles': '🇸🇨',
    'Gambia': '🇬🇲',
    'Benin': '🇧🇯',
    'Burundi': '🇧🇮'
  };

  return countryFlags[country] || '🌍';
};

const getColorByRegion = (region: string): string => {
  switch (region) {
    case 'Africa': return 'bg-blue-600';
    case 'Europe': return 'bg-blue-500';
    case 'Americas': return 'bg-green-600';
    case 'Global': return 'bg-purple-600';
    default: return 'bg-gray-600';
  }
};

const getBusinessBenefits = (region: string, category: string): string[] => {
  const baseBenefits = [
    'Enhanced business credibility',
    'Customer trust and confidence',
    'Competitive advantage in market'
  ];

  if (region === 'Africa') {
    return [
      ...baseBenefits,
      'Access to African markets',
      'Government contract eligibility',
      'Regional compliance advantage'
    ];
  }

  if (category === 'Privacy') {
    return [
      ...baseBenefits,
      'Data protection compliance',
      'Reduced regulatory risks',
      'Enhanced data governance'
    ];
  }

  return baseBenefits;
};

const getMarketAccess = (region: string, country: string | null): string[] => {
  if (region === 'Africa') {
    return [
      'African Union market access',
      'Regional economic communities',
      'Government procurement opportunities',
      'Financial services partnerships'
    ];
  }

  if (country === 'European Union') {
    return [
      'EU single market access',
      'GDPR compliance advantage',
      'International partnerships',
      'Cross-border data flows'
    ];
  }

  return [
    'International market access',
    'Government contracts',
    'Enterprise partnerships'
  ];
};

const getCompetitiveAdvantages = (region: string, category: string): string[] => {
  const baseAdvantages = [
    'Early compliance adoption',
    'Reduced legal exposure',
    'Professional credibility'
  ];

  if (region === 'Africa') {
    return [
      ...baseAdvantages,
      'First-mover advantage in Africa',
      'Regional compliance leadership',
      'Local market expertise'
    ];
  }

  if (category === 'Privacy') {
    return [
      ...baseAdvantages,
      'Data protection excellence',
      'Privacy by design implementation',
      'Regulatory readiness'
    ];
  }

  return baseAdvantages;
};
