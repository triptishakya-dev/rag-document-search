import { Document, IngestionJob, QueryResult, CreateDocumentResponse, IngestionStatus } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
    }
    return response.json();
}

export const api = {
    // Document Management
    getDocuments: async (): Promise<Document[]> => {
        return fetchJson<Document[]>('/documents');
    },

    getDocument: async (id: string): Promise<Document> => {
        return fetchJson<Document>(`/documents/${id}`);
    },

    uploadDocument: async (file: File): Promise<CreateDocumentResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        // Using fetch directly for FormData to avoid Content-Type header issues
        const response = await fetch(`${API_BASE_URL}/documents`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Upload failed ${response.status}: ${errorBody || response.statusText}`);
        }
        return response.json();
    },

    getSchema: async (): Promise<any> => {
        return fetchJson('/openapi.json');
    },

    // Ingestion
    startIngestion: async (id: string): Promise<IngestionJob> => {
        return fetchJson<IngestionJob>(`/documents/${id}/ingest`, {
            method: 'POST',
        });
    },

    getIngestionStatus: async (id: string): Promise<IngestionStatus> => {
        const doc = await fetchJson<Document>(`/documents/${id}`);
        // Assuming the backend returns the latest job or status on the document
        // If not, we might need a specific endpoint for status
        // For now, let's assume we look at the latest job
        if (doc.ingestionJobs && doc.ingestionJobs.length > 0) {
            return doc.ingestionJobs[0].status;
        }
        return 'PENDING'; // Default if no jobs
    },

    // Q&A
    query: async (question: string, documentId?: string): Promise<QueryResult> => {
        return fetchJson<QueryResult>('/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, documentId }),
        });
    },
};
