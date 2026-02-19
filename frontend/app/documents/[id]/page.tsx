'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Document, IngestionJob } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, Link as LinkIcon, RefreshCw, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function DocumentStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const doc = await api.getDocument(id);
      setDocument(doc);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch document details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartIngestion = async () => {
    try {
      setIngesting(true);
      await api.startIngestion(id);
      // Refresh document to show new job status
      await fetchDocument();
    } catch (err: any) {
      alert(err.message || 'Failed to start ingestion');
    } finally {
      setIngesting(false);
    }
  };

  if (loading) {
    return <div className="h-[calc(100vh-4rem)] flex items-center justify-center"><Loader size="lg" /></div>;
  }

  if (error || !document) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-destructive flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error || 'Document not found'}</span>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCEEDED': return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Succeeded</Badge>;
      case 'FAILED': return <Badge variant="error" className="gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
      case 'PENDING': return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 py-8 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Button variant="ghost" className="mb-4 pl-0 text-muted-foreground hover:text-foreground -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Documents
          </Button>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-8 h-8" />
            </div>
            {document.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-md w-fit border border-border/50">ID: {document.id}</p>
        </div>
        <Button onClick={handleStartIngestion} disabled={ingesting} size="lg" className="shadow-lg shadow-primary/20">
          {ingesting ? <Loader size="sm" className="mr-2 text-primary-foreground" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {document.ingestionJobs && document.ingestionJobs.length > 0 ? 'Restart Ingestion' : 'Start Ingestion'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6 space-y-6 bg-background/50 border-border/60 shadow-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border/40 pb-4">
              Document Details
            </h2>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                  <LinkIcon className="w-4 h-4" /> Source URL
                </dt>
                <dd className="text-sm font-medium text-foreground truncate break-all">
                  {document.sourceUrl ? (
                    <a href={document.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">
                      {document.sourceUrl}
                    </a>
                  ) : 'N/A'}
                </dd>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" /> Created At
                </dt>
                <dd className="text-sm font-medium text-foreground">{new Date(document.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground px-1">Ingestion History</h2>
            {document.ingestionJobs && document.ingestionJobs.length > 0 ? (
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
                <div className="divide-y divide-border/40">
                  {document.ingestionJobs.map((job: IngestionJob) => (
                    <div key={job.id} className="p-6 transition-colors hover:bg-muted/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {getStatusBadge(job.status)}
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                            Attempt {job.attempts}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(job.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {job.lastError && (
                        <div className="mt-4 text-sm text-destructive bg-destructive/5 p-3 rounded-lg border border-destructive/10 flex gap-2 items-start">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p>{job.lastError}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/10 border-2 border-dashed border-border/40 rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No ingestion jobs found.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Start ingestion to process this document.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (if needed for metadata or actions) */}
        <div className="space-y-6">
          {/* Quick Actions or Stats could go here */}
        </div>
      </div>
    </div>
  );
}
