import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchMessage } from './api';
import { Box, Card, CardContent } from '@mui/material';
import Icon from '@mui/icons-material/Star';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  // バックエンドからメッセージ取得
  const handleClick = async () => {
    const data = await fetchMessage();
    setMessage(data.message);
  };

  return (
    <div className="App">
      {/* カウントダウン */}
      <div className="countdown-card">
        <h1 className="countdown-title">試験まで</h1>
        <p className="countdown-days">
          あと
          <span className="day-number">3</span>
          日
        </p>
      </div>

      {/* 今日の目標カード */}
      <Card className="goal-card">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🎯 今日の目標
          </Typography>
          <Typography variant="h4" className="goal-text">
            今日1日頑張ろう！
          </Typography>
        </CardContent>
      </Card>

      {/* Vite + React 部分 */}
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Hackathon Webアプリ 部分 */}
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hackathon Webアプリ
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon />}
          onClick={handleClick}
        >
          バックエンドからメッセージ取得
        </Button>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </div>
  );
}

export default App;

