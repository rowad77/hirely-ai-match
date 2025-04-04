
import CompanyLayout from "@/components/layout/CompanyLayout";
import Analytics from "@/components/company/Analytics";

const CompanyAnalytics = () => {
  return (
    <CompanyLayout title="Analytics">
      <div className="space-y-6">
        <Analytics />
      </div>
    </CompanyLayout>
  );
};

export default CompanyAnalytics;
