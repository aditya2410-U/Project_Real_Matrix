export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private sessionId: string;
    private onMessageCallback: (content: string, language?: string) => void;

    constructor(
        sessionId: string, 
        onMessage: (content: string, language?: string) => void
    ) {
        this.sessionId = sessionId;
        this.onMessageCallback = onMessage;
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(`ws://localhost:8080/ws?sessionId=${this.sessionId}`);
        
        this.ws.onopen = () => {
            console.log('Connected to WebSocket');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'code_change') {
                this.onMessageCallback(message.content, message.language);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket closed');
            this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
        }
    }

    sendMessage(content: string, language?: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'code_change',
                content,
                sessionId: this.sessionId,
                language
            }));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}