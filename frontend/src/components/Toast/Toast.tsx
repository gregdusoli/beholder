import { Notyf } from "notyf";
import useWebSocket from 'react-use-websocket';

const websocketUrl = import.meta.env.VITE_WS_URL;

function Toast() {
  const session = localStorage.getItem('session') ?? "";
  const token = JSON.parse(session).token;

  const { lastJsonMessage: message }: any = useWebSocket(websocketUrl, {
    onOpen: () => console.log('WebSocket connected'),
    onMessage: () => {
      if (message?.notification?.text) {
        const notyf = new Notyf({
          position: { x: 'right', y: 'top' },
          duration: 3000,
          types: [{
            type: 'success',
            dismissible: true,
          },
          {
            type: 'error',
            dismissible: true,
          }]
        });

        notyf.open({
          type: message.notification.type,
          message: message.notification.text
        });
      }
    },
    queryParams: { token },
    onError: (error) => console.log('WebSocket error:', error),
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    reconnectAttempts: 10,
  });

  return <></>;
}

export default Toast;