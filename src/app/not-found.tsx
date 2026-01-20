
'use client';

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground space-y-4 text-center p-4">
      <AlertTriangle className="h-16 w-16 text-primary" />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="max-w-md text-muted-foreground">
        Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  )
}
