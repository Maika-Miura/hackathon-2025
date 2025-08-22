// API通信例
export async function fetchMessage() {
  const res = await fetch('http://localhost:5000/');
  return res.json();
}
