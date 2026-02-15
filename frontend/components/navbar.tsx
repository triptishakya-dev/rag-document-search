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

  const handleUpload = () => {
    setIsUploading(true);
    setUploadStep('uploading');
    setUploadProgress(10);

    // Simulate upload process
    setTimeout(() => {
      setUploadProgress(30);
      setUploadStep('chunking');
    }, 2000);

    setTimeout(() => {
      setUploadProgress(60);
      setUploadStep('embedding');
    }, 4000);

    setTimeout(() => {
      setUploadProgress(90);
      setUploadStep('saving');
    }, 7000);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep('completed');
      setTimeout(() => {
         setIsUploading(false);
         setUploadStep('idle');
         setUploadProgress(0);
      }, 2000);
    }, 9000);
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
              <button className="hidden md:flex bg-zinc-900 text-white hover:bg-zinc-800 transition-colors font-semibold h-9 px-4 text-sm items-center justify-center rounded-md shadow-sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Documents to Knowledge Base</DialogTitle>
                <DialogDescription>
                  Upload your documents (PDF, TXT, MD) to train the AI. It will analyze the content to provide accurate answers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm mb-1">
                       <span className="font-semibold text-zinc-700">Processing Document...</span>
                       <span className="text-zinc-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center gap-3">
                         <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${uploadStep === 'uploading' || uploadProgress > 10 ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-400'}`}>
                            {uploadProgress > 30 ? <Check className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-medium ${uploadStep === 'uploading' ? 'text-zinc-900' : 'text-zinc-500'}`}>Uploading to AWS S3</p>
                            {uploadStep === 'uploading' && <p className="text-xs text-zinc-400">Securely storing your file...</p>}
                         </div>
                         {uploadStep === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                      </div>

                      <div className="flex items-center gap-3">
                         <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${uploadStep === 'chunking' || uploadProgress > 30 ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-400'}`}>
                             {uploadProgress > 60 ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-medium ${uploadStep === 'chunking' ? 'text-zinc-900' : 'text-zinc-500'}`}>Processing & Chunking</p>
                            {uploadStep === 'chunking' && <p className="text-xs text-zinc-400">Splitting content into manageable parts...</p>}
                         </div>
                         {uploadStep === 'chunking' && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                      </div>

                      <div className="flex items-center gap-3">
                         <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${uploadStep === 'embedding' || uploadProgress > 60 ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-400'}`}>
                             {uploadProgress > 90 ? <Check className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-medium ${uploadStep === 'embedding' ? 'text-zinc-900' : 'text-zinc-500'}`}>Creating Embeddings</p>
                            {uploadStep === 'embedding' && <p className="text-xs text-zinc-400">Generating vector representations...</p>}
                         </div>
                         {uploadStep === 'embedding' && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                      </div>

                      <div className="flex items-center gap-3">
                         <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${uploadStep === 'saving' || uploadProgress === 100 ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-400'}`}>
                             {uploadProgress === 100 ? <Check className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-medium ${uploadStep === 'saving' ? 'text-zinc-900' : 'text-zinc-500'}`}>Saving to QdrantDB</p>
                            {uploadStep === 'saving' && <p className="text-xs text-zinc-400">Indexing for fast retrieval...</p>}
                         </div>
                         {uploadStep === 'saving' && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-4 text-zinc-400" />
                      <p className="mb-2 text-sm text-zinc-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-zinc-500">Supports PDF, TXT, MD, DOCX (Max 10MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                )}
              </div>
              <DialogFooter>
                {!isUploading && (
                  <button type="submit" onClick={handleUpload} className="bg-zinc-900 text-white hover:bg-zinc-800 h-9 px-4 rounded-md text-sm font-medium transition-colors">
                    Upload files
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
