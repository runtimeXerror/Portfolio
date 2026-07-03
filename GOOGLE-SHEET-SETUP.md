# Contact Form → Google Sheet (colorful) setup

Tumhari portfolio static hai (Vercel), isliye form data ek **Google Sheet** me jata hai.
Ye sheet tum kabhi bhi **File → Download → Microsoft Excel (.xlsx)** se Excel me le sakte ho.
Script khud ek **colorful header** bana deta hai — alag se design karne ki zaroorat nahi.

---

## Step 1 — Sheet banao
1. https://sheets.new kholo (ek nayi blank Google Sheet ban jayegi).
2. Naam de do, jaise **"Portfolio Messages"**.

## Step 2 — Apps Script paste karo
1. Sheet me upar **Extensions → Apps Script** kholo.
2. Jo bhi default code dikhe, use mita do aur neeche wala **poora code** paste kar do.
3. Floppy/Save icon (Ctrl+S) dabao.

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Pehli baar: colorful header row bana do
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
      var header = sheet.getRange(1, 1, 1, 4);
      header.setBackground("#06b6d4")        // cyan
            .setFontColor("#ffffff")
            .setFontWeight("bold")
            .setFontSize(12)
            .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 170);
      sheet.setColumnWidth(2, 160);
      sheet.setColumnWidth(3, 220);
      sheet.setColumnWidth(4, 420);
    }

    var data = JSON.parse(e.postData.contents);
    var newRow = [new Date(), data.name || "", data.email || "", data.message || ""];
    sheet.appendRow(newRow);

    // Naye row ko zebra-stripe colour do (padhne me aasaan)
    var r = sheet.getLastRow();
    var rowRange = sheet.getRange(r, 1, 1, 4);
    rowRange.setBackground(r % 2 === 0 ? "#e0f7fa" : "#ffffff")
            .setVerticalAlignment("top")
            .setWrap(true);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

## Step 3 — Deploy karo (Web App)
1. Upar right me **Deploy → New deployment**.
2. Gear icon → type me **Web app** choose karo.
3. Settings:
   - **Description**: kuch bhi (e.g. "portfolio form")
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**   ← ye zaroori hai
4. **Deploy** dabao → Google permission maangega → **Authorize** karo (apne Google account se, "Advanced → Go to project (unsafe)" → Allow).
5. Ek **Web app URL** milega jo aise dikhega:
   `https://script.google.com/macros/s/AKfy....../exec`
   **Isko copy kar lo.**

## Step 4 — URL portfolio me daalo
1. `index.html` kholo.
2. Dhoondo: `const SHEET_ENDPOINT = "PASTE_YOUR_URL_HERE";`
3. `PASTE_YOUR_URL_HERE` ki jagah apna `/exec` URL paste kar do. Save.

## Step 5 — Test
1. Site kholo, **Get In Touch** form bharo, **Send Message** dabao.
2. "✅ Thanks!" dikhega.
3. Google Sheet refresh karo — naya message colorful row me aa jayega. 🎉

---

### Excel chahiye?
Google Sheet me: **File → Download → Microsoft Excel (.xlsx)**. Bas.

### Email notification bhi chahiye (jab koi message bheje)?
Step 2 wale code me `sheet.appendRow(newRow);` ke just neeche ye line add kar do:

```javascript
    MailApp.sendEmail("vishalk.cse23@gmail.com",
      "New portfolio message from " + (data.name || "someone"),
      "Email: " + data.email + "\n\nMessage:\n" + data.message);
```

Phir dobara **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
> Note: code badalne ke baad hamesha **New version** deploy karna, warna purana hi chalega.
