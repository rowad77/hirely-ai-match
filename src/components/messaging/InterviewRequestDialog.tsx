
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useMessaging } from '@/hooks/use-messaging';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';

interface InterviewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  recipientId: string;
}

export function InterviewRequestDialog({
  open,
  onOpenChange,
  conversationId,
  recipientId
}: InterviewRequestDialogProps) {
  const { user } = useAuth();
  const { sendInterviewRequest } = useMessaging();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTimes, setSelectedTimes] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const availableTimes = selectedDate ? generateAvailableTimes(selectedDate) : [];
  
  function generateAvailableTimes(date: Date): Date[] {
    const times: Date[] = [];
    
    // Generate times from 9 AM to 5 PM in 30-minute increments
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        const time = setMinutes(setHours(new Date(date), hour), minute);
        times.push(time);
      }
    }
    
    return times;
  }
  
  const toggleTimeSelection = (time: Date) => {
    const timeString = time.toISOString();
    
    if (selectedTimes.some(t => t.toISOString() === timeString)) {
      setSelectedTimes(selectedTimes.filter(t => t.toISOString() !== timeString));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };
  
  const handleSendRequest = async () => {
    if (!user || selectedTimes.length === 0) return;
    
    setIsLoading(true);
    
    try {
      await sendInterviewRequest({
        conversationId,
        senderId: user.id,
        recipientId,
        proposedTimes: selectedTimes.map(t => t.toISOString())
      });
      
      onOpenChange(false);
      setSelectedTimes([]);
    } catch (error) {
      console.error('Error sending interview request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule an interview</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Select a date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="border rounded-md"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Select available times</h3>
            {selectedDate ? (
              <div className="h-[280px] overflow-y-auto border rounded-md p-2 space-y-2">
                {availableTimes.map((time) => {
                  const isSelected = selectedTimes.some(
                    t => t.toISOString() === time.toISOString()
                  );
                  
                  return (
                    <Button
                      key={time.toISOString()}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => toggleTimeSelection(time)}
                    >
                      {format(time, 'p')}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Please select a date first
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {selectedTimes.length > 0 ? (
              <>Selected {selectedTimes.length} time slots</>
            ) : (
              <>Select at least one time slot to continue</>
            )}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendRequest} 
            disabled={selectedTimes.length === 0 || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Interview Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
