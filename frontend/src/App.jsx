import { useState } from 'react';
import { fetchMessage } from './api';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { Box, Typography, Paper, Grid, Fab, Modal, Button } from '@mui/material';
import { Add, Close } from "@mui/icons-material"
import './App.css';
// dayjs を日本語に設定
dayjs.locale('ja');

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isLoading, setIsLoading] = useState(false);
  const [openNewLogModal, setOpenNewLogModal] = useState(false)

  const handleClick = async () => {
    const data = await fetchMessage();
    setMessage(data.message);
  };


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
      <Typography variant='h2' sx={{color: "black", textAlign: 'center', pt: 2}}>あと何日</Typography>
      <Typography variant='caption' sx={{color: "black", display: 'block', textAlign: 'center', mb: 3}}>目標</Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <Box sx={{ p: 3 }}>
          <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mb: 3 }}>
            <Typography variant='h5' sx={{ color: "black", mb: 2, textAlign: 'center' }}>
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
        </Box>
      </LocalizationProvider>

      <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
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

      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{
          position: "fixed", 
          bottom: 16, 
          right: 16
        }}
        onClick={() => {setOpenNewLogModal(true)}}>
        <Add />
      </Fab>

      <Modal
        open={openNewLogModal}
        onClose={() => {setOpenNewLogModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" id="modal-modal-title">
              新しいログを追加
            </Typography>
            <Button 
              onClick={() => {setOpenNewLogModal(false)}}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <Close />
            </Button>
          </Box>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ここにフォーム内容を追加します。
          </Typography>
        </Paper>
      </Modal>
    </div>
  );
}

export default App;