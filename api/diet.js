export default async function handler(req, res) {
  try {
    const response = await fetch("http://n3.host.ringonw.com:3315/diet.json");
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
