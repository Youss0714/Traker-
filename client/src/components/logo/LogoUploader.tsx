import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar } from '@/components/ui/avatar';

interface LogoUploaderProps {
  currentLogo?: string;
  companyName: string;
  onLogoChange?: (logoUrl: string) => void;
}

export function LogoUploader({ currentLogo, companyName, onLogoChange }: LogoUploaderProps) {
  const [logo, setLogo] = useState<string | null>(currentLogo || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedLogo = localStorage.getItem('company_logo');
    if (savedLogo && !currentLogo) {
      setLogo(savedLogo);
    }
  }, [currentLogo]);

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convertir en base64 pour stockage local
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoDataUrl = e.target?.result as string;
        setLogo(logoDataUrl);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('company_logo', logoDataUrl);
        
        // Notifier le parent
        if (onLogoChange) {
          onLogoChange(logoDataUrl);
        }
        
        toast({
          title: "Logo mis à jour",
          description: "Le logo de votre entreprise a été enregistré"
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    localStorage.removeItem('company_logo');
    
    if (onLogoChange) {
      onLogoChange('');
    }
    
    toast({
      title: "Logo supprimé",
      description: "Le logo de l'entreprise a été supprimé"
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
          {logo ? (
            <img 
              src={logo} 
              alt={`Logo ${companyName}`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white h-full w-full flex items-center justify-center text-2xl font-medium">
              {getCompanyInitials(companyName)}
            </div>
          )}
        </Avatar>
        
        {logo && (
          <button
            onClick={handleRemoveLogo}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Supprimer le logo"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          onClick={triggerFileInput}
          disabled={isUploading}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
        >
          <span className="material-icons text-sm mr-2">
            {logo ? 'edit' : 'photo_camera'}
          </span>
          {isUploading ? 'Téléchargement...' : logo ? 'Changer le logo' : 'Ajouter un logo'}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 max-w-xs">
          Formats acceptés: JPG, PNG, GIF (max 5MB)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Le logo apparaîtra sur vos factures et documents
        </p>
      </div>
    </div>
  );
}

// Hook pour récupérer le logo depuis localStorage
export function useCompanyLogo() {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('company_logo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  return logo;
}