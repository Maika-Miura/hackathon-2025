const API_BASE_URL = 'http://localhost:3001';

export const fetchMessage = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/message`);
    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { message: 'エラーが発生しました' };
  }
};

export const generateStudyPlan = async (examData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate study plan');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'AIからの応答取得に失敗しました。' };
  }
};