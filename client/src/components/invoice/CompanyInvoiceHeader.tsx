import { useQuery } from "@tanstack/react-query";

interface CompanyData {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  slogan?: string;
  description?: string;
}

interface CompanyInvoiceHeaderProps {
  className?: string;
  isPrintMode?: boolean;
  showBorder?: boolean;
}

export default function CompanyInvoiceHeader({ 
  className = "", 
  isPrintMode = false,
  showBorder = true 
}: CompanyInvoiceHeaderProps) {
  const { data: company, isLoading, error } = useQuery<CompanyData>({
    queryKey: ['/api/company'],
  });

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className={`
        ${className}
        ${isPrintMode ? 'mb-6' : 'mb-8'}
        ${showBorder ? 'pb-6 border-b-2 border-gray-200' : ''}
        text-center
      `}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">Chargement des informations de l'entreprise...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    // Afficher un message si aucune entreprise n'est définie
    return (
      <div className={`
        ${className}
        ${isPrintMode ? 'mb-6' : 'mb-8'}
        ${showBorder ? 'pb-6 border-b-2 border-gray-200' : ''}
        text-center
      `}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-red-700 font-medium">Entreprise non définie</span>
          </div>
          <p className="text-red-600 text-sm">
            Veuillez configurer les informations de votre entreprise dans les paramètres.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${className}
      ${isPrintMode ? 'mb-6' : 'mb-8'}
      ${showBorder ? 'pb-6 border-b-2 border-indigo-100' : ''}
    `}>
      <div className="flex items-center justify-between">
        {/* Logo et informations principales */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className={`
            ${isPrintMode ? 'w-16 h-16' : 'w-20 h-20'}
            rounded-lg overflow-hidden border border-indigo-200 shadow-md
            ${!company.logoUrl ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-100'}
          `}>
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={`Logo ${company.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`
              ${company.logoUrl ? 'hidden' : 'flex'}
              text-white h-full w-full items-center justify-center font-bold
              ${isPrintMode ? 'text-lg' : 'text-xl'}
            `}>
              {getCompanyInitials(company.name)}
            </div>
          </div>
          
          {/* Informations de l'entreprise */}
          <div>
            <h1 className={`
              ${isPrintMode ? 'text-xl' : 'text-2xl'}
              font-bold text-indigo-800 mb-2
            `}>
              📛 {company.name}
            </h1>
            <div className={`
              ${isPrintMode ? 'text-xs' : 'text-sm'}
              text-gray-600 space-y-1
            `}>
              <p>📍 {company.address}</p>
              <p>☎️ {company.phone} • {company.email}</p>
              {company.website && (
                <p className="text-indigo-600">🌐 {company.website}</p>
              )}
              {company.slogan && (
                <p className="text-indigo-700 italic font-medium mt-2">💼 {company.slogan}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section droite - peut être utilisée pour d'autres informations */}
        <div className="text-right">
          <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
            <h2 className={`
              ${isPrintMode ? 'text-lg' : 'text-xl'}
              font-bold text-indigo-800
            `}>
              FACTURE
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

// Version spéciale pour impression avec styles inline
export function CompanyInvoiceHeaderPrint({ company }: { company?: CompanyData }) {
  if (!company) {
    return `
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #ef4444;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; color: #dc2626;">
          <strong>⚠️ Entreprise non définie</strong><br>
          <small>Veuillez configurer les informations de votre entreprise.</small>
        </div>
      </div>
    `;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
  };

  return `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #6366f1;">
      <div style="display: flex; align-items: center;">
        <div style="width: 64px; height: 64px; ${company.logoUrl 
          ? `background-image: url('${company.logoUrl}'); background-size: cover; background-position: center;` 
          : 'background: linear-gradient(45deg, #6366f1, #8b5cf6);'
        } border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 20px; border: 1px solid #c7d2fe;">
          ${!company.logoUrl ? `<span style="color: white; font-weight: bold; font-size: 18px;">${getInitials(company.name)}</span>` : ''}
        </div>
        <div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold; color: #1e3a8a;">
            📛 ${company.name}
          </h1>
          <div style="color: #6b7280; font-size: 14px; line-height: 1.4;">
            📍 ${company.address}<br>
            ☎️ ${company.phone} • ${company.email}<br>
            ${company.website ? `🌐 ${company.website}<br>` : ''}
            ${company.slogan ? `<div style="color: #1e3a8a; font-style: italic; font-weight: 500; margin-top: 8px;">💼 ${company.slogan}</div>` : ''}
          </div>
        </div>
      </div>
      <div style="background: #f0f9ff; padding: 12px 16px; border-radius: 8px; border: 1px solid #bfdbfe;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #1e3a8a;">FACTURE</h2>
      </div>
    </div>
  `;
}