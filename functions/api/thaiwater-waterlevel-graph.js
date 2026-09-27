export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  const stationId = url.searchParams.get('station_id');
  const stationType = url.searchParams.get('station_type') || 'tele_waterlevel';
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');

  if (!stationId || !startDate || !endDate) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  const targetUrl = \`https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=\${stationType}&station_id=\${stationId}&start_date=\${startDate}&end_date=\${endDate}\`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.thaiwater.net/',
        'Accept': 'application/json'
      }
    });

    const data = await response.text();

    return new Response(data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
