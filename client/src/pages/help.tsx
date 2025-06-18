import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre d'aide</h1>
        <p className="text-gray-600">Trouvez les réponses à vos questions et obtenez de l'assistance</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Support technique */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">support_agent</span>
              </div>
              <span className="text-blue-800">Support technique</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-600">Contactez notre équipe pour toute assistance technique</p>
            <div className="flex items-center space-x-2">
              <span className="material-icons text-blue-500 text-sm">email</span>
              <a 
                href="mailto:youssouphafils@gmail.com" 
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                youssouphafils@gmail.com
              </a>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              onClick={() => window.open('mailto:youssouphafils@gmail.com?subject=Support technique gYS App')}
            >
              <span className="material-icons mr-2">email</span>
              Contacter le support
            </Button>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">quiz</span>
              </div>
              <span className="text-green-800">Questions fréquentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Question 1 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment ajouter un nouveau produit ?
                </h4>
                <p className="text-sm text-green-700">
                  Allez dans le menu "Inventaire", cliquez sur le bouton "Ajouter un produit", 
                  remplissez les informations (nom, prix, stock, catégorie) puis validez.
                </p>
              </div>

              {/* Question 2 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment créer une facture ?
                </h4>
                <p className="text-sm text-green-700">
                  Cliquez sur "Nouvelle facture" depuis le tableau de bord ou allez dans "Ventes" → "Ajouter une vente". 
                  Sélectionnez le client, ajoutez les produits, et l'application génèrera automatiquement la facture.
                </p>
              </div>

              {/* Question 3 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment gérer les stocks faibles ?
                </h4>
                <p className="text-sm text-green-700">
                  L'application affiche automatiquement les alertes de stock faible sur le tableau de bord. 
                  Cliquez sur "Réapprovisionner les stocks" pour accéder à la gestion d'inventaire.
                </p>
              </div>

              {/* Question 4 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment configurer les informations de mon entreprise ?
                </h4>
                <p className="text-sm text-green-700">
                  Allez dans "Paramètres" → "Informations de l'entreprise" pour modifier le nom, 
                  l'adresse, l'email et autres détails de votre société.
                </p>
              </div>

              {/* Question 5 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment exporter mes données ?
                </h4>
                <p className="text-sm text-green-700">
                  Rendez-vous dans la section "Plus" → "Export" pour télécharger vos données 
                  de ventes, clients et produits au format Excel.
                </p>
              </div>

              {/* Question 6 */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="material-icons text-green-600 mr-2 text-sm">help_outline</span>
                  Comment modifier les taux de TVA ?
                </h4>
                <p className="text-sm text-green-700">
                  Dans "Paramètres" → "Configuration fiscale", vous pouvez ajuster le taux de TVA 
                  qui sera automatiquement appliqué à toutes les factures.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-green-200">
              <p className="text-sm text-green-600 text-center">
                Vous ne trouvez pas la réponse à votre question ? 
                <Button 
                  variant="link" 
                  className="text-green-700 font-medium p-0 h-auto"
                  onClick={() => window.open('mailto:youssouphafils@gmail.com?subject=Question sur gYS App')}
                >
                  Contactez-nous
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">feedback</span>
              </div>
              <span className="text-purple-800">Donner un avis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-purple-600">Partagez vos commentaires et suggestions d'amélioration</p>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => window.open('mailto:youssouphafils@gmail.com?subject=Feedback gYS App')}
            >
              <span className="material-icons mr-2">feedback</span>
              Envoyer un feedback
            </Button>
          </CardContent>
        </Card>

        {/* Guides d'utilisation */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">menu_book</span>
              </div>
              <span className="text-orange-800">Guides d'utilisation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-600">Apprenez à utiliser toutes les fonctionnalités de l'application</p>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={() => alert("Guides d'utilisation en cours de développement")}
            >
              <span className="material-icons mr-2">menu_book</span>
              Voir les guides
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations de contact */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-gray-800">Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-gray-600">person</span>
              <span className="text-gray-700 font-medium">Youssouf Sawadogo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons text-gray-600">email</span>
              <span className="text-gray-700">youssouphafils@gmail.com</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Développeur de l'application gYS - Système de gestion d'entreprise
          </p>
        </CardContent>
      </Card>
    </div>
  );
}