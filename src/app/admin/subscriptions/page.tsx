'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, DollarSign, Users, TrendingDown, Loader2, PlusCircle, Star } from "lucide-react";
import { useCollection } from "@/firebase";
import { UserProfile } from "@/lib/types/user";
import { format, isFuture } from "date-fns";

const kpiData = [
    { title: "Active Subscribers", value: "8,210", change: "+12.5%", icon: Users },
    { title: "Monthly Recurring Revenue", value: "$40,995", change: "+8.2%", icon: DollarSign },
    { title: "Churn Rate", value: "2.1%", change: "-0.5%", icon: TrendingDown },
];

const plans = [
    { name: "Free", price: "$0/mo", features: ["Limited streaming", "Ads supported"] },
    { name: "Premium", price: "$4.99/mo", features: ["Ad-free streaming", "HD quality", "Early access"], isPrimary: true },
    { name: "VIP", price: "$9.99/mo", features: ["All Premium features", "Offline downloads", "Exclusive content"] },
];

export default function AdminSubscriptionsPage() {
    const { data: users, loading: loadingUsers } = useCollection<UserProfile>('users');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><CreditCard className="w-8 h-8"/> Subscriptions</h1>
                <p className="text-muted-foreground">Manage subscription plans, view subscriber metrics, and handle billing.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Subscription Plans</CardTitle>
                        <Button size="sm" variant="outline" className="gap-2"><PlusCircle className="w-4 h-4"/> Add New Plan</Button>
                    </div>
                    <CardDescription>Manage pricing tiers and features for your users.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <Card key={plan.name} className={plan.isPrimary ? "border-primary shadow-lg shadow-primary/10" : ""}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {plan.name} {plan.isPrimary && <Star className="w-5 h-5 text-primary"/>}
                                </CardTitle>
                                <p className="text-2xl font-bold">{plan.price}</p>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={plan.isPrimary ? 'default' : 'secondary'}>Edit Plan</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Subscribers</CardTitle>
                    <CardDescription>View and manage all users with active and expired subscriptions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Subscription Tier</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expires On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingUsers ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="w-6 h-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : users && users.length > 0 ? (
                                users.map(user => {
                                    const tier = user.subscriptionTier || 'free';
                                    const expiresAt = user.premiumUntil?.toDate();
                                    const isActive = expiresAt && isFuture(expiresAt);
                                    
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.photoURL} alt={user.displayName}/>
                                                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{user.displayName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                <Badge variant={tier === 'premium' || tier === 'vip' ? 'default' : 'outline'}>{tier}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {tier !== 'free' && (
                                                    <Badge variant={isActive ? 'secondary' : 'destructive'} className={isActive ? "bg-green-500/20 text-green-400" : ""}>
                                                        {isActive ? 'Active' : 'Expired'}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {expiresAt ? format(expiresAt, 'MMM dd, yyyy') : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                 <TableRow><TableCell colSpan={5} className="text-center h-24">No users found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
