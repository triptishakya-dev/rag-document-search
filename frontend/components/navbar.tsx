'use client';

import * as React from "react"
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Package2, Search, Upload, LayoutDashboard, User, Check, Loader2, FileText, Database, Server, Cpu, Home, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export const Header = () => {
  const pathname = usePathname();
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStep, setUploadStep] = React.useState<'idle' | 'uploading' | 'chunking' | 'embedding' | 'saving' | 'completed'>('idle');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const file = selectedFile;
    setIsUploading(true);
    setUploadStep('uploading');
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate/Show upload progress for better UX before API completes
      setUploadProgress(30);
      setUploadStep('chunking');

      const response = await fetch('/api/upload-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message || "Duplicate document uploaded.");
        setIsUploading(false);
        setUploadStep('idle');
        setUploadProgress(0);
        return;
      }

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(60);
      setUploadStep('embedding');

      // Wait a bit to show the embedding step
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadProgress(90);
      setUploadStep('saving');

      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadProgress(100);
      setUploadStep('completed');

      setTimeout(() => {
        setIsUploading(false);
        setUploadStep('idle');
        setUploadProgress(0);
        setSelectedFile(null);
        toast.success("Document uploaded successfully!");
      }, 2000);

    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      setUploadStep('idle');
      setUploadProgress(0);
      toast.error('Failed to upload document. Please try again.');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="w-full max-w-7xl mx-auto flex h-24 items-center px-6">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-3 group">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 ring-2 ring-primary/20 group-hover:ring-primary/50">
              <Image
                src="/documentation.png"
                alt="DocSearch+ Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="hidden font-bold sm:inline-block text-foreground tracking-tight text-3xl group-hover:text-primary transition-colors duration-300">
              DocSearch<span className="text-primary">+</span>
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 px-5 py-3 h-auto data-[active]:bg-muted data-[active]:text-foreground", pathname === '/' && "bg-muted text-foreground font-semibold shadow-sm")}>
                  <Link href="/">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 px-5 py-3 h-auto data-[active]:bg-muted data-[active]:text-foreground", pathname === '/how-it-work' && "bg-muted text-foreground font-semibold shadow-sm")}>
                  <Link href="/how-it-work">
                    How it Works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-background border-r border-border">
            <div className="px-7">
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-3 overflow-hidden rounded-lg">
                  <Image
                    src="/documentation.png"
                    alt="DocSearch+ Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-xl">DocSearch+</span>
              </Link>
            </div>
            <div className="flex flex-col gap-4 py-8 px-2">
              <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <Home className="h-5 w-5" /> Home
              </Link>
              <Link href="/upload" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/upload' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <Upload className="h-5 w-5" /> Upload
              </Link>
              <Link href="/how-it-work" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/how-it-work' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <HelpCircle className="h-5 w-5" /> How it Works
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="hidden px-4 py-6 md:flex font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent className={`${selectedFile ? 'sm:max-w-[800px]' : 'sm:max-w-[500px]'} bg-background/95 backdrop-blur-md border-border text-foreground transition-all duration-300`}>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {selectedFile ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})` : "Select a PDF to extract insights. We support files up to 10MB."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-foreground">Processing {selectedFile?.name}...</span>
                      <span className="text-muted-foreground font-mono text-xs">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />

                    <div className="space-y-4 mt-6">
                      {['uploading', 'chunking', 'embedding', 'saving'].map((step, index) => {
                        const steps = ['uploading', 'chunking', 'embedding', 'saving'];
                        // Simple logic to determine state of each step based on current step
                        const currentIndex = steps.indexOf(uploadStep as string);
                        const stepIndex = steps.indexOf(step);
                        const isCompleted = stepIndex < currentIndex || uploadStep === 'completed';
                        const isCurrent = step === uploadStep;

                        let icon = <Server className="h-5 w-5" />;
                        let title = "Uploading to Cloud";
                        let desc = "Securely storing your file...";

                        if (step === 'chunking') { icon = <FileText className="h-5 w-5" />; title = "Processing Content"; desc = "Analyzing text structure..."; }
                        if (step === 'embedding') { icon = <Cpu className="h-5 w-5" />; title = "Generating Embeddings"; desc = "Creating vector representations..."; }
                        if (step === 'saving') { icon = <Database className="h-5 w-5" />; title = "Indexing Data"; desc = "Making it searchable..."; }

                        return (
                          <div key={step} className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${isCompleted || isCurrent ? 'bg-primary border-primary text-primary-foreground scale-100' : 'border-border text-muted-foreground scale-95'}`}>
                              {isCompleted ? <Check className="h-5 w-5" /> : icon}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className={`text-sm font-medium transition-colors ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</p>
                              {isCurrent && <p className="text-xs text-muted-foreground animate-pulse">{desc}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    {!selectedFile ? (
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-4 rounded-full bg-muted border border-border mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, TXT (Max 10MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileSelect} />
                        </label>
                      </div>
                    ) : (
                      <div className="w-full bg-muted/30 border border-border rounded-xl p-8 flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20 shadow-2xl">
                            <FileText className="w-16 h-16 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 grid gap-3">
                          <div className="flex items-center gap-3 border-b border-border pb-2">
                            <p className="text-lg font-semibold text-foreground truncate flex-1">{selectedFile.name}</p>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{new Date(selectedFile.lastModified).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-6 mt-1">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">File Size</p>
                              <span className="text-4xl font-bold text-foreground tracking-tight">{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="h-10 w-px bg-border" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Type</p>
                              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="self-start -mt-2 -mr-2 p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                          <span className="sr-only">Remove</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <DialogFooter>
                {!isUploading && (
                  <Button
                    type="submit"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="w-full"
                  >
                    {selectedFile ? 'Start Upload' : 'Select a File'}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <ModeToggle />

          </div>
        </div>
      </div>
    </header>
  );
};
