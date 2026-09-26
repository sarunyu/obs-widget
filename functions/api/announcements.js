export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Optional cache buster passed from frontend
  const t = url.searchParams.get('_t') || '';
  
  const target = `https://prachin.space/api/announcements?_t=${t}`;
  
  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Cloudflare-Pages-Proxy/1.0',
        'Accept': 'application/json'
      }
    });
    
    // Copy the response to modify headers
    const newResponse = new Response(response.body, response);
    
    // Ensure CORS headers are open for the frontend
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return newResponse;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
