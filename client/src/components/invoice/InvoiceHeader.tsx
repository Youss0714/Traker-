import { useCompanyLogo } from '@/components/logo/LogoUploader';
import { useQuery } from '@tanstack/react-query';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  date: string;
  time?: string;
  dueDate?: string;
}

export function InvoiceHeader({ invoiceNumber, date, time, dueDate }: InvoiceHeaderProps) {
  const companyLogo = useCompanyLogo();
  const { data: company } = useQuery<any>({
    queryKey: ['/api/company'],
  });

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="flex justify-between items-start mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
      {/* Logo et informations de l'entreprise */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-lg shadow-md overflow-hidden bg-white border border-indigo-200">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt={`Logo ${company?.name || 'Entreprise'}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-full w-full flex items-center justify-center text-lg font-bold">
              {company?.name ? getCompanyInitials(company.name) : 'E'}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-indigo-800">{company?.name || 'Nom de l\'entreprise'}</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{company?.address || 'Adresse de l\'entreprise'}</p>
            <p>{company?.phone || 'Téléphone'} • {company?.email || 'Email'}</p>
            {company?.website && (
              <p className="text-indigo-600">{company.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informations de la facture */}
      <div className="text-right">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
          <h2 className="text-xl font-bold text-indigo-800 mb-2">FACTURE</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">N°:</span>
              <span className="font-mono">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{date}</span>
            </div>
            {time && (
              <div className="flex justify-between">
                <span className="font-medium">Heure:</span>
                <span>{time}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex justify-between">
                <span className="font-medium">Échéance:</span>
                <span>{dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour l'impression/PDF
export function PrintableInvoiceHeader({ invoiceNumber, date, time, dueDate }: InvoiceHeaderProps) {
  const companyLogo = useCompanyLogo();
  const { data: company } = useQuery<any>({
    queryKey: ['/api/company'],
  });

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="flex justify-between items-start mb-8 print:mb-6">
      {/* Logo et informations de l'entreprise */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 print:w-16 print:h-16 rounded-lg overflow-hidden bg-gray-100 border">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt={`Logo ${company?.name || 'Entreprise'}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-800 text-white h-full w-full flex items-center justify-center text-lg font-bold">
              {company?.name ? getCompanyInitials(company.name) : 'E'}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl print:text-xl font-bold text-gray-800">{company?.name || 'Nom de l\'entreprise'}</h1>
          <div className="text-sm text-gray-600 space-y-1 print:text-xs">
            <p>{company?.address || 'Adresse de l\'entreprise'}</p>
            <p>{company?.phone || 'Téléphone'} • {company?.email || 'Email'}</p>
            {company?.website && (
              <p>{company.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Informations de la facture */}
      <div className="text-right">
        <div className="border border-gray-300 p-4 print:p-3">
          <h2 className="text-xl print:text-lg font-bold text-gray-800 mb-2">FACTURE</h2>
          <div className="space-y-1 text-sm print:text-xs">
            <div className="flex justify-between">
              <span className="font-medium">N°:</span>
              <span className="font-mono">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{date}</span>
            </div>
            {time && (
              <div className="flex justify-between">
                <span className="font-medium">Heure:</span>
                <span>{time}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex justify-between">
                <span className="font-medium">Échéance:</span>
                <span>{dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}