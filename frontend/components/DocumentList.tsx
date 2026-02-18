'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Trash2, Filter, SortAsc, MoreVertical, Files, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

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
    <section className="h-full flex flex-col bg-zinc-50/30">
      {/* Header Section */}
      <div className="bg-zinc-100/80 backdrop-blur-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-200 z-10">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Files className="w-6 h-6 text-zinc-700" />
            Documents
          </h2>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and organize your knowledge base.</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
            <SortAsc className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300" onClick={fetchDocuments} title="Refresh List">
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
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" />
                <p className="text-zinc-500 text-sm">Loading documents...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-min">
              {filteredDocs.map((doc) => (
                <Card key={doc.id} className="group hover:border-zinc-300 hover:shadow-lg transition-all bg-white border-zinc-200 duration-300">
                  <div className="flex flex-col h-full p-0">
                    <div className="flex flex-row items-start justify-between p-4 pb-0">
                      <div className="p-2.5 bg-zinc-100 text-zinc-900 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      {/* Placeholder for actions dropdown if needed */}
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-700 -mr-2 -mt-2">
                        <MoreVertical className="w-4 h-4" />
                    </Button> */}
                    </div>

                    <div className="px-4 py-3 flex-1">
                      <h3 className="font-bold text-zinc-900 truncate text-sm leading-snug" title={doc.title}>
                        {doc.title}
                      </h3>
                      <div className="text-xs text-zinc-400 mt-2 flex gap-2 items-center font-medium">
                        <span>PDF</span> {/* Assuming PDF for now */}
                        <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                        <span>{formatDate(doc.createdAt)}</span>
                      </div>
                    </div>

                    <div className="px-4 py-3 mt-auto flex gap-2 border-t border-zinc-50 bg-zinc-50/50 rounded-b-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-8 text-xs border-zinc-200 hover:bg-white hover:border-zinc-300 hover:text-zinc-900 text-zinc-600 font-medium"
                        onClick={() => window.open(doc.sourceUrl || '#', '_blank')}
                        disabled={!doc.sourceUrl}
                      >
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                      {/* Delete functionality to be implemented */}
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                    </Button> */}
                    </div>
                  </div>
                </Card>
              ))}

              {!isLoading && filteredDocs.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900">No documents found</h3>
                  <p className="text-zinc-500 text-sm mt-1">Upload a document to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
