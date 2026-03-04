import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * useSSE - A hook that opens a Server-Sent Events connection to the backend stream.
 * 
 * @param {Object} handlers - A map of event_type strings to callback functions.
 *   e.g. { 'reservation.updated': () => refetchReservations(), 'menu.updated': () => refetchMenu() }
 */
export function useSSE(handlers) {
    const handlersRef = useRef(handlers);

    // Keep the handlers ref fresh without restarting the connection
    useEffect(() => {
        handlersRef.current = handlers;
    });

    useEffect(() => {
        const url = `${API_URL}/api/events/stream`;
        let es;
        let reconnectTimeout;

        const connect = () => {
            es = new EventSource(url);

            es.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const type = data?.event_type;
                    if (type && handlersRef.current?.[type]) {
                        handlersRef.current[type](data);
                    }
                } catch (e) {
                    // Ignore malformed events (e.g. keep-alive pings)
                }
            };

            es.onerror = () => {
                es.close();
                // Auto-reconnect after 3 seconds on disconnect / error
                reconnectTimeout = setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            clearTimeout(reconnectTimeout);
            es?.close();
        };
    }, []); // Empty dependency array: connect once, never restart
}
