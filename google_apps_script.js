/**
 * Mahdbaby Google Sheets Webhook Receiver
 *
 * Deployment:
 * 1. Create a Google Sheet with a tab named "Orders"
 * 2. Add column headers: date, ordered, country, name, phone, product, sku, quantité, total price, currency, status
 * 3. Extensions > Apps Script
 * 4. Paste this script
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy Web App URL to backend env GOOGLE_SHEETS_WEBHOOK_URL
 */

const SHEET_NAME_ORDERS = 'Orders';

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Lock timeout' }, 429);
  }

  try {
    const payload = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Append order row
    const ordersSheet = ss.getSheetByName(SHEET_NAME_ORDERS) || ss.getSheets()[0];
    if (ordersSheet && payload.orderid) {
      ordersSheet.appendRow([
        payload.date || '',
        payload.orderid || '',
        payload.country || 'Kwt',
        payload.name || '',
        payload.phone || '',
        payload.product || '',
        payload.sku || '',
        payload.quantity || '',
        payload.total_price || 0,
        payload.currency || 'KWD',
        payload.status || ''
      ]);
    }

    return jsonResponse({ success: true, order_number: payload.orderid });
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
    date: '08/05/2026',
    orderid: 'mahd-20260508-0001',
    country: 'Kwt',
    name: 'تست',
    phone: '9650501020304',
    product: 'قناع الحماية الناعم لرأس الأطفال/جهاز تدفئة زجاجات حليب الأطفال المحمول',
    sku: 'MAHD-BHP-001/MAHD-PBB-002',
    quantity: '2/1',
    total_price: 46,
    currency: 'KWD',
    status: ''
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testPayload),
    },
  };

  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
