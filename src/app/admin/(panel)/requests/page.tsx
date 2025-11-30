
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Clock, Plus } from "lucide-react";

const requests = [
  { id: 'req_1', title: 'Boku no Pico', user: 'troll@example.com', date: '2024-07-20', status: 'Pending' },
  { id: 'req_2', title: 'Mushishi Zoku Shou', user: 'good-taste@example.com', date: '2024-07-19', status: 'Pending' },
  { id: 'req_3', title: 'Gintama', user: 'comedy-fan@example.com', date: '2024-07-18', status: 'Completed' },
];

export default function RequestsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Anime Request Queue</CardTitle>
                <CardDescription>Users can submit requests for anime not currently on the site.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.title}</TableCell>
                                <TableCell>{req.user}</TableCell>
                                <TableCell>{req.date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {req.status === 'Pending' ? <Clock className="w-4 h-4 text-yellow-500" /> : <Check className="w-4 h-4 text-green-500" />}
                                        {req.status}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {req.status === 'Pending' && (
                                        <Button variant="outline" size="sm">
                                            <Plus className="w-4 h-4 mr-2" /> Create Override
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
