'use client';

import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, isThisWeek, isThisMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Mail, Phone, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';

interface EstimateRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    zip: string;
    project: string;
    submittedAt: Timestamp;
    status: 'new' | 'contacted' | 'closed';
    nearbyBranches?: string[];
    howDidYouHear?: string;
}

type FilterType = 'all' | 'this_week' | 'this_month' | 'custom';

const statusColors = {
  new: 'bg-blue-500 hover:bg-blue-500/90',
  contacted: 'bg-yellow-500 hover:bg-yellow-500/90',
  closed: 'bg-green-500 hover:bg-green-500/90',
};

export default function EstimateRequestsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<EstimateRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>('all');
  
  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'estimateRequests'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: requests, isLoading, error } = useCollection<EstimateRequest>(requestsQuery);

  const filteredRequests = requests?.filter(req => {
      if (!req.submittedAt) return false;
      const submittedDate = req.submittedAt.toDate();
      switch (filter) {
        case 'all':
            return true;
        case 'this_week':
            return isThisWeek(submittedDate, { weekStartsOn: 1 });
        case 'this_month':
            return isThisMonth(submittedDate);
        case 'custom':
             if (!selectedDate) return false;
             return isSameDay(submittedDate, selectedDate);
        default:
            return true;
      }
  });

  const handleStatusChange = async (requestId: string, status: EstimateRequest['status']) => {
    if (!firestore) return;
    setUpdatingId(requestId);
    const requestDocRef = doc(firestore, 'estimateRequests', requestId);
    try {
        await updateDoc(requestDocRef, { status });
        toast({
            title: 'Status Updated',
            description: `Request status changed to "${status}".`,
        });
    } catch(err: any) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: err.message,
        })
    } finally {
        setUpdatingId(null);
    }
  }
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
        setFilter('custom');
    } else {
        setFilter('all');
    }
  }
  
  const handleFilterChange = (newFilter: FilterType) => {
      setFilter(newFilter);
      if (newFilter !== 'custom') {
          setSelectedDate(undefined);
      }
  }

  const getFilterButtonText = () => {
    switch (filter) {
        case 'all': return 'All Requests';
        case 'this_week': return 'This Week';
        case 'this_month': return 'This Month';
        case 'custom': return selectedDate ? format(selectedDate, "PPP") : 'Pick a date';
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <CardTitle>Estimate Requests</CardTitle>
                <CardDescription>Click on a row to view the full request details.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !selectedDate && filter === 'all' && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getFilterButtonText()}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto p-0" align="end">
                        <div className="flex flex-col space-y-1 p-2 border-r">
                           <Button variant={filter === 'all' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => handleFilterChange('all')}>All</Button>
                           <Button variant={filter === 'this_week' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => handleFilterChange('this_week')}>This Week</Button>
                           <Button variant={filter === 'this_month' ? 'secondary' : 'ghost'} className="justify-start" onClick={() => handleFilterChange('this_month')}>This Month</Button>
                        </div>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {filteredRequests && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(req => (
                <TableRow key={req.id} onClick={() => setSelectedRequest(req)} className="cursor-pointer">
                  <TableCell className="whitespace-nowrap">
                    {req.submittedAt ? format(req.submittedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{req.name}</div>
                    <div className="text-sm text-muted-foreground">{req.email}</div>
                    <div className="text-sm text-muted-foreground">{req.phone} ({req.zip})</div>
                  </TableCell>
                   <TableCell>
                    <p className="max-w-xs truncate" title={req.project}>
                        {req.project}
                    </p>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="default"
                                size="sm"
                                className={cn(
                                    "capitalize w-28 justify-between",
                                    statusColors[req.status],
                                )}
                                disabled={updatingId === req.id}
                            >
                                {updatingId === req.id ? 'Updating...' : req.status}
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {(['new', 'contacted', 'closed'] as const).map(status => (
                               <DropdownMenuItem
                                    key={status}
                                    onClick={() => handleStatusChange(req.id, status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                               </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {filteredRequests && filteredRequests.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No estimate requests match your filter</h3>
                <p className="text-muted-foreground mt-2">
                    {requests && requests.length > 0 ? 'Try selecting a different filter.' : 'New submissions from the contact form will appear here.'}
                </p>
            </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={!!selectedRequest} onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Estimate Request from {selectedRequest.name}</DialogTitle>
                <DialogDescription>
                  Submitted on {selectedRequest.submittedAt ? format(selectedRequest.submittedAt.toDate(), 'MMMM d, yyyy, h:mm a') : 'N/A'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5"/>
                        <div className="flex-1">
                            <p className="font-semibold">Email</p>
                            <p className="text-muted-foreground">{selectedRequest.email}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5"/>
                         <div className="flex-1">
                            <p className="font-semibold">Phone</p>
                            <p className="text-muted-foreground">{selectedRequest.phone}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5"/>
                         <div className="flex-1">
                            <p className="font-semibold">Zip Code</p>
                            <p className="text-muted-foreground">{selectedRequest.zip}</p>
                        </div>
                    </div>
                    {selectedRequest.howDidYouHear && (
                         <div className="flex items-start gap-3">
                            <div className="w-4 h-4" />
                            <div className="flex-1">
                                <p className="font-semibold">How did you hear about us?</p>
                                <p className="text-muted-foreground">{selectedRequest.howDidYouHear}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Project Details</h4>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md max-h-60 overflow-y-auto">
                    {selectedRequest.project}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
    </Dialog>
    </>
  );
}
