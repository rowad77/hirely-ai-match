
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import CsvJobUpload from './CsvJobUpload';
import CsvTemplateHelper from './CsvTemplateHelper';

interface CsvUploadDialogProps {
  onUploadComplete: () => void;
}

const CsvUploadDialog: React.FC<CsvUploadDialogProps> = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  
  const handleUploadComplete = () => {
    onUploadComplete();
    // Don't close the dialog immediately to show results
    setTimeout(() => setOpen(false), 2000); 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div>
            <DialogTitle>CSV Job Import</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import jobs in bulk.
            </DialogDescription>
          </div>
          <CsvTemplateHelper />
        </DialogHeader>
        <CsvJobUpload onUploadComplete={handleUploadComplete} />
      </DialogContent>
    </Dialog>
  );
};

export default CsvUploadDialog;
