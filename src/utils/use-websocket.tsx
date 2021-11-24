import { useState, useEffect, useRef, useCallback } from 'react';
import { WebsocketConnectionStatus } from './constants';

interface WebsocketParams {
    websocketURL: string;
    reconnect?: boolean;
    onError?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
}

const readyStates = [
    WebsocketConnectionStatus.connecting, // 0
    WebsocketConnectionStatus.open, // 1
    WebsocketConnectionStatus.closing, // 2
    WebsocketConnectionStatus.closed, // 3
];

export default function useWebsocket({ websocketURL, reconnect, onError, onClose, onOpen }: WebsocketParams) {
    const ws = useRef<any>(null);
    const [lastMessage, setLastMessage] = useState<any>();
    const [connectionStatus, setConnectionStatus] = useState<any>(WebsocketConnectionStatus.connecting);

    useEffect(() => {
        ws.current = new WebSocket(websocketURL);
        initWebsocketEvents(ws.current);
        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        setConnectionStatus(readyStates[ws.current.readyState]);
    }, [ws?.current?.readyState]);

    const handleReconnectIfAllowed = () => {
        if (reconnect) {
            ws.current = new WebSocket(websocketURL);
            initWebsocketEvents(ws.current);
        }
    }

    const initWebsocketEvents = (ws: WebSocket) => {
        ws.onopen = () => {
            setConnectionStatus(WebsocketConnectionStatus.open);
            if (onOpen) onOpen();
        }
        ws.onclose = (e) => {
            console.log(e);
            if (onClose) onClose();
            handleReconnectIfAllowed();
        }
        ws.onerror = (e) => {
            console.log(e);
            if (onError) onError();
            handleReconnectIfAllowed();
        }
        ws.onmessage = (message) => {
            setLastMessage(message);
        }
    }

    const sendJsonMessage = (message) => {
        try {
            if (ws.current.readyState === 1)
                ws.current?.send(JSON.stringify(message));
        } catch (e) {
            console.error(e);
        }
    }

    return { sendJsonMessage, lastMessage, connectionStatus };
}