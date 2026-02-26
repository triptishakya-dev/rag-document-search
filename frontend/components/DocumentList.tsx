'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, Filter, SortAsc, MoreVertical, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Document {
  id: string;
  title: string;
  sourceUrl: string | null;
  createdAt: string;
  clientId: string;
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const itemsPerPage = 8;

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredDocs = documents
    .filter(doc => doc.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="h-full flex flex-col bg-background/50">
      {/* Header Section */}
      <div className="bg-background/80 backdrop-blur-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-border/40 z-10">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Documents
          </h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Manage and organize your knowledge base.</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-background border-border/60 focus-visible:ring-primary"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-border/60 rounded-md bg-background">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none rounded-l-md border-r border-border/60 ${viewMode === 'card' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('card')}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none rounded-r-md ${viewMode === 'table' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" className="shrink-0 border-border/60 hover:bg-muted" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
            <SortAsc className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 border-border/60 hover:bg-muted" onClick={fetchDocuments} title="Refresh List">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col pt-6 px-8">

        {/* Documents Content */}
        <div className="flex-1 overflow-y-auto pb-20 pr-2">
          {isLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground text-sm">Loading documents...</p>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-min mb-8">
                  {currentDocuments.map((doc) => (
                    <Card key={doc.id} className="group hover:border-primary/50 hover:shadow-lg transition-all bg-card border-border/40 duration-300 overflow-hidden flex flex-col">
                      <div className="flex flex-col h-full">
                        <div className="px-4 py-4 flex-1">
                          <h3 className="font-bold text-black truncate text-sm leading-snug" title={doc.title}>
                            {doc.title}
                          </h3>
                          <div className="text-xs text-black/60 mt-2 flex gap-2 items-center font-medium">
                            <span>PDF</span>
                            <span className="w-1 h-1 rounded-full bg-black/20"></span>
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>

                        <div className="px-4 py-3 mt-auto flex gap-2 border-t border-border/40 bg-muted/20">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs border-border/60 hover:bg-background hover:border-primary/30 hover:text-primary font-medium"
                            onClick={() => window.open(doc.sourceUrl || '#', '_blank')}
                            disabled={!doc.sourceUrl}
                          >
                            <Download className="w-3 h-3 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-border/40 mb-8 overflow-hidden bg-card">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[400px]">Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentDocuments.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <span className="truncate max-w-[300px]" title={doc.title}>{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              PDF
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(doc.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(doc.sourceUrl || '#', '_blank')}
                              disabled={!doc.sourceUrl}
                            >
                              <Download className="w-4 h-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!isLoading && filteredDocs.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border/40 rounded-xl bg-muted/10 my-4">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No documents found</h3>
                  <p className="text-muted-foreground text-sm mt-1">Upload a document to get started.</p>
                </div>
              )}

              {/* Pagination Controls */}
              {filteredDocs.length > itemsPerPage && (
                <div className="py-4 border-t border-border/40 mt-auto">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Logic to show limited pages if many pages exist could go here
                        // For now, showing all or simple logic
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
