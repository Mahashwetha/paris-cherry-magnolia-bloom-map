export default async function handler(req, res) {
  const BIN_ID   = process.env.JSONBIN_BIN_ID;
  const KEY      = process.env.JSONBIN_KEY;
  const BASE     = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
  const heads    = { 'Content-Type': 'application/json', 'X-Access-Key': KEY };
  const readOnly = req.query?.readonly === '1';

  try {
    const readRes  = await fetch(`${BASE}/latest`, { headers: heads });
    const readData = await readRes.json();
    const visits   = readData?.record?.visits ?? readData?.visits ?? 50;

    if (readOnly) {
      return res.status(200).json({ visits });
    }

    const newCount = visits + 1;
    await fetch(BASE, {
      method:  'PUT',
      headers: heads,
      body:    JSON.stringify({ visits: newCount })
    });

    return res.status(200).json({ visits: newCount });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
