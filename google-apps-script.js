/**
 * Google Apps Script Web App API for Clipping Agency OS Dashboard
 * 
 * Paste this script directly inside the Google Sheets Script Editor:
 * Extensions > Apps Script
 * 
 * To deploy:
 * Click "Deploy" > "New deployment"
 * Select type: "Web app"
 * Execute as: "Me" (Your account)
 * Who has access: "Anyone"
 * Click "Deploy" and copy the Web App URL into your dashboard's .env file.
 */

function doGet(e) {
  // CORS Bypass: Allow GET requests to perform updates to avoid redirect CORS issues in browsers
  if (e && e.parameter) {
    if (e.parameter.action === 'update') {
      return handleUpdate(e.parameter);
    }
    if (e.parameter.action === 'reset') {
      return handleReset();
    }
  }
  
  return handleRead();
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    return handleUpdate(params);
  } catch (err) {
    // Fallback if payload isn't JSON
    if (e && e.parameter) {
      return handleUpdate(e.parameter);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRead() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Outreach CRM") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var rows = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue; // Skip empty rows
      
      var lead = {
        rowIndex: i + 1, // 1-based index (e.g. Row 2 is index 2)
        lead_id: String(row[0]),
        scraped_date: row[1] ? formatDate(row[1]) : "",
        brand_or_channel_name: String(row[2] || ""),
        mentorship_vertical: String(row[3] || ""),
        founder_name: String(row[4] || ""),
        raw_instagram_handle: String(row[5] || ""),
        instagram_profile_url: String(row[6] || ""),
        twitter_x_url: String(row[7] || ""),
        linkedin_url: String(row[8] || ""),
        youtube_channel_url: String(row[9] || ""),
        direct_founder_email: String(row[10] || ""),
        email_domain_type: String(row[11] || ""),
        email_source: String(row[12] || ""),
        lead_tier: String(row[13] || ""),
        target_retainer: String(row[14] || ""),
        wvp_status: String(row[15] || ""),
        funnel_tech_stack: String(row[16] || ""),
        platform_gap_status: String(row[17] || ""),
        backend_offer: String(row[18] || ""),
        student_proof_summary: String(row[19] || ""),
        best_video_url: String(row[20] || ""),
        best_video_title: String(row[21] || ""),
        video_hook_compliment: String(row[22] || ""),
        email_subject_line: String(row[23] || ""),
        email_body_pitch: String(row[24] || ""),
        mobile_dm_pitch: String(row[25] || ""),
        story_swipe_up_hook: String(row[26] || ""),
        outreach_status: String(row[27] || "Ready to Send"),
        last_action_by: String(row[28] || ""),
        last_action_at: row[29] ? formatDateTime(row[29]) : ""
      };
      rows.push(lead);
    }
    
    var response = JSON.stringify({ status: "success", data: rows });
    return ContentService.createTextOutput(response)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUpdate(params) {
  try {
    var leadId = params.lead_id;
    var rowIndex = params.rowIndex;
    var status = params.status;
    var sentBy = params.sent_by;
    var timestamp = new Date().toISOString();
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Outreach CRM") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var targetRow = -1;
    
    if (rowIndex) {
      targetRow = parseInt(rowIndex);
    } else if (leadId) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(leadId)) {
          targetRow = i + 1;
          break;
        }
      }
    }
    
    if (targetRow === -1 || targetRow > sheet.getLastRow()) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Row not found for lead " + leadId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Column AB corresponds to Index 28 (1-based)
    if (status) {
      sheet.getRange(targetRow, 28).setValue(status);
    }
    // Column AC corresponds to Index 29 (1-based)
    if (sentBy) {
      sheet.getRange(targetRow, 29).setValue(sentBy);
    }
    // Column AD corresponds to Index 30 (1-based)
    sheet.getRange(targetRow, 30).setValue(timestamp);
    
    var response = JSON.stringify({ 
      status: "success", 
      rowIndex: targetRow, 
      status: status, 
      sentBy: sentBy, 
      timestamp: timestamp 
    });
    
    return ContentService.createTextOutput(response)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utility to safely format date strings
function formatDate(dateObj) {
  try {
    if (dateObj instanceof Date) {
      return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd");
    }
    return String(dateObj);
  } catch (e) {
    return String(dateObj);
  }
}

// Utility to safely format datetime strings
function formatDateTime(dateObj) {
  try {
    if (dateObj instanceof Date) {
      return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }
    return String(dateObj);
  } catch (e) {
    return String(dateObj);
  }
}

function handleReset() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Outreach CRM") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      for (var i = 2; i <= lastRow; i++) {
        sheet.getRange(i, 28).setValue("Phase 1"); // Column AB (outreach_status)
        sheet.getRange(i, 29).setValue("");        // Column AC (last_action_by)
        sheet.getRange(i, 30).setValue("");        // Column AD (last_action_at)
      }
    }
    
    var response = JSON.stringify({ 
      status: "success", 
      message: "Sheet reset back to Phase 1 successfully!" 
    });
    
    return ContentService.createTextOutput(response)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
