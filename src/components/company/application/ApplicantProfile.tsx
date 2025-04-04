
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  UserCheck, 
  Mail, 
  Phone 
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ApplicantProfileProps {
  application: any; // Replace with proper type
  applicationStatus: string;
  setApplicationStatus: (status: string) => void;
  isInterviewDialogOpen: boolean;
  setIsInterviewDialogOpen: (open: boolean) => void;
  handleSendInterviewInvite: (e: React.FormEvent) => void;
}

const ApplicantProfile = ({ 
  application, 
  applicationStatus, 
  setApplicationStatus,
  isInterviewDialogOpen,
  setIsInterviewDialogOpen,
  handleSendInterviewInvite
}: ApplicantProfileProps) => {
  const handleStatusChange = (newStatus: string) => {
    setApplicationStatus(newStatus);
    toast.success(`Application status updated to ${newStatus}`);
  };

  return (
    <div className="col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-2">
              <span className="text-2xl font-medium text-gray-600">
                {application.applicant.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-xl font-medium">{application.applicant}</h3>
            <div className="flex justify-center items-center mt-1 text-gray-500 space-x-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{application.email}</span>
            </div>
            <div className="flex justify-center items-center mt-1 text-gray-500 space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{application.phone}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Match Score</h4>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-hirely h-2 rounded-full" 
                  style={{ width: `${application.score}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{application.score}%</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Application Status</h4>
            <Select value={applicationStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Interviewed">Interviewed</SelectItem>
                <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Applied For</h4>
            <div className="text-sm">
              <p className="font-medium">{application.jobTitle}</p>
              <p className="text-gray-500">{application.company}</p>
              <p className="text-gray-500">{application.salary}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Application Date</h4>
            <div className="text-sm">
              {application.appliedDate}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Documents</h4>
            <a 
              href={application.resumeUrl} 
              download 
              className="flex items-center text-sm text-hirely hover:underline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </a>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4 space-y-3">
        <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-hirely hover:bg-hirely-dark">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule an Interview</DialogTitle>
              <DialogDescription>
                Send an interview invitation to {application.applicant}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendInterviewInvite}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="interview-type">Interview Type</Label>
                  <Select defaultValue="video">
                    <SelectTrigger id="interview-type">
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Interview</SelectItem>
                      <SelectItem value="phone">Phone Interview</SelectItem>
                      <SelectItem value="in-person">In-Person Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interview-date">Date</Label>
                  <Input
                    id="interview-date"
                    type="date"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="interview-time">Start Time</Label>
                    <Input
                      id="interview-time"
                      type="time"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interview-duration">Duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger id="interview-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interview-message">Message</Label>
                  <Textarea
                    id="interview-message"
                    placeholder="Add a personal message to the candidate..."
                    rows={3}
                    defaultValue={`Hi ${application.applicant.split(' ')[0]}, we'd like to invite you for an interview for the ${application.jobTitle} position. Please confirm if you're available at the suggested time.`}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-hirely hover:bg-hirely-dark">
                  Send Interview Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="w-full">
          <UserCheck className="h-4 w-4 mr-2" />
          Move to Shortlist
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-green-600 border-green-600 hover:bg-green-50">
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
