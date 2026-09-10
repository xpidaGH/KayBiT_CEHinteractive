import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CEHDomain } from '../types';

export async function generateInteractiveAcroFormPdf(
  domains: CEHDomain[],
  studentName = 'Student',
  selectedDomainTitle = 'CEH v13 Comprehensive Study Plan'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const page = pdfDoc.addPage([612, 792]); // Letter standard (8.5 x 11 in)
  const { width, height } = page.getSize();
  const form = pdfDoc.getForm();

  // 1. Dark Top Banner
  page.drawRectangle({
    x: 0,
    y: height - 64,
    width: width,
    height: 64,
    color: rgb(0.05, 0.07, 0.09), // #0d1117
  });

  // Header Title
  page.drawText('KayBiT CEH v13 Interactive Study Template', {
    x: 32,
    y: height - 34,
    size: 16,
    font: fontBold,
    color: rgb(0.35, 0.65, 1.0), // #58a6ff
  });

  page.drawText('Official Offline AcroForms Digital Study Sheet • 100% Serverless', {
    x: 32,
    y: height - 50,
    size: 9,
    font: fontRegular,
    color: rgb(0.55, 0.58, 0.62),
  });

  // 2. Student Info Card Background
  page.drawRectangle({
    x: 32,
    y: height - 124,
    width: width - 64,
    height: 48,
    color: rgb(0.96, 0.97, 0.98),
    borderColor: rgb(0.8, 0.83, 0.87),
    borderWidth: 1,
  });

  page.drawText('STUDENT NAME / CALLSIGN:', {
    x: 44,
    y: height - 104,
    size: 8,
    font: fontBold,
    color: rgb(0.2, 0.23, 0.26),
  });

  // Digital Form Field: Student Name
  const nameField = form.createTextField('student_name_field');
  nameField.setText(studentName);
  nameField.addToPage(page, {
    x: 180,
    y: height - 110,
    width: 170,
    height: 18,
    borderWidth: 1,
    borderColor: rgb(0.2, 0.4, 0.9),
  });

  page.drawText('TARGET EXAM DATE:', {
    x: 364,
    y: height - 104,
    size: 8,
    font: fontBold,
    color: rgb(0.2, 0.23, 0.26),
  });

  // Digital Form Field: Exam Date
  const dateField = form.createTextField('exam_date_field');
  dateField.setText(new Date().toISOString().split('T')[0]);
  dateField.addToPage(page, {
    x: 465,
    y: height - 110,
    width: 85,
    height: 18,
    borderWidth: 1,
    borderColor: rgb(0.2, 0.4, 0.9),
  });

  // 3. Section: CEH v13 Domain Selector Dropdown
  let currentY = height - 150;

  page.drawText('DOMAIN SELECTION & SCENARIO AUDIT', {
    x: 32,
    y: currentY,
    size: 11,
    font: fontBold,
    color: rgb(0.14, 0.52, 0.21), // #238636
  });

  currentY -= 16;
  page.drawText('Select your primary focus domain from the interactive dropdown menu below:', {
    x: 32,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.3, 0.33, 0.36),
  });

  currentY -= 24;
  // Digital Form Field: Domain Dropdown Menu
  const domainDropdown = form.createDropdown('domain_selector_dropdown');
  const domainOptions = (domains || []).map((d) => `[${d.code}] ${d.title.substring(0, 50)}`);
  domainDropdown.setOptions(domainOptions);
  if (domainOptions.length > 0) {
    domainDropdown.select(domainOptions[0]);
  }
  domainDropdown.addToPage(page, {
    x: 32,
    y: currentY,
    width: width - 64,
    height: 20,
    borderWidth: 1,
    borderColor: rgb(0.14, 0.52, 0.21),
  });

  // 4. Scenario Question with Multiple Choice Dropdown
  currentY -= 36;
  page.drawText('INTERACTIVE PRACTICE SCENARIO 01 (Nmap Flags)', {
    x: 32,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.12, 0.43, 0.92),
  });

  currentY -= 15;
  page.drawText(
    'Q: An auditor wants to evade a stateless firewall by sending packets with FIN, PSH, and URG flags set.',
    {
      x: 32,
      y: currentY,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.15, 0.15, 0.15),
    }
  );

  currentY -= 12;
  page.drawText('Which scan switch represents this technique?', {
    x: 32,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.15, 0.15, 0.15),
  });

  currentY -= 24;
  // Digital Form Field: Drop-Down Choice
  const q1Dropdown = form.createDropdown('quiz_scenario_nmap');
  q1Dropdown.setOptions([
    '-- Select Answer --',
    '-sS (SYN Stealth Scan)',
    '-sX (Xmas Scan - FIN, PSH, URG)',
    '-sN (Null Scan - No flags)',
    '-sA (ACK Firewall Filter Scan)',
  ]);
  q1Dropdown.select('-- Select Answer --');
  q1Dropdown.addToPage(page, {
    x: 32,
    y: currentY,
    width: 280,
    height: 20,
    borderWidth: 1,
    borderColor: rgb(0.12, 0.43, 0.92),
  });

  // 5. Scenario Question 02 Dropdown
  currentY -= 34;
  page.drawText('INTERACTIVE PRACTICE SCENARIO 02 (Web & Cloud)', {
    x: 32,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.12, 0.43, 0.92),
  });

  currentY -= 15;
  page.drawText('Q: Which vulnerability allows an attacker to pivot into AWS Instance Metadata (169.254.169.254)?', {
    x: 32,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.15, 0.15, 0.15),
  });

  currentY -= 24;
  const q2Dropdown = form.createDropdown('quiz_scenario_cloud');
  q2Dropdown.setOptions([
    '-- Select Answer --',
    'SSRF (Server-Side Request Forgery)',
    'XSS (Cross-Site Scripting)',
    'IDOR (Insecure Direct Object Reference)',
    'CSRF (Cross-Site Request Forgery)',
  ]);
  q2Dropdown.select('-- Select Answer --');
  q2Dropdown.addToPage(page, {
    x: 32,
    y: currentY,
    width: 280,
    height: 20,
    borderWidth: 1,
    borderColor: rgb(0.12, 0.43, 0.92),
  });

  // 6. Interactive Student Notes Multi-Line Text Field
  currentY -= 34;
  page.drawText('STUDENT NOTES & COMMAND-LINE CHEAT SHEET (Editable Field)', {
    x: 32,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  currentY -= 13;
  page.drawText('Type custom command lines, password cracking rules, or domain study thoughts directly into this box:', {
    x: 32,
    y: currentY,
    size: 8,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  currentY -= 140;
  const notesField = form.createTextField('student_dynamic_notes');
  notesField.enableMultiline();
  notesField.setText(
    `[Focus: ${selectedDomainTitle}]\n- Custom Nmap Command: nmap -sS -T4 -p- -sV target\n- Key CVEs / Tools: Burp Suite, Hashcat, Metasploit\n- High-Priority Weakness to Review: `
  );
  notesField.addToPage(page, {
    x: 32,
    y: currentY,
    width: width - 64,
    height: 130,
    borderWidth: 1,
    borderColor: rgb(0.3, 0.5, 0.8),
  });

  // 7. Interactive Form Buttons: "Reset All Form Fields" & "Clear Notes"
  currentY -= 38;
  const resetButton = form.createButton('reset_form_button');
  resetButton.addToPage('Clear / Reset Practice Sheet', page, {
    x: width - 210,
    y: currentY,
    width: 178,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.85, 0.2, 0.2),
  });

  page.drawText('Digital Form Controller: Click button above to clear all input fields in compliant PDF readers.', {
    x: 32,
    y: currentY + 7,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.45, 0.48, 0.52),
  });

  // 8. Footer
  page.drawText('KayBiT_CEHinteractive • Certified Ethical Hacker (CEH v13) Offline Study Suite • Powered by open-source standards', {
    x: 32,
    y: 18,
    size: 7.5,
    font: fontMono,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}
