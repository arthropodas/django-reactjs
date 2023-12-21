import Stomp from 'webstomp-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.connectCallbacks = [];

    const socket = new WebSocket('ws://localhost:8000/ws/scores/');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      console.log('WebSocket Connected');
      this.isConnected = true;

      // Notify all the waiting callbacks that the connection is open
      this.connectCallbacks.forEach((callback) => callback());

      // Clear the connect callbacks array
      this.connectCallbacks = [];
    });
  }

  updateScores(matchId, scoreTeam1, scoreTeam2) {
    if (this.isConnected) {
      const message = JSON.stringify({
        match_id: matchId,
        score_team1: scoreTeam1,
        score_team2: scoreTeam2,
      });
      this.stompClient.send('/ws/scores/', message, {});
    } else {
      // If not connected, wait for the connection and then send the message
      this.connect(() => {
        /* global message */
        this.stompClient.send('/ws/scores/', message, {});
      });
    }
  }

  onMessage(callback) {
    this.stompClient.subscribe('/ws/scores/', (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  connect(callback) {
    // If already connected, invoke the callback immediately
    if (this.isConnected) {
      callback();
    } else {
      // Otherwise, add the callback to the array
      this.connectCallbacks.push(callback);
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
