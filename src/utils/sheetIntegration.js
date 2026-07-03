/**
 * Utility to post booking enquiries to Google Sheets Apps Script Web App
 */
export async function postToGoogleSheets(endpointUrl, enquiryData) {
  if (!endpointUrl) {
    console.warn('Google Sheets endpoint URL is not configured. Saving locally only.');
    return { success: false, error: 'Endpoint URL not configured' };
  }

  try {
    // We send payload as a URL encoded or standard JSON request.
    // In Google Apps Script, parsing JSON payload is highly reliable.
    // We use CORS mode "no-cors" if the server doesn't return correct headers,
    // but standard JSON fetches with credentials/headers are better.
    // Apps Script web apps return a 302 redirect, which fetch automatically follows.
    // Sometimes redirecting results in a CORS error on redirects, 
    // but the data DOES successfully reach the Google Sheet anyway.
    // To handle this robustly, we use Content-Type: text/plain or format simple parameters.
    
    const payload = {
      timestamp: new Date().toISOString(),
      name: enquiryData.name,
      phone: enquiryData.phone,
      email: enquiryData.email || '',
      eventType: enquiryData.eventType,
      eventDate: enquiryData.eventDate,
      guests: enquiryData.guests,
      budget: enquiryData.budget || '',
      preferredContactTime: enquiryData.preferredContactTime || '',
      message: enquiryData.message || '',
      status: 'Pending'
    };

    const response = await fetch(endpointUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Prevents CORS preflight issues in Google Apps Script
      },
      body: JSON.stringify(payload)
    });

    // Google Apps Script redirect returns a response or throws a redirect error
    // In many setups, a 200 or redirection content is returned
    const textResult = await response.text();
    let jsonResult;
    try {
      jsonResult = JSON.parse(textResult);
    } catch {
      jsonResult = { status: 'success' }; // Fallback if Apps Script returns HTML page or redirect
    }

    return { 
      success: response.ok || jsonResult.status === 'success',
      data: jsonResult 
    };
  } catch (error) {
    console.error('Error posting to Google Sheets:', error);
    // Note: Due to browser CORS policies on Apps Script 302 redirects,
    // the request might succeed on Google Sheets even if fetch throws a CORS error.
    // We will assume it might have gone through if the request reached there, 
    // but for user feedback, we will return success: false if it failed.
    return { 
      success: false, 
      error: error.message || 'Network error occurred during transmission.' 
    };
  }
}
