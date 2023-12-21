import React, { useState } from 'react';
import webSocketService from './WebSocketService';

function OrganizerPanel() {
  const [matchId, setMatchId] = useState('');
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const updateScores = () => {
    webSocketService.updateScores(matchId, teamAScore, teamBScore);
  };

  return (
    <div>
      <h1>Organizer Panel</h1>
      <div>
        <label>Match ID:</label>
        <input
          type="text"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
        />
      </div>
      <div>
        <label>Team A Score:</label>
        <input
          type="number"
          value={teamAScore}
          onChange={(e) => setTeamAScore(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <label>Team B Score:</label>
        <input
          type="number"
          value={teamBScore}
          onChange={(e) => setTeamBScore(parseInt(e.target.value, 10))}
        />
      </div>
      <button onClick={updateScores}>Update Scores</button>
    </div>
  );
}

export default OrganizerPanel;
