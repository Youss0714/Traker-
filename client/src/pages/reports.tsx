import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/lib/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA');
};

export default function Reports() {
  const { setActivePage } = useAppContext();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    setActivePage('more');
  }, [setActivePage]);

  // Fetch sales data for reports
  const { data: sales } = useQuery({
    queryKey: ['/api/sales'],
    select: (data: any[]) => data || []
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    select: (data: any[]) => data || []
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
    select: (data: any[]) => data || []
  });

  const generateDailyReport = () => {
    if (!sales) return;
    
    const today = new Date();
    const todaySales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.date || sale.createdAt);
      return saleDate.toDateString() === today.toDateString();
    });

    const totalSales = todaySales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const salesCount = todaySales.length;

    setReportData({
      title: 'Rapport quotidien',
      period: today.toLocaleDateString('fr-FR'),
      totalSales,
      salesCount,
      details: todaySales
    });
    setSelectedReport('daily');
  };

  const generateWeeklyReport = () => {
    if (!sales) return;
    
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklySales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.date || sale.createdAt);
      return saleDate >= weekAgo && saleDate <= today;
    });

    const totalSales = weeklySales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const salesCount = weeklySales.length;

    setReportData({
      title: 'Rapport hebdomadaire',
      period: `${weekAgo.toLocaleDateString('fr-FR')} - ${today.toLocaleDateString('fr-FR')}`,
      totalSales,
      salesCount,
      details: weeklySales
    });
    setSelectedReport('weekly');
  };

  const generateMonthlyReport = () => {
    if (!sales) return;
    
    const today = new Date();
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const monthlySales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.date || sale.createdAt);
      return saleDate >= monthAgo && saleDate <= today;
    });

    const totalSales = monthlySales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const salesCount = monthlySales.length;

    setReportData({
      title: 'Rapport mensuel',
      period: `${monthAgo.toLocaleDateString('fr-FR')} - ${today.toLocaleDateString('fr-FR')}`,
      totalSales,
      salesCount,
      details: monthlySales
    });
    setSelectedReport('monthly');
  };

  const generateAnnualReport = () => {
    if (!sales) return;
    
    const today = new Date();
    const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    const annualSales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.date || sale.createdAt);
      return saleDate >= yearAgo && saleDate <= today;
    });

    const totalSales = annualSales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
    const salesCount = annualSales.length;
    
    // Calcul de la moyenne mensuelle
    const monthlyAverage = totalSales / 12;

    setReportData({
      title: 'Rapport annuel',
      period: `${yearAgo.toLocaleDateString('fr-FR')} - ${today.toLocaleDateString('fr-FR')}`,
      totalSales,
      salesCount,
      monthlyAverage,
      details: annualSales
    });
    setSelectedReport('annual');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#212121]">Rapports</h2>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 m-4 rounded-lg border border-emerald-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">trending_up</span>
                </div>
                <h3 className="text-lg font-medium text-emerald-800 mb-4">Rapports de vente</h3>
                <p className="text-emerald-600 max-w-md mx-auto mb-6">
                  Analysez vos performances de vente sur différentes périodes.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button 
                    onClick={generateDailyReport}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">calendar_today</span>
                    Rapport quotidien
                  </Button>
                  <Button 
                    onClick={generateWeeklyReport}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">date_range</span>
                    Rapport hebdomadaire
                  </Button>
                  <Button 
                    onClick={generateMonthlyReport}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">event_note</span>
                    Rapport mensuel
                  </Button>
                  <Button 
                    onClick={generateAnnualReport}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">date_range</span>
                    Rapport annuel
                  </Button>
                </div>
                
                {/* Affichage des résultats du rapport */}
                {reportData && (
                  <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-200">
                    <h4 className="text-lg font-semibold text-emerald-800 mb-2">{reportData.title}</h4>
                    <p className="text-emerald-600 mb-4">Période: {reportData.period}</p>
                    
                    <div className={`grid gap-4 mb-4 ${reportData.monthlyAverage ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-600">Total des ventes</p>
                        <p className="text-xl font-bold text-emerald-800">{formatCurrency(reportData.totalSales)}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm text-emerald-600">Nombre de ventes</p>
                        <p className="text-xl font-bold text-emerald-800">{reportData.salesCount}</p>
                      </div>
                      {reportData.monthlyAverage && (
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <p className="text-sm text-emerald-600">Moyenne mensuelle</p>
                          <p className="text-xl font-bold text-emerald-800">{formatCurrency(reportData.monthlyAverage)}</p>
                        </div>
                      )}
                    </div>

                    {reportData.details && reportData.details.length > 0 && (
                      <div>
                        <h5 className="font-medium text-emerald-800 mb-2">Détails des ventes</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {reportData.details.map((sale: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-emerald-50 rounded">
                              <span className="text-sm">{sale.invoiceNumber || `Vente #${sale.id}`}</span>
                              <span className="font-medium">{formatCurrency(sale.total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => {
                        setSelectedReport(null);
                        setReportData(null);
                      }}
                      variant="outline"
                      className="mt-4 w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    >
                      Fermer le rapport
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-violet-100 to-purple-100 m-4 rounded-lg border border-violet-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">inventory_2</span>
                </div>
                <h3 className="text-lg font-medium text-violet-800 mb-4">Rapports d'inventaire</h3>
                <p className="text-violet-600 max-w-md mx-auto mb-6">
                  Suivez votre inventaire et identifiez les produits à réapprovisionner.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">warning</span>
                    Produits à faible stock
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_down</span>
                    Produits peu vendus
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">trending_up</span>
                    Produits les plus vendus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
            <CardContent className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 m-4 rounded-lg border border-amber-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons text-3xl text-white">people</span>
                </div>
                <h3 className="text-lg font-medium text-amber-800 mb-4">Rapports clients</h3>
                <p className="text-amber-600 max-w-md mx-auto mb-6">
                  Analysez le comportement d'achat et la fidélité de vos clients.
                </p>
                
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">stars</span>
                    Meilleurs clients
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">person_add</span>
                    Nouveaux clients
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg flex items-center justify-center gap-2">
                    <span className="material-icons text-sm">people_outline</span>
                    Clients inactifs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}