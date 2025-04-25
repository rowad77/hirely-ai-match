
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Define types
type CandidateStatus = 'new' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: CandidateStatus;
  avatarFallback: string;
  matchScore: number;
}

interface StatusColumn {
  id: CandidateStatus;
  title: string;
  candidates: Candidate[];
}

// Mock data
const initialColumns: StatusColumn[] = [
  {
    id: 'new',
    title: 'New Applications',
    candidates: [
      {
        id: 'c1',
        name: 'John Smith',
        position: 'Senior Frontend Developer',
        status: 'new',
        avatarFallback: 'JS',
        matchScore: 92
      },
      {
        id: 'c2',
        name: 'Emily Johnson',
        position: 'UX Designer',
        status: 'new',
        avatarFallback: 'EJ',
        matchScore: 86
      }
    ]
  },
  {
    id: 'screening',
    title: 'Phone Screening',
    candidates: [
      {
        id: 'c3',
        name: 'Michael Brown',
        position: 'Backend Developer',
        status: 'screening',
        avatarFallback: 'MB',
        matchScore: 78
      }
    ]
  },
  {
    id: 'interview',
    title: 'Interview',
    candidates: [
      {
        id: 'c4',
        name: 'Sarah Wilson',
        position: 'Product Manager',
        status: 'interview',
        avatarFallback: 'SW',
        matchScore: 89
      }
    ]
  },
  {
    id: 'assessment',
    title: 'Assessment',
    candidates: []
  },
  {
    id: 'offer',
    title: 'Offer',
    candidates: [
      {
        id: 'c5',
        name: 'David Thompson',
        position: 'DevOps Engineer',
        status: 'offer',
        avatarFallback: 'DT',
        matchScore: 94
      }
    ]
  },
  {
    id: 'hired',
    title: 'Hired',
    candidates: []
  },
  {
    id: 'rejected',
    title: 'Rejected',
    candidates: []
  }
];

const CandidatePipeline = () => {
  const [columns, setColumns] = useState<StatusColumn[]>(initialColumns);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Create a copy of the source column candidates
    const sourceItems = [...sourceColumn.candidates];
    // Remove the item from the source column
    const [removed] = sourceItems.splice(source.index, 1);
    // Update the candidate's status
    const updatedCandidate = { ...removed, status: destination.droppableId as CandidateStatus };

    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, updatedCandidate);
      
      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, candidates: sourceItems };
        }
        return col;
      });
      
      setColumns(newColumns);
    } else {
      // Moving to a different column
      // Create a copy of the destination column candidates
      const destItems = [...destColumn.candidates];
      // Insert the item at the destination
      destItems.splice(destination.index, 0, updatedCandidate);
      
      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, candidates: sourceItems };
        }
        if (col.id === destination.droppableId) {
          return { ...col, candidates: destItems };
        }
        return col;
      });
      
      setColumns(newColumns);
      toast.success(`${updatedCandidate.name} moved to ${destColumn.title} stage`);
    }
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto">
          {columns.map(column => (
            <div key={column.id} className="min-w-[250px]">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {column.candidates.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[400px] rounded-md p-2 space-y-2 ${
                          snapshot.isDraggingOver ? 'bg-gray-50' : ''
                        }`}
                      >
                        {column.candidates.map((candidate, index) => (
                          <Draggable
                            key={candidate.id}
                            draggableId={candidate.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 bg-white border rounded-md shadow-sm ${
                                  snapshot.isDragging ? 'shadow-md' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-hirely text-white text-xs">
                                      {candidate.avatarFallback}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <p className="font-medium text-sm truncate">{candidate.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-hirely h-1.5 rounded-full" 
                                      style={{ width: `${candidate.matchScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium ml-1">{candidate.matchScore}%</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CandidatePipeline;
