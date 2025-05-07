
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown } from 'lucide-react';

const CsvTemplateHelper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const templateHeaders = [
    'title', 'company', 'location', 'description', 
    'job_type', 'salary', 'category', 'url'
  ];

  const templateExample = {
    title: 'Software Engineer',
    company: 'Tech Company Inc',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced software engineer...',
    job_type: 'full-time',
    salary: '$120,000 - $150,000',
    category: 'Engineering',
    url: 'https://example.com/jobs/123'
  };

  const downloadTemplate = () => {
    // Create CSV content
    const headers = templateHeaders.join(',');
    const exampleRow = templateHeaders.map(header => 
      header === 'description' 
        ? '"' + templateExample[header as keyof typeof templateExample] + '"' 
        : templateExample[header as keyof typeof templateExample]
    ).join(',');
    
    const csvContent = headers + '\n' + exampleRow + '\n';
    
    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'job_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            CSV Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>CSV Import Template</DialogTitle>
            <DialogDescription>
              Use this template to prepare your job data for importing.
              Each row should represent one job posting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <h3 className="text-sm font-semibold">Required Headers:</h3>
            <div className="bg-gray-50 p-3 rounded font-mono text-xs whitespace-pre overflow-x-auto">
              {templateHeaders.join(', ')}
            </div>
            
            <h3 className="text-sm font-semibold mt-4">Example:</h3>
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    {templateHeaders.map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {templateHeaders.map(header => (
                      <TableCell key={header} className="truncate max-w-[100px]">
                        {templateExample[header as keyof typeof templateExample]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-semibold">Notes:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
                <li>The <strong>title</strong> and <strong>description</strong> fields are required.</li>
                <li>If descriptions contain commas, enclose them in double quotes.</li>
                <li>Valid job_type values: full-time, part-time, contract, internship.</li>
                <li>For best results, keep your CSV file under 1,000 rows per upload.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadTemplate}>
              <FileDown className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CsvTemplateHelper;
