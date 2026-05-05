/**
 * Mahdbaby Google Sheets Webhook Receiver
 *
 * Deployment:
 * 1. Create a Google Sheet with tabs: Orders, OrderItems, Products
 * 2. Add column headers from the CSV templates
 * 3. Extensions > Apps Script
 * 4. Paste this script
 * 5. Set Script Property: WEBHOOK_SECRET
 * 6. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 7. Copy Web App URL to backend env GOOGLE_SHEETS_WEBHOOK_URL
 */

const SHEET_NAME_ORDERS = 'Orders';
const SHEET_NAME_ITEMS = 'OrderItems';
const SHEET_NAME_PRODUCTS = 'Products';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Lock timeout' }, 429);
  }

  try {
    const payload = JSON.parse(e.postData.contents);

    // Validate secret
    const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!secret || payload.secret !== secret) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Append order row
    const ordersSheet = ss.getSheetByName(SHEET_NAME_ORDERS);
    if (ordersSheet && payload.order) {
      const o = payload.order;
      ordersSheet.appendRow([
        o.order_number || '',
        o.created_at || '',
        o.customer_name || '',
        o.phone_domestic || '',
        o.phone_e164 || '',
        o.items_summary || '',
        o.subtotal_kwd || 0,
        o.discount_kwd || 0,
        o.total_kwd || 0,
        o.status || '',
        o.upsell_status || '',
        '', // confirmation_status (filled by ops team)
        '', // delivery_status (filled by ops team)
        o.landing_page || '',
        o.utm_source || '',
        o.utm_medium || '',
        o.utm_campaign || '',
        o.utm_content || '',
        o.utm_term || '',
        o.notes || '',
      ]);
    }

    // Append order items rows
    const itemsSheet = ss.getSheetByName(SHEET_NAME_ITEMS);
    if (itemsSheet && payload.items && Array.isArray(payload.items)) {
      for (const item of payload.items) {
        itemsSheet.appendRow([
          payload.order ? payload.order.order_number : '',
          item.product_id || '',
          item.product_name_ar || '',
          item.offer_id || '',
          item.quantity || 0,
          item.price_kwd || 0,
          item.is_upsell ? 'نعم' : 'لا',
        ]);
      }
    }

    return jsonResponse({ success: true, order_number: payload.order ? payload.order.order_number : null });
  } catch (err) {
    console.error('Webhook error:', err.toString());
    return jsonResponse({ success: false, error: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Test function - run manually to verify setup
 */
function testWebhook() {
  const testPayload = {
    secret: PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET'),
    order: {
      order_number: 'MB-TEST-0001',
      created_at: new Date().toISOString(),
      customer_name: 'تست',
      phone_domestic: '0551234567',
      phone_e164: '+966551234567',
      items_summary: 'قناع الحماية الناعم لرأس الأطفال x1',
      subtotal_kwd: 19,
      discount_kwd: 0,
      total_kwd: 19,
      status: 'submitted',
      upsell_status: 'skipped',
      landing_page: 'https://mahdbaby.shop/',
      utm_source: 'test',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      notes: 'طلب تجريبي',
    },
    items: [
      {
        product_id: 'baby_head_protection_mask',
        product_name_ar: 'قناع الحماية الناعم لرأس الأطفال',
        offer_id: 'one_piece',
        quantity: 1,
        price_kwd: 19,
        is_upsell: false,
      },
    ],
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testPayload),
    },
  };

  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
