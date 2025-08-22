// API通信例
export async function fetchMessage() {
  const res = await fetch('http://127.0.0.1:5000/');
  return res.json();
}
