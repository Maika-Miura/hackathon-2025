import { useState } from 'react';
import { fetchMessage, generateStudyPlan } from './api';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { 
  Box, Card, CardContent, 
  Typography, 
  Paper, 
  Grid, 
  Fab, 
  Modal, 
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { Add, Close, Psychology, AutoAwesome, CalendarToday, NoteAdd, Analytics } from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

// dayjs を日本語に設定
dayjs.locale('ja');

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(false);
  const [openNewLogModal, setOpenNewLogModal] = useState(false);
  const [openAIModal, setOpenAIModal] = useState(false);
  const [studyPlan, setStudyPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  
  // ログ記録用の状態
  const [logForm, setLogForm] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    studyTime: '',
    subject: '',
    memo: '',
    progress: ''
  });
  
  // フォームの状態
  const [examForm, setExamForm] = useState({
    examName: 'FP3級',
    examDate: '2025-01-26',
    dailyHours: '2',
    weakAreas: '税金、保険',
    totalHours: '100'
  });

  const handleClick = async () => {
    const data = await fetchMessage();
    setMessage(data.message);
  };

  const handleOpenModal = () => {
    setOpenNewLogModal(true);
  };

  const handleCloseModal = () => {
    setOpenNewLogModal(false);
  };

  const handleOpenAIModal = () => {
    setOpenAIModal(true);
    setSpeedDialOpen(false);
  };

  const handleCloseAIModal = () => {
    setOpenAIModal(false);
  };

  const handleSaveLog = () => {
    // ログ保存処理をここに実装
    console.log('ログを保存:', logForm);
    setOpenNewLogModal(false);
    // リセット
    setLogForm({
      date: dayjs().format('YYYY-MM-DD'),
      studyTime: '',
      subject: '',
      memo: '',
      progress: ''
    });
  };

  const handleInputChange = (field) => (event) => {
    setExamForm({
      ...examForm,
      [field]: event.target.value
    });
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    setStudyPlan('');

    try {
      const result = await generateStudyPlan({
        examName: examForm.examName,
        examDate: examForm.examDate,
        dailyHours: parseInt(examForm.dailyHours),
        weakAreas: examForm.weakAreas,
        totalHours: parseInt(examForm.totalHours)
      });

      if (result.error) {
        setError(result.error);
      } else {
        setStudyPlan(result.plan);
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // チャートデータ
  const seriesA = {
    label: '完了したタスク',
    data: [10, 15, 20, 25, 18, 30, 22],
    color: '#2E7D32',
  };

  const seriesB = {
    label: '進行中のタスク',
    data: [5, 8, 12, 10, 15, 8, 12],
    color: '#FFA726',
  };

  const seriesC = {
    label: '未着手のタスク',
    data: [8, 5, 3, 7, 4, 6, 5],
    color: '#EF5350',
  };

  const xAxisData = ['月', '火', '水', '木', '金', '土', '日'];

  const pieData = [
    { id: 0, value: 85, label: '完了', color: '#2E7D32' },
    { id: 1, value: 40, label: '進行中', color: '#FFA726' },
    { id: 2, value: 25, label: '未着手', color: '#EF5350' },
  ];

  const size = {
    width: 400,
    height: 300,
  };

  return (
    <div style={{backgroundColor: "white", width: "100vw", height: "100vh", overflow: "auto"}}>
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <Box sx={{ p: 3 }}>
          {/* カレンダーセクション */}
          <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mb: 3 }}>
            <Typography variant='h5' sx={{ color: "black", mb: 2, textAlign: 'center' }}>
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              カレンダー
            </Typography>
            <DateCalendar
              value={selectedDate}
              loading={isLoading}
              sx={{
                '& .MuiPickersDay-today': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: 'secondary.main',
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  },
                },
              }}
            />
          </Paper>

          {/* チャートセクション */}
          <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', mb: 3 }}>
            {/* BarChart */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant='h5' sx={{ color: "black", mb: 2, textAlign: 'center' }}>
                  週間タスク進捗
                </Typography>
                <BarChart
                  width={500}
                  height={300}
                  series={[
                    { ...seriesA, stack: 'total' },
                    { ...seriesB, stack: 'total' },
                    { ...seriesC, stack: 'total' },
                  ]}
                  xAxis={[{ 
                    data: xAxisData, 
                    scaleType: 'band',
                    id: 'x-axis-id'
                  }]}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
              </Paper>
            </Grid>

            {/* PieChart */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant='h5' sx={{ color: "black", mb: 2, textAlign: 'center' }}>
                  タスク分布
                </Typography>
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <PieChart 
                    series={[{ 
                      data: pieData, 
                      innerRadius: 80,
                    }]} 
                    {...size}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "black" }}>
                      進捗
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* AI生成プラン表示用ボタン */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Psychology />}
              onClick={handleOpenAIModal}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                }
              }}
            >
              AI学習プラン生成
            </Button>
          </Box>

          {/* AI学習プランセクション */}
          {studyPlan && (
            <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto', mb: 3 }}>
              <Typography variant='h5' sx={{ color: "black", mb: 2, textAlign: 'center' }}>
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI生成学習プラン
              </Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflow: 'auto',
                  '& h1': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mb: 2,
                    color: 'primary.main'
                  },
                  '& h2': {
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: 'secondary.main'
                  },
                  '& h3': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    mb: 1,
                    color: 'text.primary'
                  },
                  '& p': {
                    mb: 1,
                    lineHeight: 1.6
                  },
                  '& ul, & ol': {
                    pl: 2,
                    mb: 2
                  },
                  '& li': {
                    mb: 0.5
                  },
                  '& strong': {
                    fontWeight: 'bold',
                    color: 'primary.dark'
                  },
                  '& code': {
                    backgroundColor: 'grey.200',
                    padding: '2px 6px',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  },
                  '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                    mb: 2
                  },
                  '& th, & td': {
                    border: '1px solid',
                    borderColor: 'grey.300',
                    p: 1,
                    textAlign: 'left'
                  },
                  '& th': {
                    backgroundColor: 'grey.100',
                    fontWeight: 'bold'
                  }
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {studyPlan}
                </ReactMarkdown>
              </Box>
            </Paper>
          )}
        </Box>
      </LocalizationProvider>

      {/* Speed Dial for Multiple Actions */}
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
      >
        <SpeedDialAction
          key="log"
          icon={<NoteAdd />}
          tooltipTitle="学習ログを記録"
          onClick={handleOpenModal}
        />
        <SpeedDialAction
          key="analytics"
          icon={<Analytics />}
          tooltipTitle="進捗分析"
          onClick={() => {
            setSpeedDialOpen(false);
            // 進捗分析機能をここに実装
            console.log('進捗分析を表示');
          }}
        />
      </SpeedDial>

      {/* Modal for Study Log */}
      <Modal
        open={openNewLogModal}
        onClose={handleCloseModal}
        aria-labelledby="log-modal-title"
        aria-describedby="log-modal-description"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" id="log-modal-title">
              <NoteAdd sx={{ mr: 1, verticalAlign: 'middle' }} />
              学習ログを記録
            </Typography>
            <Button 
              onClick={handleCloseModal}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <Close />
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="学習日"
              type="date"
              value={logForm.date}
              onChange={(e) => setLogForm({...logForm, date: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="学習時間（分）"
              type="number"
              value={logForm.studyTime}
              onChange={(e) => setLogForm({...logForm, studyTime: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="例: 120"
            />
            <TextField
              label="学習科目"
              value={logForm.subject}
              onChange={(e) => setLogForm({...logForm, subject: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="例: 数学、英語、プログラミング"
            />
            <TextField
              label="学習内容・メモ"
              value={logForm.memo}
              onChange={(e) => setLogForm({...logForm, memo: e.target.value})}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              placeholder="今日学習した内容や気づいたことを記録してください"
            />
            <TextField
              label="理解度（1-10）"
              type="number"
              value={logForm.progress}
              onChange={(e) => setLogForm({...logForm, progress: e.target.value})}
              fullWidth
              variant="outlined"
              inputProps={{ min: 1, max: 10 }}
              placeholder="1（全く分からない）〜 10（完全に理解）"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              fullWidth
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveLog}
              fullWidth
              sx={{ 
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                }
              }}
            >
              ログを保存
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Modal for AI Study Plan Generator */}
      <Modal
        open={openAIModal}
        onClose={handleCloseAIModal}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" id="ai-modal-title">
              <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
              AI学習プラン生成
            </Typography>
            <Button 
              onClick={handleCloseAIModal}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <Close />
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="資格名"
              value={examForm.examName}
              onChange={(e) => setExamForm({...examForm, examName: e.target.value})}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="試験日"
              type="date"
              value={examForm.examDate}
              onChange={(e) => setExamForm({...examForm, examDate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="1日の勉強時間（時間）"
              type="number"
              value={examForm.dailyHours}
              onChange={(e) => setExamForm({...examForm, dailyHours: e.target.value})}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="苦手分野"
              value={examForm.weakAreas}
              onChange={(e) => setExamForm({...examForm, weakAreas: e.target.value})}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
            />
            <TextField
              label="想定総学習時間"
              type="number"
              value={examForm.totalHours}
              onChange={(e) => setExamForm({...examForm, totalHours: e.target.value})}
              fullWidth
              variant="outlined"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Psychology />}
            onClick={() => {
              handleGeneratePlan();
              handleCloseAIModal();
            }}
            disabled={loading}
            fullWidth
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252 30%, #FF7A7A 90%)',
              }
            }}
          >
            {loading ? 'AI学習プラン生成中...' : 'AI学習プラン生成'}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {studyPlan && (
            <Alert severity="success" sx={{ mb: 2 }}>
              学習プランが生成されました！モーダルを閉じて確認してください。
            </Alert>
          )}
        </Paper>
      </Modal>
    </div>
  );
}

export default App;
