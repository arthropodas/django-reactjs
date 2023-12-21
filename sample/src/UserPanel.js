import React, { useEffect, useState } from 'react';
import webSocketService from './WebSocketService';

function UserPanel() {
  const [liveScores, setLiveScores] = useState({ team_a: 0, team_b: 0 });

  useEffect(() => {
    const handleScoreUpdate = (data) => {
      setLiveScores({
        team_a: data.team_a,
        team_b: data.team_b,
      });
    };

    webSocketService.onMessage(handleScoreUpdate);

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>User Panel</h1>
      <p>
        Live Scores: Team A - {liveScores.team_a}, Team B - {liveScores.team_b}
      </p>
    </div>
  );
}

export default UserPanel;
