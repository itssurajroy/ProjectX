
'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoc, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2, Menu, PlusCircle, Trash2, ArrowUp, ArrowDown, Edit } from "lucide-react";
import toast from "react-hot-toast";

// Interface for a single menu item
interface MenuItem {
    id: string;
    label: string;
    href: string;
}

// Interface for the menu document in Firestore
interface MenuConfig {
    items: MenuItem[];
}

// Dialog for adding/editing menu items
function ItemDialog({ isOpen, onClose, onSave, item }: { isOpen: boolean, onClose: () => void, onSave: (item: Omit<MenuItem, 'id'>) => void, item?: MenuItem | null }) {
    const [label, setLabel] = useState('');
    const [href, setHref] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setLabel(item.label);
                setHref(item.href);
            } else {
                setLabel('');
                setHref('');
            }
        }
    }, [item, isOpen]);

    const handleSave = () => {
        if (!label.trim() || !href.trim()) {
            toast.error("Both label and URL are required.");
            return;
        }
        onSave({ label, href });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item ? 'Edit' : 'Add'} Menu Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="item-label">Label</Label>
                        <Input id="item-label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., Home" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-href">URL</Label>
                        <Input id="item-href" value={href} onChange={e => setHref(e.target.value)} placeholder="/home" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Component to manage a single menu (header or footer)
function MenuEditor({ menuId, menuName }: { menuId: string, menuName: string }) {
    const firestore = useFirestore();
    const docRef = doc(firestore, `settings_menus/${menuId}`);
    const { data: menuConfig, loading } = useDoc<MenuConfig>(`settings_menus/${menuId}`);
    
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const hasLoaded = useRef(false);

    const defaultItems: MenuItem[] = menuId === 'header'
    ? [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Movies', href: '/movies' },
        { id: '3', label: 'TV Series', href: '/tv' },
        { id: '4', label: 'Most Popular', href: '/search?sort=popularity' },
        { id: '5', label: 'Top Airing', href: '/search?status=Airing&sort=popularity' },
    ]
    : [
        { id: '1', label: 'Rules', href: '/rules' },
        { id: '2', label: 'Terms', href: '/terms' },
        { id: '3', label: 'DMCA', href: '/dmca' },
        { id: '4', label: 'Contact', href: '/contact' },
    ];


    // Load from Firestore or set defaults
    useEffect(() => {
        if (loading) return;

        if (menuConfig) {
            // Use Firestore data if it exists, even if it's an empty array
            setItems(menuConfig.items || []);
        } else {
            // Doc doesn't exist, seed with default items
            setItems(defaultItems);
        }
        hasLoaded.current = true;
    }, [menuConfig, loading]);

    // Save to Firestore on changes
    useEffect(() => {
        // Don't save on initial render cycles before data is loaded
        if (!hasLoaded.current || loading) return;
        
        setDocumentNonBlocking(docRef, { items }, { merge: true });
        
    }, [items]);


    const handleSaveItem = (newItemData: Omit<MenuItem, 'id'>) => {
        if (editingItem) {
            // Edit existing item
            setItems(prevItems => prevItems.map(item =>
                item.id === editingItem.id ? { ...item, ...newItemData } : item
            ));
            toast.success("Item updated!");
        } else {
            // Add new item
            const newItem: MenuItem = { id: Date.now().toString(), ...newItemData };
            setItems(prevItems => [...prevItems, newItem]);
            toast.success("Item added!");
        }
        setEditingItem(null);
    };

    const handleDeleteItem = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            setItems(prevItems => prevItems.filter(item => item.id !== id));
            toast.success("Item deleted.");
        }
    };
    
    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;
        
        setItems(prevItems => {
            const newItems = [...prevItems];
            const temp = newItems[index];
            newItems[index] = newItems[newIndex];
            newItems[newIndex] = temp;
            return newItems;
        });
    };

    const openEditDialog = (item: MenuItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{menuName}</CardTitle>
                    <CardDescription>Manage the navigation links for this menu.</CardDescription>
                </div>
                <Button size="sm" onClick={openAddDialog}><PlusCircle className="w-4 h-4 mr-2" />Add Item</Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                ) : items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
                                <div className="flex-1">
                                    <p className="font-semibold">{item.label}</p>
                                    <p className="text-xs text-muted-foreground">{item.href}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveItem(index, 'up')} disabled={index === 0}><ArrowUp className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveItem(index, 'down')} disabled={index === items.length - 1}><ArrowDown className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}><Edit className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteItem(item.id)}><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
                        <p>No menu items yet. Add one to get started.</p>
                    </div>
                )}
            </CardContent>
             <ItemDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onSave={handleSaveItem} item={editingItem} />
        </Card>
    );
}

// Main page component
export default function AdminMenusPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3"><Menu className="w-8 h-8"/> Menu Management</h1>
                <p className="text-muted-foreground">Control the navigation menus for the header and footer.</p>
            </div>
            
            <Tabs defaultValue="header" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="header">Header Menu</TabsTrigger>
                    <TabsTrigger value="footer">Footer Menu</TabsTrigger>
                </TabsList>
                <TabsContent value="header" className="mt-6">
                    <MenuEditor menuId="header" menuName="Header Navigation" />
                </TabsContent>
                <TabsContent value="footer" className="mt-6">
                    <MenuEditor menuId="footer" menuName="Footer Links" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
