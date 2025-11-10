
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


interface EstimateRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    zip: string;
    project: string;
    submittedAt: { toDate: () => Date };
    suggestedTeam: string;
    summary: string;
    status: 'new' | 'contacted' | 'closed';
    nearbyBranches?: string[];
}

const statusColors = {
  new: 'bg-blue-500 hover:bg-blue-500/90',
  contacted: 'bg-yellow-500 hover:bg-yellow-500/90',
  closed: 'bg-green-500 hover:bg-green-500/90',
};

export default function EstimateRequestsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'estimateRequests'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: requests, isLoading, error } = useCollection<EstimateRequest>(requestsQuery);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimate Requests</CardTitle>
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

        {requests && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>AI Suggestions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="whitespace-nowrap">
                    {req.submittedAt ? format(req.submittedAt.toDate(), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{req.name}</div>
                    <div className="text-sm text-muted-foreground">{req.email}</div>
                    <div className="text-sm text-muted-foreground">{req.phone} ({req.zip})</div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate" title={req.summary}>{req.summary}</p>
                    <p className="text-sm text-muted-foreground max-w-xs truncate" title={req.project}>
                        Project: {req.project}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div><Badge variant="secondary">{req.suggestedTeam}</Badge></div>
                    {req.nearbyBranches && req.nearbyBranches.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-2">
                            Branches: {req.nearbyBranches.join(', ')}
                        </div>
                    )}
                  </TableCell>
                  <TableCell>
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
        {requests && requests.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No estimate requests yet</h3>
                <p className="text-muted-foreground mt-2">New submissions from the contact form will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
