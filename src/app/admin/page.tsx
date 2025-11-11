'use client';

import { useFirestore, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { FileText, Users, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface EstimateRequest {
    id: string;
    name: string;
    submittedAt: { toDate: () => Date };
    status: 'new' | 'contacted' | 'closed';
}

const sampleAnalyticsData = [
  { name: 'Day 1', visitors: 20 },
  { name: 'Day 2', visitors: 35 },
  { name: 'Day 3', visitors: 45 },
  { name: 'Day 4', visitors: 30 },
  { name: 'Day 5', visitors: 50 },
  { name: 'Day 6', visitors: 60 },
  { name: 'Day 7', visitors: 55 },
];

export default function AdminPage() {
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'estimateRequests'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const recentRequestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'estimateRequests'), orderBy('submittedAt', 'desc'), limit(5));
  }, [firestore]);

  const { data: requests, isLoading: isLoadingRequests } = useCollection<EstimateRequest>(requestsQuery);
  const { data: recentRequests, isLoading: isLoadingRecent } = useCollection<EstimateRequest>(recentRequestsQuery);

  const stats = {
    total: requests?.length || 0,
    new: requests?.filter(r => r.status === 'new').length || 0,
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Image 
                src="https://firebasestorage.googleapis.com/v0/b/studio-6165246273-4d6aa.firebasestorage.app/o/CS%20LLC%20New%20logo%20PNG.png?alt=media&token=c1de30c8-b019-4f96-bcbc-14371b3c3dd2"
                alt="Construction Specialties, LLC Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
           />
           <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.total}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Estimates</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.new}</div>}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Analytics</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-green-500">
                Active
            </div>
            <p className="text-xs text-muted-foreground">Data is being collected by Google Analytics.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Estimate Requests</CardTitle>
            <CardDescription>The 5 most recent estimate submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentRequests?.map(req => (
                        <TableRow key={req.id}>
                            <TableCell>{req.name}</TableCell>
                            <TableCell>{req.submittedAt ? format(req.submittedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</TableCell>
                            <TableCell><Badge variant={req.status === 'new' ? 'default' : 'secondary'}>{req.status}</Badge></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
             {recentRequests && recentRequests.length === 0 && !isLoadingRecent && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent requests.</p>
             )}
              {requests && requests.length > 5 && (
                <div className="mt-4 text-right">
                    <Button asChild variant="link">
                        <Link href="/admin/estimates">View All Estimates</Link>
                    </Button>
                </div>
              )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Site Visitors (Sample)</CardTitle>
                <CardDescription>This is sample data. Real data requires API configuration.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={sampleAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
