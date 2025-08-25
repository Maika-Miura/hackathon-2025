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
  Box,
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
    // ローディング中はモーダルを閉じない
    if (!loading) {
      setOpenAIModal(false);
    }
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
        // 成功時にモーダルを閉じる
        setTimeout(() => {
          setOpenAIModal(false);
        }, 1500); // 1.5秒後に閉じる（成功メッセージを見せるため）
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // チャートデータ - 明るい色に変更
  const seriesA = {
    label: '完了したタスク',
    data: [10, 15, 20, 25, 18, 30, 22],
    color: '#00b894',
  };

  const seriesB = {
    label: '進行中のタスク',
    data: [5, 8, 12, 10, 15, 8, 12],
    color: '#fdcb6e',
  };

  const seriesC = {
    label: '未着手のタスク',
    data: [8, 5, 3, 7, 4, 6, 5],
    color: '#e84393',
  };

  const xAxisData = ['月', '火', '水', '木', '金', '土', '日'];

  const pieData = [
    { id: 0, value: 85, label: '完了', color: '#00b894' },
    { id: 1, value: 40, label: '進行中', color: '#fdcb6e' },
    { id: 2, value: 25, label: '未着手', color: '#e84393' },
  ];

  const size = {
    width: 400,
    height: 300,
  };

  return (
    <div className="main-container">
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
        <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1400px', mx: 'auto' }}>
          {/* カレンダーセクション */}
          <Paper 
            elevation={0} 
            className="chart-card"
            sx={{ p: 3, mb: 4 }}
          >
            <Typography 
              variant='h5' 
              sx={{ 
                color: "#000000", 
                mb: 3, 
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '1.8rem'
              }}
            >
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--accent-color)' }} />
              📅 カレンダー
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DateCalendar
                value={selectedDate}
                loading={isLoading}
                sx={{
                  '& .MuiPickersDay-today': {
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 4px 12px rgba(116, 185, 255, 0.4)',
                    '&:hover': {
                      backgroundColor: '#0984e3',
                      transform: 'scale(1.1)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'var(--success-color)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    boxShadow: '0 4px 12px rgba(0, 184, 148, 0.4)',
                    '&:hover': {
                      backgroundColor: '#00a085',
                      transform: 'scale(1.1)',
                    },
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    paddingLeft: 2,
                    paddingRight: 2,
                    '& .MuiPickersCalendarHeader-label': {
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#000000',
                    },
                  },
                  '& .MuiPickersDay-root': {
                    borderRadius: '12px',
                    fontWeight: '500',
                    '&:hover': {
                      backgroundColor: 'rgba(116, 185, 255, 0.15)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease',
                    },
                  },
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  },
                }}
              />
            </Box>
          </Paper>

          {/* チャートセクション */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* BarChart */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={0} className="chart-card" sx={{ p: 3, height: '100%' }}>
                <Typography 
                  variant='h5' 
                  sx={{ 
                    color: "#000000", 
                    mb: 3, 
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '1.8rem'
                  }}
                >
                  📊 週間タスク進捗
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <BarChart
                    width={Math.min(500, window.innerWidth - 100)}
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
                    margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* PieChart */}
            <Grid item xs={12} lg={6}>
              <Paper elevation={0} className="chart-card" sx={{ p: 3, height: '100%' }}>
                <Typography 
                  variant='h5' 
                  sx={{ 
                    color: "#000000", 
                    mb: 3, 
                    textAlign: 'center',
                    fontWeight: 800,
                    fontSize: '1.8rem'
                  }}
                >
                  🎯 タスク分布
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
                    <Typography variant="h6" sx={{ 
                      color: "#000000",
                      fontWeight: 700 
                    }}>
                      進捗
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      color: "#000000",
                      fontWeight: 900 
                    }}>
                      67%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* AI生成プラン表示用ボタン */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Psychology />}
              onClick={handleOpenAIModal}
              className="app-button"
              sx={{ 
                fontSize: '1.2rem',
                minWidth: '280px',
                height: '56px'
              }}
            >
              ✨ AI学習プラン生成
            </Button>
          </Box>

          {/* AI学習プランセクション */}
          {studyPlan && (
            <Paper elevation={0} className="chart-card" sx={{ p: 4, mb: 4 }}>
              <Typography 
                variant='h5' 
                sx={{ 
                  color: "#000000", 
                  mb: 3, 
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '1.8rem'
                }}
              >
                <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--error-color)' }} />
                🤖 AI生成学習プラン
              </Typography>
              <Box
                sx={{
                  maxHeight: 500,
                  overflow: 'auto',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 'var(--border-radius)',
                  p: 3,
                  '& h1': {
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    mb: 2,
                    color: '#000000'
                  },
                  '& h2': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: '#000000'
                  },
                  '& h3': {
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    mb: 1,
                    color: '#000000'
                  },
                  '& p': {
                    mb: 1.5,
                    lineHeight: 1.7,
                    color: '#000000'
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2
                  },
                  '& li': {
                    mb: 0.8,
                    color: '#000000'
                  },
                  '& strong': {
                    fontWeight: 'bold',
                    color: '#000000'
                  },
                  '& code': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: 'var(--accent-color)'
                  },
                  '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                    mb: 2,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  },
                  '& th, & td': {
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    p: 1.5,
                    textAlign: 'left'
                  },
                  '& th': {
                    backgroundColor: 'var(--accent-color)',
                    color: 'white',
                    fontWeight: 'bold'
                  },
                  '& td': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#000000'
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
        className="speed-dial-custom"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
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
          sx={{
            '& .MuiSpeedDialAction-fab': {
              background: 'linear-gradient(45deg, var(--success-color), var(--green-color))',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00a085, #4dd0e1)',
                transform: 'scale(1.1)',
              }
            }
          }}
        />
        <SpeedDialAction
          key="analytics"
          icon={<Analytics />}
          tooltipTitle="進捗分析"
          onClick={() => {
            setSpeedDialOpen(false);
            console.log('進捗分析を表示');
          }}
          sx={{
            '& .MuiSpeedDialAction-fab': {
              background: 'linear-gradient(45deg, var(--warning-color), var(--orange-color))',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e17055, #fd79a8)',
                transform: 'scale(1.1)',
              }
            }
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
        <Paper className="modal-paper" sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              id="log-modal-title"
              sx={{ 
                fontWeight: 800,
                color: '#000000',
                fontSize: '1.8rem'
              }}
            >
              <NoteAdd sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--success-color)' }} />
              📝 学習ログを記録
            </Typography>
            <Button 
              onClick={handleCloseModal}
              sx={{ 
                minWidth: 'auto', 
                p: 1,
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                }
              }}
            >
              <Close sx={{ color: 'var(--text-secondary)' }} />
            </Button>
          </Box>

          <Divider sx={{ 
            mb: 3, 
            background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)',
            height: '2px',
            border: 'none'
          }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            <TextField
              label="学習日"
              type="date"
              value={logForm.date}
              onChange={(e) => setLogForm({...logForm, date: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-color)',
                },
              }}
            />
            <TextField
              label="学習時間（分）"
              type="number"
              value={logForm.studyTime}
              onChange={(e) => setLogForm({...logForm, studyTime: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="例: 120"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-color)',
                },
              }}
            />
            <TextField
              label="学習科目"
              value={logForm.subject}
              onChange={(e) => setLogForm({...logForm, subject: e.target.value})}
              fullWidth
              variant="outlined"
              placeholder="例: 数学、英語、プログラミング"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-color)',
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-color)',
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--accent-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--accent-color)',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              fullWidth
              sx={{
                borderRadius: '12px',
                borderColor: 'var(--text-secondary)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'var(--accent-color)',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                }
              }}
            >
              キャンセル
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveLog}
              fullWidth
              sx={{ 
                borderRadius: '12px',
                background: 'linear-gradient(45deg, var(--success-color), var(--green-color))',
                fontWeight: 600,
                fontSize: '1.1rem',
                padding: '12px 0',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00a085, #4dd0e1)',
                  transform: 'translateY(-1px)',
                  boxShadow: 'var(--card-shadow)',
                }
              }}
            >
              📝 ログを保存
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Modal for AI Study Plan Generator */}
      <Modal
        open={openAIModal}
        onClose={loading ? null : handleCloseAIModal}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
        disableEscapeKeyDown={loading}
      >
        <Paper className="modal-paper" sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 4,
          opacity: loading ? 0.9 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          position: 'relative',
        }}>
          {/* ローディングオーバーレイ */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                borderRadius: 'var(--border-radius)',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress 
                  size={60} 
                  sx={{ 
                    color: 'var(--error-color)',
                    mb: 2
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#000000',
                    fontWeight: 600 
                  }}
                >
                  🤖 AI学習プラン生成中...
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#333333',
                    mt: 1 
                  }}
                >
                  しばらくお待ちください
                </Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              id="ai-modal-title"
              sx={{ 
                fontWeight: 800,
                color: '#000000',
                fontSize: '1.8rem'
              }}
            >
              <Psychology sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--error-color)' }} />
              🤖 AI学習プラン生成
            </Typography>
            <Button 
              onClick={handleCloseAIModal}
              disabled={loading}
              sx={{ 
                minWidth: 'auto', 
                p: 1,
                borderRadius: '50%',
                opacity: loading ? 0.3 : 1,
                '&:hover': {
                  backgroundColor: loading ? 'transparent' : 'rgba(245, 101, 101, 0.1)',
                }
              }}
            >
              <Close sx={{ color: loading ? '#ccc' : 'var(--text-secondary)' }} />
            </Button>
          </Box>

          <Divider sx={{ 
            mb: 3, 
            background: 'linear-gradient(90deg, transparent, var(--error-color), transparent)',
            height: '2px',
            border: 'none'
          }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            <TextField
              label="資格名"
              value={examForm.examName}
              onChange={(e) => setExamForm({...examForm, examName: e.target.value})}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--error-color)',
                },
              }}
            />
            <TextField
              label="試験日"
              type="date"
              value={examForm.examDate}
              onChange={(e) => setExamForm({...examForm, examDate: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--error-color)',
                },
              }}
            />
            <TextField
              label="1日の勉強時間（時間）"
              type="number"
              value={examForm.dailyHours}
              onChange={(e) => setExamForm({...examForm, dailyHours: e.target.value})}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--error-color)',
                },
              }}
            />
            <TextField
              label="苦手分野"
              value={examForm.weakAreas}
              onChange={(e) => setExamForm({...examForm, weakAreas: e.target.value})}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--error-color)',
                },
              }}
            />
            <TextField
              label="想定総学習時間"
              type="number"
              value={examForm.totalHours}
              onChange={(e) => setExamForm({...examForm, totalHours: e.target.value})}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--error-color)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--error-color)',
                },
              }}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Psychology />}
            onClick={handleGeneratePlan}
            disabled={loading}
            fullWidth
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, var(--error-color), var(--orange-color))',
              fontWeight: 600,
              fontSize: '1.1rem',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(45deg, #e17055, #fd79a8)',
                transform: 'translateY(-1px)',
                boxShadow: 'var(--card-shadow)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #a0aec0, #cbd5e0)',
              }
            }}
          >
            {loading ? '🤖 AI学習プラン生成中...' : '✨ AI学習プラン生成'}
          </Button>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {studyPlan && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, rgba(0, 184, 148, 0.15), rgba(85, 239, 196, 0.15))',
                border: '2px solid rgba(0, 184, 148, 0.3)',
                color: 'var(--success-color)',
                fontWeight: 600,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                  color: 'var(--success-color)'
                }
              }}
            >
              🎉 学習プランが生成されました！モーダルを閉じて確認してください。
            </Alert>
          )}
        </Paper>
      </Modal>
    </div>
  );
}

export default App;
