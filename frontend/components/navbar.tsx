'use client';

import * as React from "react"
import Link from 'next/link';
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
import { Menu, Package2, Search, Upload, LayoutDashboard, User, Check, Loader2, FileText, Database, Server, Cpu } from "lucide-react"

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
        alert("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const file = selectedFile;
    // setIsUploading(true); // Moved down to avoid state update on unmounted component if immediate error


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

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(60);
      setUploadStep('embedding');

      // Wait a bit to show the embedding step (optional, but consistent with previous UX)
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
      }, 2000);

    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      setUploadStep('idle');
      setUploadProgress(0);
      alert('Failed to upload document. Please try again.');
    }
  };

  return (
    <header className="sticky  top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80">
      <div className="container px-10 mx-auto w-[80%] flex h-16 items-center px-6">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-black shadow-inner shadow-zinc-400">
              <Package2 className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-zinc-100 tracking-tight text-lg">
              DocSearch+
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors data-[active]:bg-zinc-800 data-[active]:text-white", pathname === '/' && "bg-zinc-900 text-zinc-100")}>
                  <Link href="/">
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors data-[active]:bg-zinc-800 data-[active]:text-white", pathname === '/query' && "bg-zinc-900 text-zinc-100")}>
                  <Link href="/query">
                    Query
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="mr-2 px-0 text-base text-zinc-400 hover:bg-transparent hover:text-white focus-visible:bg-transparent focus-visible:outline-none md:hidden inline-flex items-center justify-center transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-black border-r border-zinc-800 text-zinc-100">
            <div className="px-7">
              <Link href="/" className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-black mr-2">
                  <Package2 className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg">DocSearch+</span>
              </Link>
            </div>
            <div className="flex flex-col gap-4 py-8 px-2">
              <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
                <LayoutDashboard className="h-5 w-5" /> Dashboard
              </Link>
              <Link href="/upload" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/upload' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
                <Upload className="h-5 w-5" /> Upload
              </Link>
              <Link href="/query" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/query' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
                <Search className="h-5 w-5" /> Query
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other content could go here */}
          </div>



          <Dialog>
            <DialogTrigger asChild>
              <button className="hidden md:flex bg-zinc-100 text-black hover:bg-zinc-200 transition-colors font-semibold h-9 px-4 text-sm items-center justify-center rounded-md shadow-sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </button>
            </DialogTrigger>
            <DialogContent className={`${selectedFile ? 'sm:max-w-[800px]' : 'sm:max-w-[500px]'} bg-zinc-950 border-zinc-800 text-zinc-100 transition-all duration-300`}>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {selectedFile ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})` : "Select a PDF to extract insights. We support files up to 10MB."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-zinc-200">Processing {selectedFile?.name}...</span>
                      <span className="text-zinc-400 font-mono text-xs">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2 bg-zinc-900" indicatorClassName="bg-white" />

                    <div className="space-y-4 mt-6">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${uploadStep === 'uploading' || uploadProgress > 10 ? 'bg-white border-white text-black scale-100' : 'border-zinc-800 text-zinc-600 scale-95'}`}>
                          {uploadProgress > 30 ? <Check className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium transition-colors ${uploadStep === 'uploading' ? 'text-white' : 'text-zinc-500'}`}>Uploading to Cloud</p>
                          {uploadStep === 'uploading' && <p className="text-xs text-zinc-400 animate-pulse">Securely storing your file...</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${uploadStep === 'chunking' || uploadProgress > 30 ? 'bg-white border-white text-black scale-100' : 'border-zinc-800 text-zinc-600 scale-95'}`}>
                          {uploadProgress > 60 ? <Check className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium transition-colors ${uploadStep === 'chunking' ? 'text-white' : 'text-zinc-500'}`}>Processing Content</p>
                          {uploadStep === 'chunking' && <p className="text-xs text-zinc-400 animate-pulse">Analyzing text structure...</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${uploadStep === 'embedding' || uploadProgress > 60 ? 'bg-white border-white text-black scale-100' : 'border-zinc-800 text-zinc-600 scale-95'}`}>
                          {uploadProgress > 90 ? <Check className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium transition-colors ${uploadStep === 'embedding' ? 'text-white' : 'text-zinc-500'}`}>Generating Embeddings</p>
                          {uploadStep === 'embedding' && <p className="text-xs text-zinc-400 animate-pulse">Creating vector representations...</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${uploadStep === 'saving' || uploadProgress === 100 ? 'bg-white border-white text-black scale-100' : 'border-zinc-800 text-zinc-600 scale-95'}`}>
                          {uploadProgress === 100 ? <Check className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm font-medium transition-colors ${uploadStep === 'saving' ? 'text-white' : 'text-zinc-500'}`}>Indexing Data</p>
                          {uploadStep === 'saving' && <p className="text-xs text-zinc-400 animate-pulse">Making it searchable...</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {!selectedFile ? (
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-600 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" />
                            </div>
                            <p className="mb-2 text-sm text-zinc-400"><span className="font-semibold text-zinc-200">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-zinc-500">PDF, TXT (Max 10MB)</p>
                          </div>
                          <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileSelect} />
                        </label>
                      </div>
                    ) : (
                      <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30 shadow-2xl">
                            <FileText className="w-16 h-16 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 grid gap-3">
                          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
                            <p className="text-lg font-semibold text-zinc-100 truncate flex-1">{selectedFile.name}</p>
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">{new Date(selectedFile.lastModified).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-6 mt-1">
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">File Size</p>
                              <span className="text-4xl font-bold text-white tracking-tight">{formatFileSize(selectedFile.size)}</span>
                            </div>
                            <div className="h-10 w-px bg-zinc-800" />
                            <div>
                              <p className="text-xs text-zinc-500 mb-1">Type</p>
                              <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="self-start -mt-2 -mr-2 p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
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
                  <button
                    type="submit"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold h-10 px-4 rounded-lg text-sm transition-all shadow-sm active:scale-[0.98]"
                  >
                    {selectedFile ? 'Start Upload' : 'Select a File'}
                  </button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-9 w-9 rounded-full ring-2 ring-zinc-800 hover:ring-zinc-600 transition-all inline-flex items-center justify-center outline-none">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="@user" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">AU</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">Admin User</p>
                  <p className="text-xs leading-none text-zinc-500">
                    admin@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer text-red-400 focus:text-red-400">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
