'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Page } from '@/lib/types/page';
import { useDoc, useFirestore, useUser, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save, Trash2, RotateCcw, PenSquare } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
  content: z.string().min(10, 'Content is too short.'),
  status: z.enum(['draft', 'published']),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters.').optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();

  const pageId = params.pageId as string;
  const isNewPage = pageId === 'new';

  const { data: page, loading: isLoadingPage } = useDoc<Page>(isNewPage ? null : `pages/${pageId}`);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
        metaDescription: page.metaDescription,
      });
    }
  }, [page, form]);

  const handleSlugify = useCallback(() => {
    const title = form.getValues('title');
    if (title) {
      form.setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [form]);

  const onSubmit = async (data: PageFormValues) => {
    const toastId = toast.loading(isNewPage ? 'Creating page...' : 'Updating page...');

    const pageData: Omit<Page, 'id' | 'createdAt'> & {updatedAt: any, createdAt?: any} = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: data.status,
      metaDescription: data.metaDescription,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isNewPage) {
        pageData.createdAt = serverTimestamp();
        const collectionRef = collection(firestore, 'pages');
        const newDoc = await addDocumentNonBlocking(collectionRef, pageData);
        toast.success('Page created successfully!', { id: toastId });
        router.push(`/admin/pages/${newDoc.id}`);
      } else {
        const docRef = doc(firestore, 'pages', pageId);
        setDocumentNonBlocking(docRef, pageData, { merge: true });
        toast.success('Page updated successfully!', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.', { id: toastId });
    }
  };

  const handleDelete = () => {
    if (isNewPage) return;
    if (!confirm('Are you sure you want to permanently delete this page?')) return;
    const toastId = toast.loading('Deleting page...');
    const docRef = doc(firestore, 'pages', pageId);
    deleteDocumentNonBlocking(docRef);
    toast.success('Page deleted.', { id: toastId });
    router.push('/admin/pages');
  }

  if (isLoadingPage) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>;
  }
  
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild className="gap-2">
                    <Link href="/admin/pages"><ArrowLeft className="w-4 h-4"/> Back to Pages</Link>
                </Button>
                <div className="flex items-center gap-2">
                    {!isNewPage && (
                        <Button type="button" variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2"/> Delete</Button>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                        <Save className="w-4 h-4 mr-2"/> {isNewPage ? 'Create Page' : 'Save Changes'}
                    </Button>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input placeholder="E.g. About Us" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Page Content</FormLabel>
                                    <FormControl><Textarea placeholder="Write your page content here. You can use Markdown." {...field} rows={20} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6 lg:sticky top-20">
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><PenSquare className="w-5 h-5"/> Publish</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            {!isNewPage && page?.createdAt && (
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>Created: {format(page.createdAt.toDate(), 'MMM d, yyyy, h:mm a')}</p>
                                    <p>Updated: {page.updatedAt ? format(page.updatedAt.toDate(), 'MMM d, yyyy, h:mm a') : 'N/A'}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Organization & SEO</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl><Input placeholder="about-us" {...field} /></FormControl>
                                        <Button type="button" variant="outline" size="icon" onClick={handleSlugify}><RotateCcw className="w-4 h-4"/></Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="metaDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl><Textarea placeholder="A concise description for search engines." {...field} rows={3} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    </Form>
  );
}
