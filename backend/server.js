import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors()); // CORSを有効にする
app.use(express.json());

const GEMINI_API_KEY = ""
// Gemini 初期化
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 基本的なヘルスチェックエンドポイント
app.get("/api/message", (req, res) => {
  res.json({ message: "バックエンドとの接続に成功しました！" });
});

app.post("/api/plan", async (req, res) => {
  // examName をリクエストボディから受け取る
  const { examName, examDate, dailyHours, weakAreas, totalHours } = req.body;

  if (!examName) {
    return res.status(400).json({ error: "資格名が指定されていません。" });
  }

  const today = new Date();
  const targetDate = new Date(examDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const prompt = `
あなたはプロの学習プランナーです。「${examName}」の合格に向けた、現実的で詳細な学習計画を週単位で作成してください。

# 条件
- 資格名: ${examName}
- 試験日: ${examDate} (今日から約${diffDays}日後)
- 想定総学習時間: ${totalHours}時間
- 1日の平均勉強時間: ${dailyHours}時間
- 特に重点的に学習したい苦手分野: ${weakAreas}
- 今日から試験日までの期間で計画を作成してください。

# 出力形式
- 全体をいくつかのフェーズ（例：基礎固め期、応用力養成期、直前期）に分けてください。
- 各週ごとに「学習テーマ」「具体的な学習内容」「週の目標時間」を具体的に示してください。
- 苦手分野にはより多くの時間を割り当ててください。
- マークダウン形式で、見やすく整形して出力してください。

さあ、最高の学習計画を作成してください！`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ plan: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "AIからの応答取得に失敗しました。" });
  }
});

const PORT = 3001; // Reactのデフォルトポート3000と被らないように変更
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));