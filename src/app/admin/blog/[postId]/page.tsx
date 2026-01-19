
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BlogPost } from '@/lib/types/blog';
import { useDoc, useFirestore, useUser, setDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save, Trash2, RotateCcw, PenSquare } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { slugify } from '@/lib/utils';
import Link from 'next/link';

const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long.'),
  content: z.string().min(10, 'Content is too short.'),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.string().optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  excerpt: z.string().max(200, 'Excerpt cannot exceed 200 characters.').optional(),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters.').optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user, userProfile } = useUser();

  const postId = params.postId as string;
  const isNewPost = postId === 'new';

  const { data: post, loading: isLoadingPost } = useDoc<BlogPost>(isNewPost ? null : `blogs/${postId}`);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      tags: '',
      featuredImage: '',
      excerpt: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        status: post.status,
        tags: post.tags?.join(', '),
        featuredImage: post.featuredImage,
        excerpt: post.excerpt,
        metaDescription: post.metaDescription,
      });
    }
  }, [post, form]);

  const handleSlugify = useCallback(() => {
    const title = form.getValues('title');
    if (title) {
      form.setValue('slug', slugify(title), { shouldValidate: true });
    }
  }, [form]);

  const onSubmit = async (data: BlogPostFormValues) => {
    if (!user || !userProfile) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const toastId = toast.loading(isNewPost ? 'Creating post...' : 'Updating post...');

    const postData: Omit<BlogPost, 'id' | 'createdAt'> & {updatedAt: any, createdAt?: any} = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      status: data.status,
      tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
      featuredImage: data.featuredImage,
      excerpt: data.excerpt,
      metaDescription: data.metaDescription,
      authorId: user.uid,
      authorName: userProfile.displayName,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isNewPost) {
        postData.createdAt = serverTimestamp();
        const collectionRef = collection(firestore, 'blogs');
        const newDoc = await addDocumentNonBlocking(collectionRef, postData);
        toast.success('Post created successfully!', { id: toastId });
        router.push(`/admin/blog/${newDoc.id}`);
      } else {
        const docRef = doc(firestore, 'blogs', postId);
        setDocumentNonBlocking(docRef, postData, { merge: true });
        toast.success('Post updated successfully!', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.', { id: toastId });
    }
  };

  const handleDelete = () => {
    if (isNewPost) return;
    if (!confirm('Are you sure you want to permanently delete this post?')) return;
    const toastId = toast.loading('Deleting post...');
    const docRef = doc(firestore, 'blogs', postId);
    deleteDocumentNonBlocking(docRef);
    toast.success('Post deleted.', { id: toastId });
    router.push('/admin/blog');
  }

  if (isLoadingPost) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>;
  }
  
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild className="gap-2">
                    <Link href="/admin/blog"><ArrowLeft className="w-4 h-4"/> Back to Posts</Link>
                </Button>
                <div className="flex items-center gap-2">
                    {!isNewPost && (
                        <Button type="button" variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2"/> Delete</Button>
                    )}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                        <Save className="w-4 h-4 mr-2"/> {isNewPost ? 'Create Post' : 'Save Changes'}
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
                                    <FormControl><Input placeholder="E.g. Top 10 Anime of the Season" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl><Textarea placeholder="Write your article here. You can use Markdown." {...field} rows={20} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Excerpt</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="excerpt" render={({ field }) => (
                                <FormItem>
                                    <FormControl><Textarea placeholder="A short summary of the post..." {...field} rows={4} /></FormControl>
                                    <FormDescription>This will be shown in post previews. Keep it concise.</FormDescription>
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
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            {!isNewPost && post && (
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>Created: {format(post.createdAt.toDate(), 'MMM d, yyyy, h:mm a')}</p>
                                    <p>Updated: {format(post.updatedAt.toDate(), 'MMM d, yyyy, h:mm a')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl><Input placeholder="post-slug-here" {...field} /></FormControl>
                                        <Button type="button" variant="outline" size="icon" onClick={handleSlugify}><RotateCcw className="w-4 h-4"/></Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl><Input placeholder="action, comedy, shonen" {...field} /></FormControl>
                                     <FormDescription>Comma-separated list of tags.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>SEO & Appearance</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <FormField control={form.control} name="featuredImage" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Featured Image URL</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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
