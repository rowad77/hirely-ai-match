
import CompanyLayout from "@/components/layout/CompanyLayout";
import CandidateSearch from "@/components/company/CandidateSearch";

const CompanyCandidates = () => {
  return (
    <CompanyLayout title="Candidate Search">
      <div className="space-y-6">
        <CandidateSearch />
      </div>
    </CompanyLayout>
  );
};

export default CompanyCandidates;
