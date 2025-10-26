interface VapiCallResponse {
    id: string;
    status: string;
    recording?: {
        url: string;
        duration?: number;
    };
    createdAt: string;
    endedAt?: string;
}
export declare class VapiClient {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    getCallDetails(callId: string): Promise<VapiCallResponse>;
    getRecordingUrl(callId: string): Promise<string | null>;
}
export declare function createVapiClient(): VapiClient;
export {};
//# sourceMappingURL=vapi-client.d.ts.map