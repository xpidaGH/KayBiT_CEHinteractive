#!/usr/bin/env python3
"""
KayBiT_CEHinteractive - Programmatic Interactive PDF Generation Framework
Uses ReportLab to generate an interactive, form-fillable PDF study template
complete with digital text fields, multiple-choice dropdown menus, and reset buttons.

Prerequisites:
    pip install reportlab
Usage:
    python3 generate_interactive_pdf.py [output_path.pdf]
"""

import sys
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def create_interactive_ceh_pdf(output_filename="KayBiT_CEH_Interactive_Template.pdf"):
    c = canvas.Canvas(output_filename, pagesize=letter)
    width, height = letter

    # Page Background & Header Bar
    c.setFillColor(colors.HexColor("#0d1117"))
    c.rect(0, height - 70, width, 70, fill=1, stroke=0)

    # Title & Branding
    c.setFillColor(colors.HexColor("#58a6ff"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(36, height - 36, "KayBiT CEH v13 Interactive Study Template")
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#8b949e"))
    c.drawString(36, height - 52, "Form-Fillable Offline Exam Preparation Sheet | AcroForms Architecture")

    # Form Fields Form Controller
    form = c.acroForm

    # --- Student Metadata Section ---
    y_pos = height - 100
    c.setFillColor(colors.HexColor("#161b22"))
    c.roundRect(30, y_pos - 45, width - 60, 60, 4, fill=1, stroke=0)

    c.setFillColor(colors.HexColor("#e6edf3"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(45, y_pos, "STUDENT IDENTIFIER:")
    form.textfield(
        name="student_name",
        tooltip="Enter your Student Name or Handle",
        x=175, y=y_pos - 5,
        width=180, height=18,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#30363d"),
        fillColor=colors.HexColor("#0d1117"),
        textColor=colors.HexColor("#58a6ff"),
        fontSize=9
    )

    c.drawString(375, y_pos, "TARGET EXAM DATE:")
    form.textfield(
        name="exam_date",
        tooltip="YYYY-MM-DD",
        x=495, y=y_pos - 5,
        width=85, height=18,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#30363d"),
        fillColor=colors.HexColor("#0d1117"),
        textColor=colors.HexColor("#58a6ff"),
        fontSize=9
    )

    # --- Scenario 1: Interactive Multiple Choice Dropdown ---
    y_pos -= 75
    c.setFillColor(colors.HexColor("#238636"))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(36, y_pos, "PRACTICE SCENARIO 01: Nmap Scanning & Evasion")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)
    y_pos -= 16
    c.drawString(36, y_pos, "Q: An ethical hacker requires an Nmap probe that sends packets with no TCP flags set.")
    y_pos -= 13
    c.drawString(36, y_pos, "Select the correct scanning flag from the interactive dropdown below:")

    y_pos -= 26
    form.choice(
        name="scenario1_answer",
        tooltip="Select your answer",
        options=[
            "-- Select Answer --",
            "-sS (TCP SYN Stealth Scan)",
            "-sT (TCP Connect Scan)",
            "-sN (TCP Null Scan - No flags set)",
            "-sX (TCP Xmas Scan - FIN, PSH, URG)",
            "-sA (TCP ACK Scan)"
        ],
        value="-- Select Answer --",
        x=36, y=y_pos,
        width=260, height=20,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#238636"),
        fillColor=colors.white,
        textColor=colors.black,
        fontSize=9
    )

    # --- Scenario 2: Second Question Dropdown ---
    y_pos -= 45
    c.setFillColor(colors.HexColor("#238636"))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(36, y_pos, "PRACTICE SCENARIO 02: Web Application Security")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)
    y_pos -= 16
    c.drawString(36, y_pos, "Q: Which vulnerability allows an attacker to make HTTP requests from the target web server")
    y_pos -= 13
    c.drawString(36, y_pos, "to internal services such as the AWS cloud metadata endpoint (169.254.169.254)?")

    y_pos -= 26
    form.choice(
        name="scenario2_answer",
        tooltip="Select your answer",
        options=[
            "-- Select Answer --",
            "Cross-Site Scripting (XSS)",
            "Server-Side Request Forgery (SSRF)",
            "Insecure Direct Object Reference (IDOR)",
            "Cross-Site Request Forgery (CSRF)"
        ],
        value="-- Select Answer --",
        x=36, y=y_pos,
        width=260, height=20,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#238636"),
        fillColor=colors.white,
        textColor=colors.black,
        fontSize=9
    )

    # --- Student Technical Notes Field ---
    y_pos -= 50
    c.setFillColor(colors.HexColor("#1f6feb"))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(36, y_pos, "STUDENT TACTICAL COMMAND-LINE CHEAT SHEET / NOTES:")
    y_pos -= 14
    c.setFillColor(colors.HexColor("#57606a"))
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(36, y_pos, "Type your custom Nmap flags, Metasploit commands, or SQL injection payloads directly into this box:")

    y_pos -= 145
    form.textfield(
        name="student_notes_area",
        tooltip="Type your study notes here",
        x=36, y=y_pos,
        width=width - 72, height=140,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#1f6feb"),
        fillColor=colors.HexColor("#f6f8fa"),
        textColor=colors.black,
        fontSize=9,
        multiline=True
    )

    # --- Reset Button ---
    y_pos -= 45
    c.setFillColor(colors.HexColor("#da3633"))
    form.button(
        name="reset_button",
        tooltip="Reset all interactive form fields to empty defaults",
        caption="Reset Practice Sheet",
        x=width - 170, y=y_pos,
        width=134, height=24,
        borderStyle="solid", borderWidth=1,
        borderColor=colors.HexColor("#da3633"),
        fillColor=colors.HexColor("#ffebe9"),
        textColor=colors.HexColor("#cf222e"),
        fontSize=9
    )

    # Footer
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#6e7781"))
    c.drawString(36, 20, "KayBiT_CEHinteractive • Certified Ethical Hacker (CEH v13) Self-Study Track • 100% Offline & Open Source")

    c.save()
    print(f"[+] Interactive fillable PDF generated successfully: {output_filename}")

if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "KayBiT_CEH_Interactive_Template.pdf"
    create_interactive_ceh_pdf(output)
