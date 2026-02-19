'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Trash2, Filter, SortAsc, MoreVertical, Files, RefreshCw } from 'lucide-react';
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

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const filteredDocs = documents
    .filter(doc => doc.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Files className="w-6 h-6" />
            </div>
            Documents
          </h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Manage and organize your knowledge base.</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-background border-border/60 focus-visible:ring-primary"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
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

        {/* Documents Grid/List */}
        <div className="flex-1 overflow-y-auto pb-20 pr-2">
          {isLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground text-sm">Loading documents...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-min">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="group hover:border-primary/50 hover:shadow-lg transition-all bg-card border-border/40 duration-300 overflow-hidden flex flex-col">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-row items-start justify-between p-4 pb-0">
                      <div className="p-3 bg-muted text-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="px-4 py-3 flex-1">
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

              {!isLoading && filteredDocs.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border/40 rounded-xl bg-muted/10">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No documents found</h3>
                  <p className="text-muted-foreground text-sm mt-1">Upload a document to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
