
import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const CandidateSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Alex Johnson', skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: 2, name: 'Jamie Smith', skills: ['UI/UX', 'Figma', 'CSS'], experience: '3 years', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: 3, name: 'Taylor Wilson', skills: ['Python', 'Django', 'Data Science'], experience: '4 years', avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: 4, name: 'Morgan Lee', skills: ['Java', 'Spring', 'Microservices'], experience: '7 years', avatar: 'https://i.pravatar.cc/100?img=4' },
  ]);
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInvite = (candidateId: number) => {
    toast.success("Invitation sent successfully!");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Search</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search candidates by name or skills..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No candidates found matching your search criteria.
            </div>
          ) : (
            filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name} 
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white"></span>
                  </div>
                  <div>
                    <h3 className="font-medium">{candidate.name}</h3>
                    <p className="text-sm text-gray-500">{candidate.experience} • {candidate.skills.join(', ')}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleInvite(candidate.id)}>
                  <UserPlus className="mr-1 h-4 w-4" /> Invite
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateSearch;
