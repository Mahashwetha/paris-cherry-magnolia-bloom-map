exports.handler = async () => {
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const KEY    = process.env.JSONBIN_KEY;
  const BASE   = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
  const heads  = { 'Content-Type': 'application/json', 'X-Access-Key': KEY };

  try {
    const readRes  = await fetch(`${BASE}/latest`, { headers: heads });
    const readData = await readRes.json();
    const visits   = readData?.record?.visits ?? readData?.visits ?? 50;
    const newCount = visits + 1;

    await fetch(BASE, {
      method:  'PUT',
      headers: heads,
      body:    JSON.stringify({ visits: newCount })
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ visits: newCount })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
