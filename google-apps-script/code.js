/**
 * Google Apps Script Web App for PALKI BANQUET Enquiry Integration
 * 
 * Instructions:
 * 1. Open a new Google Sheet where you want to collect submissions.
 * 2. Click Extensions -> Apps Script.
 * 3. Clear any default code and paste this script.
 * 4. Click Deploy -> New Deployment.
 * 5. Select "Web App". Set "Execute as" to "Me", and "Who has access" to "Anyone".
 * 6. Deploy, copy the "Web app URL" and save it in the Palki Banquet Admin Dashboard.
 * 
 * NOTE: The script will automatically generate and style the header rows in the sheet
 * on the very first form submission. You do NOT need to type headers manually.
 */

function doPost(e) {
  try {
    // 1. Parse incoming JSON request payload
    var postData = JSON.parse(e.postData.contents);
    
    // 2. Open active Spreadsheet sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 3. Generate Header Rows if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Name",
        "Phone",
        "Email",
        "Event Type",
        "Event Date",
        "Guests",
        "Budget",
        "Preferred Contact Time",
        "Message",
        "Status"
      ];
      sheet.appendRow(headers);
      
      // Style headers: Bold, Deep Maroon Background (#540B1D), White Text, Frozen Row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#540B1D");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      
      // Freeze the header row so it stays at the top when scrolling
      sheet.setFrozenRows(1);
    }
    
    // 4. Create Row values array matching Google Sheet columns
    var rowData = [
      new Date(), // Timestamp
      postData.name || "",
      "'" + (postData.phone || ""), // Prefix with single quote to preserve phone leading zeroes
      postData.email || "",
      postData.eventType || "",
      postData.eventDate || "",
      postData.guests || "",
      postData.budget || "",
      postData.preferredContactTime || "",
      postData.message || "",
      postData.status || "Pending" // Initial callback status
    ];
    
    // 5. Append row to spreadsheet
    sheet.appendRow(rowData);
    
    // 6. Build and return success JSON response
    var responseOutput = JSON.stringify({
      status: "success",
      message: "Enquiry successfully logged to spreadsheet"
    });
    
    return ContentService.createTextOutput(responseOutput)
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // 7. Return error response if failure occurs
    var errorOutput = JSON.stringify({
      status: "error",
      message: error.toString()
    });
    
    return ContentService.createTextOutput(errorOutput)
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Enable CORS Preflight requests support
function doOptions(e) {
  return ContentService.createTextOutput("")
                       .setMimeType(ContentService.MimeType.TEXT);
}
