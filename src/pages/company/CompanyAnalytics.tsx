
import { useState, useEffect } from 'react';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2 } from "lucide-react";
import AdvancedAnalytics from '@/components/company/AdvancedAnalytics';
import { LoadingState } from '@/components/ui/loading-state';
import { useCompanyAnalytics } from '@/hooks/use-company-analytics';
import { toast } from "sonner";
import { motion } from "framer-motion";

const CompanyAnalytics = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data, loading, error } = useCompanyAnalytics(selectedDateRange);
  
  useEffect(() => {
    document.title = "Analytics Dashboard | SpeedyApply";
  }, []);
  
  const handleShareReport = () => {
    toast.success("Report link copied to clipboard", {
      description: "You can now share this report with your team members."
    });
  };

  const handleDownloadReport = () => {
    toast.success("Report download started", {
      description: "Your analytics report will be ready shortly."
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <CompanyLayout title="Company Analytics">
        <LoadingState message="Loading analytics data..." />
      </CompanyLayout>
    );
  }

  if (error) {
    return (
      <CompanyLayout title="Company Analytics">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">Error loading analytics: {error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout title="Company Analytics">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-medium">Analytics Dashboard</h2>
            <p className="text-gray-500 mt-1">
              Track your recruitment performance and candidate engagement
            </p>
          </motion.div>
          
          <div className="flex flex-wrap gap-2">
            <motion.div variants={itemVariants}>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleShareReport}>
                <Share2 className="h-4 w-4" />
                Share Report
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadReport}>
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="relative inline-block">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value as '7d' | '30d' | '90d')}
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-3xl font-bold mt-1">
              {data?.applications.reduce((sum, item) => sum + item.applications, 0) || 0}
            </p>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-green-600">↑ 12%</span>
              <span className="text-gray-500 ml-1">vs. last period</span>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-gray-500">Interview Rate</h3>
            <p className="text-3xl font-bold mt-1">
              {data?.applications.length ? 
                `${Math.round((data.applications.reduce((sum, item) => sum + item.interviews, 0) / 
                data.applications.reduce((sum, item) => sum + item.applications, 0)) * 100)}%` : '0%'}
            </p>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-red-600">↓ 3%</span>
              <span className="text-gray-500 ml-1">vs. last period</span>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-gray-500">Time to Hire</h3>
            <p className="text-3xl font-bold mt-1">{data?.timeToHire || 0} days</p>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-green-600">↑ 8%</span>
              <span className="text-gray-500 ml-1">faster than average</span>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-gray-500">Offer Acceptance</h3>
            <p className="text-3xl font-bold mt-1">76%</p>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-green-600">↑ 5%</span>
              <span className="text-gray-500 ml-1">vs. last period</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs 
            defaultValue="applications" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="hiring">Hiring Funnel</TabsTrigger>
              <TabsTrigger value="engagement">Candidate Engagement</TabsTrigger>
            </TabsList>
            
            {data && (
              <>
                <TabsContent value="applications">
                  <AdvancedAnalytics dataType="applications" data={data} />
                </TabsContent>
                
                <TabsContent value="hiring">
                  <AdvancedAnalytics dataType="hiring" data={data} />
                </TabsContent>
                
                <TabsContent value="engagement">
                  <AdvancedAnalytics dataType="engagement" data={data} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </motion.div>
      </motion.div>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;
