export type IngestionStatus = 'PENDING' | 'PROCESSING' | 'INDEXING' | 'SUCCEEDED' | 'FAILED';

export interface Document {
    id: string;
    title: string;
    sourceUrl?: string;
    clientId: string;
    createdAt: string;
    updatedAt: string;
    ingestionJobs?: IngestionJob[];
}

export interface IngestionJob {
    id: string;
    documentId: string;
    status: IngestionStatus;
    attempts: number;
    lastError?: string;
    createdAt: string;
    updatedAt: string;
    finishedAt?: string;
}

export interface Citation {
    documentId: string;
    text: string;
    page?: number;
    score?: number;
}

export interface QueryResult {
    answer: string;
    confidence?: number;
    model?: string;
    citations: Citation[];
}

export interface CreateDocumentResponse {
    id: string;
    message: string;
}
