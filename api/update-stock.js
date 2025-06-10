export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { beadDetails } = JSON.parse(req.body);
  const SHOP_DOMAIN  = process.env.SHOP_DOMAIN;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const LOCATION_ID  = process.env.LOCATION_ID;
  try {
    await Promise.all(beadDetails.map(perle =>
      fetch(`https://${SHOP_DOMAIN}/admin/api/2025-04/inventory_levels/adjust.json`, {
        method: 'POST',
        headers: {
          'Content-Type':         'application/json',
          'X-Shopify-Access-Token': ACCESS_TOKEN
        },
        body: JSON.stringify({
          inventory_item_id:    perle.id,
          location_id:          LOCATION_ID,
          available_adjustment: -perle.qty
        })
      })
    ));
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
