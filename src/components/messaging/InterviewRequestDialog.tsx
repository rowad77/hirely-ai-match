
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMessaging } from '@/hooks/use-messaging'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';

interface InterviewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  recipientId: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export function InterviewRequestDialog({
  open,
  onOpenChange,
  conversationId,
  recipientId
}: InterviewRequestDialogProps) {
  const { user } = useAuth();
  const { sendInterviewRequest } = useMessaging();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else if (selectedTimes.length < 3) {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleSubmit = async () => {
    if (!date || selectedTimes.length === 0 || !user || !conversationId || !recipientId) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert selected times to full ISO date strings
      const proposedTimes = selectedTimes.map(time => {
        const [hours, minutes] = time.split(':');
        const dateTime = new Date(date);
        dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return dateTime.toISOString();
      });
      
      await sendInterviewRequest({
        conversationId,
        senderId: user.id,
        recipientId,
        proposedTimes
      });
      
      // Close dialog and reset form
      onOpenChange(false);
      setDate(undefined);
      setSelectedTimes([]);
    } catch (error) {
      console.error('Error sending interview request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Suggest Times (max 3)</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTimes.includes(time) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAddTime(time)}
                  className="flex items-center justify-center"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!date || selectedTimes.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Interview Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
