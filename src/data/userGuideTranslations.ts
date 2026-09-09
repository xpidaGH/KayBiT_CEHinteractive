import { UserGuideLanguage } from '../types';

export const USER_GUIDE_TRANSLATIONS: Record<string, UserGuideLanguage> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    title: 'KayBiT_CEHinteractive — Comprehensive Student User Guide',
    sections: [
      {
        heading: '1. Overview & Offline Architecture',
        content: 'KayBiT_CEHinteractive is an all-in-one, serverless, self-study learning environment designed for advanced programming and cybersecurity students preparing for the Certified Ethical Hacker (CEH v13) examination. The platform operates 100% offline without requiring any backend database, preserving all study progress, domain mastery checklists, custom quiz questions, exam scores, and student notes directly within the browser\'s HTML5 Web Storage API (localStorage).'
      },
      {
        heading: '2. CEH v13 Domain Progress Tracker',
        content: 'Explore all 20 official CEH v13 modules from Footprinting to Cloud Security and AI vulnerabilities. Check off completed objectives, update mastery states (Not Started, In Progress, Mastered), record customized domain notes, and monitor your weighted exam readiness gauge in real-time.'
      },
      {
        heading: '3. Real-Time Mock Quiz Engine & Custom Quiz Builder',
        content: 'Test your tactical knowledge with randomized or domain-filtered scenario questions. Switch between Practice Mode (instant explanations & CWE/CVE references) and Exam Mode (timed assessment with score breakdowns). Use the built-in Question Creator to add your own practice scenarios and export/import question banks as portable JSON.'
      },
      {
        heading: '4. Interactive Nmap Command Builder',
        content: 'Visually construct robust network reconnaissance commands. Toggle TCP SYN Stealth (-sS), UDP (-sU), OS detection (-O), aggressive timing (-T4), firewall evasion (packet fragmentation -f, random data-length, decoy IPs -D, source port -g 53), and NSE scripts (--script=vuln). Copy commands with one click or inspect detailed syntax breakdowns.'
      },
      {
        heading: '5. Multi-Language Security Automation Cheat Sheets',
        content: 'Direct code implementations across 21 programming languages: Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly, and COBOL. Master offensive and defensive code snippets tailored to your preferred language stack.'
      },
      {
        heading: '6. Interactive PDF & Standalone HTML Exporters',
        content: 'Export interactive fillable PDF study forms containing live digital text fields, multiple-choice dropdown menus, and instant reset buttons generated client-side via AcroForms. Alternatively, download the single-file standalone HTML5 build to run the entire application directly from any USB flash drive or local filesystem without Node.js.'
      },
      {
        heading: '7. Cross-Platform Native Packaging Suites',
        content: 'Check the "Packaging & Automations" tab to access ready-to-run automation scripts in Python (ReportLab PDF generation), Node.js/TypeScript (Web container), Go (single-binary microservice with embedded files), and Rust (native desktop webview window wrapper). Refer to INSTALLATION.md for step-by-step guidance on creating Android APKs, Windows .exe, and macOS .dmg installers.'
      }
    ]
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    title: 'KayBiT_CEHinteractive — Guide de l\'Utilisateur pour Étudiants',
    sections: [
      {
        heading: '1. Présentation et Architecture Hors-Ligne',
        content: 'KayBiT_CEHinteractive est un environnement d\'apprentissage autonome et sans serveur conçu pour les étudiants avancés en programmation et en cybersécurité préparant la certification CEH v13. L\'application fonctionne à 100% hors-ligne sans base de données externe, sauvegardant votre progression, vos quiz et vos notes directement dans le stockage local du navigateur (localStorage).'
      },
      {
        heading: '2. Suivi des Domaines CEH v13',
        content: 'Parcourez les 20 modules officiels du CEH v13. Cochez les objectifs accomplis, ajustez votre niveau de maîtrise (Non commencé, En cours, Maîtrisé), enregistrez vos remarques et suivez votre score de préparation pondéré en temps réel.'
      },
      {
        heading: '3. Moteur de Quiz en Temps Réel et Créateur Personnalisé',
        content: 'Évaluez vos compétences avec des questions de mise en situation réelles. Alternez entre le Mode Entraînement (explications immédiates) et le Mode Examen chronométré. Créez vos propres questions d\'entraînement et importez/exportez vos banques de tests au format JSON.'
      },
      {
        heading: '4. Générateur Interactif de Commandes Nmap',
        content: 'Composez visuellement vos commandes de scan réseau. Activez les scans furtifs SYN (-sS), la détection d\'OS (-O), l\'évasion de pare-feu (-f, -D, -g 53) et les scripts NSE (--script=vuln) avec copie en un clic et explications détaillées.'
      },
      {
        heading: '5. Fiches Pratiques Multi-Langages (21 Langages)',
        content: 'Exemples de code en Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembleur et COBOL pour la cybersécurité offensive et défensive.'
      },
      {
        heading: '6. Exportation PDF Interactif et HTML Autonome',
        content: 'Générez des formulaires PDF interactifs avec champs de saisie éditables, menus déroulants et boutons de réinitialisation. Téléchargez également l\'application sous forme de fichier HTML5 unique exécutable hors-ligne.'
      },
      {
        heading: '7. Suites de Compilation Multi-Plateformes',
        content: 'Consultez l\'onglet Empaquetage pour accéder aux scripts d\'automatisation en Python, Node.js, Go et Rust, ainsi qu\'au guide INSTALLATION.md pour créer vos installateurs Android APK, Windows .exe et macOS .dmg.'
      }
    ]
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    title: 'KayBiT_CEHinteractive — Umfassendes Benutzerhandbuch',
    sections: [
      {
        heading: '1. Übersicht & Offline-Architektur',
        content: 'KayBiT_CEHinteractive ist eine serverlose Lernumgebung für fortgeschrittene Programmier- und Cybersicherheitsstudenten zur Vorbereitung auf das CEH v13-Examen. Die Anwendung arbeitet zu 100% offline ohne Datenbank und speichert alle Lernfortschritte, Quizergebnisse und Notizen direkt im Browser (localStorage).'
      },
      {
        heading: '2. CEH v13 Domänen-Fortschritts-Tracker',
        content: 'Erkunden Sie alle 20 CEH v13-Module von Footprinting bis Cloud- und KI-Sicherheit. Haken Sie erreichte Ziele ab, verwalten Sie Ihren Beherrschungsgrad und überwachen Sie Ihren gewichteten Prüfungsbereitschaftsgrad in Echtzeit.'
      },
      {
        heading: '3. Echtzeit-Quiz-Engine & Eigener Fragen-Editor',
        content: 'Testen Sie Ihr Wissen im Übungsmodus (sofortige Erklärungen) oder im Prüfungsmodus mit Zeiterfassung. Erstellen Sie eigene Prüfungsfragen und exportieren/importieren Sie Fragenkataloge im JSON-Format.'
      },
      {
        heading: '4. Interaktiver Nmap-Befehlsgenerator',
        content: 'Erstellen Sie professionelle Nmap-Scans per Klick: SYN Stealth (-sS), UDP (-sU), Firewall-Umgehung (-f, Decoys -D, Quellport -g 53) und NSE-Skripte mit automatischer Befehlssyntax-Aufschlüsselung.'
      },
      {
        heading: '5. Programmier-Spickzettel für 21 Sprachen',
        content: 'Spezifische Cyber-Sicherheitsskripte für Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembler und COBOL.'
      },
      {
        heading: '6. Interaktive AcroForm-PDFs & Standalone-HTML',
        content: 'Exportieren Sie ausfüllbare PDF-Arbeitsblätter mit Textfeldern, Dropdown-Menüs und Reset-Schaltflächen oder laden Sie eine portable Einzeldatei-HTML-Version für USB-Sticks herunter.'
      },
      {
        heading: '7. Lokale Cross-Platform Packaging-Suites',
        content: 'Automatisierungsskripte in Python, Node.js, Go und Rust für native Binärdateien. Siehe INSTALLATION.md für Anleitungen zu Android APK, Windows EXE und macOS DMG.'
      }
    ]
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    title: 'KayBiT_CEHinteractive — Guía Completa del Usuario',
    sections: [
      {
        heading: '1. Descripción General y Arquitectura Offline',
        content: 'KayBiT_CEHinteractive es una plataforma de autoestudio 100% autónoma y sin servidor diseñada para estudiantes de programación y ciberseguridad que preparan la certificación CEH v13. Toda la información se guarda localmente en el navegador mediante localStorage sin necesidad de base de datos.'
      },
      {
        heading: '2. Rastreador de Progreso por Dominios CEH v13',
        content: 'Revise los 20 dominios oficiales de CEH v13. Marque objetivos completados, clasifique el estado de dominio (No Iniciado, En Progreso, Dominado) y supervise su porcentaje de preparación para el examen oficial.'
      },
      {
        heading: '3. Motor de Cuestionarios en Tiempo Real y Creador de Preguntas',
        content: 'Ponga a prueba sus conocimientos en Modo Práctica (retroalimentación instantánea) o Modo Examen con temporizador. Añada preguntas personalizadas y comparta cuestionarios exportando e importando archivos JSON.'
      },
      {
        heading: '4. Constructor Interactivo de Comandos Nmap',
        content: 'Configure comandos Nmap avanzados con un clic: escaneos sigilosos SYN (-sS), evasión de firewall (-f, señuelos -D, puerto origen 53) y scripts NSE (--script=vuln) con desglose sintáctico en vivo.'
      },
      {
        heading: '5. Hojas de Trucos de Programación en 21 Lenguajes',
        content: 'Ejemplos de código de seguridad para Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Ensamblador y COBOL.'
      },
      {
        heading: '6. Exportación a PDF Rellenable y HTML Autónomo',
        content: 'Genere documentos PDF interactivos con campos de texto digitales, menús desplegables y botón de reinicio. Descargue la app completa como un único archivo HTML5 portable.'
      },
      {
        heading: '7. Empaquetado Nativo Multiplataforma',
        content: 'Scripts de automatización incluidos en Python, Node.js, Go y Rust. Consulte INSTALLATION.md para empaquetar aplicaciones nativas para Android, Windows y macOS.'
      }
    ]
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    title: 'KayBiT_CEHinteractive — Guida Utente Completa',
    sections: [
      {
        heading: '1. Panoramica e Architettura Offline',
        content: 'KayBiT_CEHinteractive è un ambiente di studio autonomo e privo di server per studenti di sicurezza informatica e programmazione avanzata in preparazione per l\'esame CEH v13. Funziona al 100% offline salvando quiz, checklist e note in localStorage.'
      },
      {
        heading: '2. Monitoraggio Domini CEH v13',
        content: 'Monitora tutti i 20 moduli CEH v13 ufficiali, calcola la percentuale di prontezza per l\'esame e annota considerazioni tattiche per ciascun dominio.'
      },
      {
        heading: '3. Simulatore di Quiz in Tempo Reale',
        content: 'Affronta quiz con spiegazioni dettagliate, attiva la modalità esame a tempo, e crea le tue domande personalizzate esportabili in formato JSON.'
      },
      {
        heading: '4. Costruttore Interattivo di Comandi Nmap',
        content: 'Genera comandi Nmap complessi con opzioni di evasione IDS/firewall, scansione SYN, script NSE e visualizzazione sintattica immediata.'
      },
      {
        heading: '5. Prontuari di Sicurezza per 21 Linguaggi',
        content: 'Codice di auditing e automazione in Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly e COBOL.'
      },
      {
        heading: '6. PDF Compilabile Interattivo ed Export HTML Singolo',
        content: 'Esporta fogli di studio PDF con campi modulo AcroForms interattivi o scarica l\'applicazione in un unico file HTML5 autonomo.'
      },
      {
        heading: '7. Script di Packaging per Desktop e Mobile',
        content: 'Script in Python, Go, Rust e Node.js per compilare o distribuire l\'applicazione localmente come descritto in INSTALLATION.md.'
      }
    ]
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    title: 'KayBiT_CEHinteractive — Guia Completo do Estudante',
    sections: [
      {
        heading: '1. Visão Geral e Arquitetura Offline',
        content: 'KayBiT_CEHinteractive é um ambiente de aprendizado autônomo e sem servidor para estudantes de programação e cibersegurança que se preparam para o exame CEH v13. Funciona 100% offline, salvando progresso e anotações diretamente no localStorage do navegador.'
      },
      {
        heading: '2. Acompanhamento dos Domínios CEH v13',
        content: 'Monitore os 20 domínios oficiais do CEH v13, marque tarefas concluídas e acompanhe o percentual ponderado de prontidão para a prova em tempo real.'
      },
      {
        heading: '3. Motor de Quiz em Tempo Real e Criador de Questões',
        content: 'Pratique com cenários simulados com explicações completas no Modo Estudo ou faça simulados cronometrados no Modo Exame com suporte a questões personalizadas.'
      },
      {
        heading: '4. Construtor Interativo de Comandos Nmap',
        content: 'Crie comandos Nmap sofisticados: scans SYN furtivos, evasão de firewall (-f, decoys -D, porta de origem 53) e scripts NSE com cópia instantânea.'
      },
      {
        heading: '5. Guias Rápidos de Código em 21 Linguagens',
        content: 'Exemplos práticos de segurança ofensiva e defensiva em Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly e COBOL.'
      },
      {
        heading: '6. Exportação para PDF Editável e Arquivo HTML Único',
        content: 'Exporte formulários PDF com campos digitais interativos e botões de limpeza ou baixe a aplicação inteira em um arquivo HTML5 único.'
      },
      {
        heading: '7. Empacotamento Nativo e Scripts de Automação',
        content: 'Scripts prontos em Python, Node.js, Go e Rust para executar em contêineres locais ou empacotar via Capacitor e Tauri (veja INSTALLATION.md).'
      }
    ]
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    title: 'KayBiT_CEHinteractive — Panduan Pengguna Lengkap',
    sections: [
      {
        heading: '1. Gambaran Umum & Arsitektur Offline',
        content: 'KayBiT_CEHinteractive adalah platform belajar mandiri tanpa server yang dirancang untuk persiapan ujian CEH v13. Berjalan 100% offline tanpa basis data eksternal, menyimpan seluruh progres kuis dan catatan ke localStorage peramban web.'
      },
      {
        heading: '2. Pelacak Progres 20 Domain CEH v13',
        content: 'Pelajari seluruh 20 modul CEH v13 dari pengintaian hingga keamanan awan dan AI. Tandai tujuan yang telah diselesaikan dan pantau persentase kesiapan ujian Anda.'
      },
      {
        heading: '3. Simulasi Kuis Real-Time & Pembuat Soal Kustom',
        content: 'Uji pemahaman Anda dengan soal berbasis skenario praktis, mode latihan berpenjelasan langsung, dan mode ujian berbatas waktu serta fitur pembuat soal mandiri.'
      },
      {
        heading: '4. Pembangun Perintah Nmap Interaktif',
        content: 'Susun sintaks Nmap secara visual: pemindaian SYN stealth (-sS), penghindaran firewall/IDS, dan skrip NSE dengan tombol salin cepat.'
      },
      {
        heading: '5. Lembar Contekan Kode Keamanan (21 Bahasa Pemrograman)',
        content: 'Kode praktis siap pakai dalam Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly, dan COBOL.'
      },
      {
        heading: '6. Ekspor PDF Interaktif & Aplikasi Berkas Tunggal HTML5',
        content: 'Hasilkan formulir PDF dengan bidang teks digital dan tombol reset, atau unduh bundel aplikasi satu berkas HTML5 untuk dijalankan dari flashdisk.'
      },
      {
        heading: '7. Paket Aplikasi Lintas Platform',
        content: 'Gunakan skrip otomasi Python, Go, Rust, dan Node.js serta panduan INSTALLATION.md untuk mengemas ke dalam installer Android APK, Windows EXE, dan macOS DMG.'
      }
    ]
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    title: 'KayBiT_CEHinteractive — Mwongozo Kamili wa Mtumiaji',
    sections: [
      {
        heading: '1. Muhtasari na Muundo Usiotegemea Mtandao',
        content: 'KayBiT_CEHinteractive ni mfumo wa kujifunzia usiohitaji seva ulioundwa mahsusi kwa wanafunzi wa usalama wa mtandao na programu wanaojiandaa kwa mtihani wa CEH v13. Inafanya kazi nje ya mtandao kikamilifu na kuhifadhi maendeleo yako kwenye hifadhi ya kivinjari (localStorage).'
      },
      {
        heading: '2. Kifuatiliaji cha Maeneo 20 ya CEH v13',
        content: 'Fuatilia moduli zote 20 za CEH v13 kuanzia upelelezi hadi usalama wa wingu na mifumo ya AI. Weka alama kwenye malengo uliyokamilisha na uone asilimia ya utayari wako wa mtihani.'
      },
      {
        heading: '3. Mfumo wa Majaribio ya Moja kwa Moja',
        content: 'Fanya majaribio ya maswali yenye maelezo ya kina au hali ya mtihani yenye kipima muda, pamoja na uwezo wa kuongeza maswali yako mwenyewe.'
      },
      {
        heading: '4. Mjenzi wa Amri za Nmap',
        content: 'Tengeneza amri za uchunguzi wa mtandao wa Nmap kwa kubofya, ukikwepa vizuizi vya firewall na kutumia hati za NSE kwa urahisi.'
      },
      {
        heading: '5. Mifano ya Nambari za Programu (Lugha 21)',
        content: 'Mifano ya usalama ya Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly, na COBOL.'
      },
      {
        heading: '6. Utoaji wa Fomu za PDF na HTML ya Faili Moja',
        content: 'Pakua fomu shirikishi za PDF au faili moja ya HTML5 inayoweza kufunguliwa kwenye kompyuta yoyote bila kusakinisha programu ya ziada.'
      },
      {
        heading: '7. Usambazaji Kwenye Mifumo Yote',
        content: 'Tumia hati za Python, Node.js, Go, na Rust pamoja na mwongozo wa INSTALLATION.md kufunga mfumo kwenye Android, Windows, na Mac.'
      }
    ]
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    title: 'KayBiT_CEHinteractive — Kapsamlı Öğrenci Kullanım Kılavuzu',
    sections: [
      {
        heading: '1. Genel Bakış ve Çevrimdışı Mimari',
        content: 'KayBiT_CEHinteractive, CEH v13 sınavına hazırlanan ileri düzey programlama ve siber güvenlik öğrencileri için geliştirilmiş sunucusuz bir çalışma ortamıdır. Harici bir veritabanı gerektirmeden %100 çevrimdışı çalışır ve tüm verileri tarayıcının yerel deposuna (localStorage) kaydeder.'
      },
      {
        heading: '2. CEH v13 Modül İlerleme Takipçisi',
        content: 'Keşiften Bulut ve Yapay Zeka güvenliğine kadar 20 resmi CEH v13 modülünü inceleyin. Tamamlanan hedefleri işaretleyin ve sınava hazırlık yüzdenizi gerçek zamanlı olarak izleyin.'
      },
      {
        heading: '3. Gerçek Zamanlı Deneme Sınavı Motoru',
        content: 'Senaryo tabanlı sorularla bilginizi test edin. Açıklamalı Alıştırma Modu veya süreli Sınav Modu arasında geçiş yapın. Kendi özel sorularınızı ekleyin ve JSON olarak dışa aktarın.'
      },
      {
        heading: '4. Etkileşimli Nmap Komut Oluşturucu',
        content: 'SYN Gizli Tarama (-sS), Güvenlik Duvarı Atlatma (-f, -D, -g 53) ve NSE betiklerini görsel olarak yapılandırın; tek tıkla komutu kopyalayın.'
      },
      {
        heading: '5. 21 Programlama Dili İçin Güvenlik Kodları',
        content: 'Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly ve COBOL dillerinde pratik kod örnekleri.'
      },
      {
        heading: '6. Etkileşimli PDF ve Bağımsız Tek Dosya HTML',
        content: 'Dijital metin alanları ve sıfırlama düğmesi içeren doldurulabilir AcroForm PDF çalışma sayfaları oluşturun veya tek dosyalık HTML5 sürümünü indirin.'
      },
      {
        heading: '7. Çoklu Platform Paketleme Paketleri',
        content: 'Python, Node.js, Go ve Rust otomasyon betiklerini kullanın. Android APK, Windows EXE ve macOS DMG oluşturmak için INSTALLATION.md kılavuzunu inceleyin.'
      }
    ]
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    title: 'KayBiT_CEHinteractive — Полное руководство пользователя',
    sections: [
      {
        heading: '1. Обзор и автономная архитектура',
        content: 'KayBiT_CEHinteractive — это бессерверная интерактивная среда для подготовки к экзамену CEH v13. Работает на 100% в автономном режиме без подключения к внешней базе данных, сохраняя весь прогресс и заметки в localStorage браузера.'
      },
      {
        heading: '2. Трекер прогресса по 20 доменам CEH v13',
        content: 'Изучайте 20 официальных модулей CEH v13 от разведки до облачной безопасности и уязвимостей искусственного интеллекта. Отмечайте выполненные задачи и отслеживайте процент готовности к экзамену.'
      },
      {
        heading: '3. Модуль пробного тестирования и конструктор вопросов',
        content: 'Проходите тесты в режиме тренировки с мгновенными объяснениями или в режиме экзамена на время. Добавляйте свои вопросы и экспортируйте базы тестов в формате JSON.'
      },
      {
        heading: '4. Интерактивный генератор команд Nmap',
        content: 'Визуальный конструктор параметров Nmap: SYN-сканирование (-sS), обход межсетевых экранов (-f, приманки -D, порт 53) и скрипты NSE с расшифровкой синтаксиса.'
      },
      {
        heading: '5. Шпаргалки по безопасности на 21 языке',
        content: 'Примеры кода для Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Ассемблера и COBOL.'
      },
      {
        heading: '6. Интерактивный заполняемый PDF и автономный HTML5',
        content: 'Экспортируйте PDF-формы с редактируемыми полями и кнопками сброса либо скачивайте автономную однофайловую версию приложения.'
      },
      {
        heading: '7. Скрипты локальной кроссплатформенной сборки',
        content: 'Скрипты на Python, Node.js, Go и Rust для локального запуска. Инструкции по созданию APK для Android, EXE для Windows и DMG для macOS представлены в INSTALLATION.md.'
      }
    ]
  },
  zh: {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    title: 'KayBiT_CEHinteractive — 综合学生使用指南',
    sections: [
      {
        heading: '1. 概述与离线无服务器架构',
        content: 'KayBiT_CEHinteractive 是一款专为备考 CEH v13 认证的高级编程与网络安全学生设计的全功能自学平台。无需后端数据库，100% 离线运行，所有进度、测验分数与笔记均持久化存储在浏览器的 localStorage 中。'
      },
      {
        heading: '2. CEH v13 知识领域进度跟踪器',
        content: '系统学习 CEH v13 官方 20 个核心模块，从网络侦察到云安全与人工智能漏洞。逐项核对目标，实时计算加权备考完成率。'
      },
      {
        heading: '3. 实时模拟考试引擎与自定义题库',
        content: '提供详尽解析的练习模式与限时实战考试模式。内置自定义出题工具，支持一键将个人题库导出/导入为便携 JSON 文件。'
      },
      {
        heading: '4. 交互式 Nmap 命令构建器',
        content: '可视化勾选 TCP SYN 隐蔽扫描 (-sS)、防火墙与 IDS 规避（分段 -f、诱饵 -D、源端口 53）以及 NSE 漏洞探测脚本，支持一键复制与语法解析。'
      },
      {
        heading: '5. 覆盖 21 种编程语言的安全自动化速查表',
        content: '涵盖 Python、JavaScript、TypeScript、Java、C#、Kotlin、Dart、Bash、Rust、Go、C++、C、PHP、Ruby、PowerShell、SQL、R、Scala、MATLAB、汇编 (Assembly) 与 COBOL 的攻防代码实战。'
      },
      {
        heading: '6. 交互式可填写 PDF 与单文件离线 HTML 导出',
        content: '可在浏览器端直接生成包含文本框、下拉菜单与重置按钮的 AcroForm 交互式 PDF；亦可下载完全独立运行的单文件 HTML5 应用。'
      },
      {
        heading: '7. 跨平台打包套件与部署说明',
        content: '提供 Python、Node.js、Go 及 Rust 本地封装脚本。参阅 INSTALLATION.md 即可轻松将项目构建为 Android APK、Windows .exe 及 macOS .dmg。'
      }
    ]
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    title: 'KayBiT_CEHinteractive — 総合学習ガイド',
    sections: [
      {
        heading: '1. 概要と完全オフライン設計',
        content: 'KayBiT_CEHinteractive は、CEH v13 認定試験を目指すプログラミングおよびサイバーセキュリティ学習者向けに構築されたサーバーレス学習環境です。データベース不要で100%オフライン動作し、進捗状況や模擬試験スコアはブラウザの localStorage に自動保存されます。'
      },
      {
        heading: '2. CEH v13 20ドメイン進捗トラッカー',
        content: '偵察・スキャンからクラウドセキュリティ、AIの脆弱性対策まで、CEH v13 の全20モジュールを網羅。達成度チェックとリアルタイムな合格準備率を可視化します。'
      },
      {
        heading: '3. リアルタイム模擬試験＆カスタム問題作成機能',
        content: '詳細解説付きの練習モードと制限時間付き試験モードを搭載。オリジナルの問題を作成し、JSON形式で自由に入出力できます。'
      },
      {
        heading: '4. インタラクティブ Nmap コマンドビルダー',
        content: 'SYN ステルススキャン (-sS)、パケット断片化 (-f)、デコイ (-D)、送信元ポート偽装 (-g 53) などのオプションを直感的に選択し、即座にコマンドを生成・コピーできます。'
      },
      {
        heading: '5. 21言語対応 セキュリティ自動化チートシート',
        content: 'Python、JS、TS、Java、C#、Kotlin、Dart、Bash、Rust、Go、C++、C、PHP、Ruby、PowerShell、SQL、R、Scala、MATLAB、アセンブリ、COBOL の実践コードを掲載。'
      },
      {
        heading: '6. 入力可能な対話型PDF＆単一HTMLエクスポート',
        content: 'デジタルテキスト入力やプルダウン、リセットボタンを備えたインタラクティブPDFを出力可能。USBからそのまま起動できる単一HTMLファイルもダウンロードできます。'
      },
      {
        heading: '7. クロスプラットフォームパッケージング',
        content: 'Python、Node.js、Go、Rust の自動化スクリプトを同梱。Android APK、Windows EXE、macOS DMG の作成手順は INSTALLATION.md をご確認ください。'
      }
    ]
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    title: 'KayBiT_CEHinteractive — دليل المستخدم الشامل للطلاب',
    sections: [
      {
        heading: '١. نظرة عامة والمعمارية غير المتصلة بالإنترنت',
        content: 'KayBiT_CEHinteractive هي منصة تعليمية ذاتية ومستقلة تماماً وبدون خادم، مصممة لطلاب البرمجة والأمن السيبراني المتقدمين للتحضير لاختبار CEH v13. تعمل بنسبة 100٪ بدون اتصال بالإنترنت، حيث تُحفظ جميع البيانات في localStorage بالمتصفح.'
      },
      {
        heading: '٢. متابع مسار مجالات CEH v13 العشرين',
        content: 'تتبع كافة الوحدات الـ 20 الرسمية من جمع المعلومات إلى أمن السحابة وثغرات الذكاء الاصطناعي. حدد الأهداف المكتملة وراقب معدل جاهزيتك للاختبار مباشرة.'
      },
      {
        heading: '٣. محرك الاختبارات التجريبية وصانع الأسئلة المخصص',
        content: 'اختبر مهاراتك من خلال أسئلة واقعية مع شروحات فورية في وضع التدريب، أو خوض وضع الاختبار الموقوت. يمكنك إضافة أسئلتك الخاصة وتصدير بنك الأسئلة كملف JSON.'
      },
      {
        heading: '٤. منشئ أوامر Nmap التفاعلي',
        content: 'قم ببناء أوامر فحص الشبكات المتقدمة بصرياً: فحص SYN الخفي (-sS)، تجاوز جدران الحماية (-f، التمويه -D، المنفذ 53)، وسكربتات NSE مع نسخ فوري للأمر.'
      },
      {
        heading: '٥. مذكرات برمجية للأمن السيبراني عبر 21 لغة',
        content: 'أكواد عملية بلغات Python و JavaScript و TypeScript و Java و C# و Kotlin و Dart و Bash و Rust و Go و C++ و C و PHP و Ruby و PowerShell و SQL و R و Scala و MATLAB و Assembly و COBOL.'
      },
      {
        heading: '٦. تصدير ملفات PDF التفاعلية وملف HTML المستقل',
        content: 'أنشئ استمارات PDF تفاعلية تحتوي على حقول رقمية قابلة للكتابة وقوائم منسدلة وأزرار مسح، أو حمّل التطبيق كملف HTML5 مفرد يعمل بدون أي تثبيت.'
      },
      {
        heading: '٧. حزم التشغيل المحلية عبر مختلف المنصات',
        content: 'استخدم سكربتات Python و Node.js و Go و Rust لتحويل التطبيق لملفات تنفيذية أصلية لنظام Android (APK) و Windows (EXE) و macOS (DMG) عبر دليل INSTALLATION.md.'
      }
    ]
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    rtl: true,
    title: 'KayBiT_CEHinteractive — جامع یوزر گائیڈ برائے طلباء',
    sections: [
      {
        heading: '1. تعارف اور آف لائن خودکار نظام',
        content: 'KayBiT_CEHinteractive ایک مکمل خود مختار تعلیمی پلیٹ فارم ہے جو CEH v13 سرٹیفیکیشن کے امیدواروں کے لیے بنایا گیا ہے۔ یہ بغیر کسی بیرونی ڈیٹا بیس کے 100٪ آف لائن کام کرتا ہے اور تمام پیش رفت ویب براؤزر کے localStorage میں محفوظ رکھتا ہے۔'
      },
      {
        heading: '2. CEH v13 کے 20 ماڈیولز کا ٹریکر',
        content: 'نیٹ ورک اسکیننگ سے لے کر کلاؤڈ سیکیورٹی اور مصنوعی ذہانت کے ماڈیولز تک کے تمام اہداف مکمل کریں اور اپنے امتحان کی تیاری کا حقیقی وقت میں جائزہ لیں۔'
      },
      {
        heading: '3. فرضی کوئز انجن اور کسٹم سوالات بنانے کی سہولت',
        content: 'پریکٹس موڈ میں فوری وضاحت کے ساتھ یا ٹائمر والے امتحان کے موڈ میں ٹیسٹ دیں۔ طلباء اپنے نئے سوالات شامل کر سکتے ہیں اور سوالات کا بینک JSON میں محفوظ کر سکتے ہیں۔'
      },
      {
        heading: '4. انٹرایکٹو Nmap کمانڈ بلڈر',
        content: 'این میپ کی جدید ترین کمانڈز منتخب کریں: SYN اسٹیلتھ اسکین، فائر وال بائی پاس، اور NSE اسکرپٹس بمع ایک کلک کاپی اور مفصل وضاحت۔'
      },
      {
        heading: '5. 21 پروگرامنگ زبانوں کے سیکیورٹی چیٹ شیٹس',
        content: 'Python, JS, TS, Java, C#, Kotlin, Dart, Bash, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, Assembly اور COBOL کے مکمل عملی کوڈز۔'
      },
      {
        heading: '6. انٹرایکٹو فل ایبل پی ڈی ایف اور سنگل فائل ایچ ٹی ایم ایل',
        content: 'ڈیجیٹل ٹیکسٹ فیلڈز اور ری سیٹ بٹنوں کے ساتھ فارم نما PDF تیار کریں یا سنگل فائل HTML5 ڈاؤن لوڈ کر کے بغیر انٹرنیٹ کسی بھی کمپیوٹر پر چلائیں۔'
      },
      {
        heading: '7. کراس پلیٹ فارم مقامی انسٹالیشن',
        content: 'Python، Node.js، Go اور Rust کے اسکرپٹس کا استعمال کریں۔ Android APK، Windows EXE اور Mac DMG بنانے کے لیے INSTALLATION.md کا مطالعہ کریں۔'
      }
    ]
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    title: 'KayBiT_CEHinteractive — सम्पूर्ण छात्र उपयोगकर्ता मार्गदर्शिका',
    sections: [
      {
        heading: '1. अवलोकन एवं ऑफलाइन आर्किटेक्चर',
        content: 'KayBiT_CEHinteractive एक सर्वरलेस और पूरी तरह से ऑफलाइन अध्ययन उपकरण है जो CEH v13 प्रमाणन की तैयारी कर रहे छात्रों के लिए विकसित किया गया है। यह बिना किसी बाहरी डेटाबेस के ब्राउज़र के localStorage में स्कोर और नोट्स सुरक्षित रखता है।'
      },
      {
        heading: '2. CEH v13 के 20 मॉड्यूल प्रगति ट्रैकर',
        content: 'फ़ुटप्रिंटिंग से लेकर क्लाउड सुरक्षा और एआई खतरों तक सभी 20 आधिकारिक CEH v13 मॉड्यूल की प्रगति ट्रैक करें और परीक्षा की तैयारी प्रतिशत की गणना करें।'
      },
      {
        heading: '3. रियल-टाइम मॉक क्विज़ इंजन और कस्टम प्रश्न निर्माता',
        content: 'अभ्यास मोड में व्याख्या सहित और परीक्षा मोड में समय सीमा के साथ प्रश्नों को हल करें। अपने खुद के प्रश्न जोड़ें और JSON फाइल के रूप में सहेजें।'
      },
      {
        heading: '4. इंटरैक्टिव Nmap कमांड बिल्डर',
        content: 'SYN स्टील्थ स्कैन (-sS), फ़ायरवॉल बाईपास (-f, Decoys -D) और NSE स्क्रिप्ट्स को आसानी से चुनें और एक क्लिक में कॉपी करें।'
      },
      {
        heading: '5. 21 प्रोग्रामिंग भाषाओं में साइबर सुरक्षा कोड चीट शीट',
        content: 'पायथन, जावास्क्रिप्ट, टाइपस्क्रिप्ट, जावा, C#, कोटलिन, डार्ट, बैश, रस्ट, गो, C++, C, PHP, रूबी, पॉवरशेल, SQL, R, स्काला, मैटलैब, असेंबली और कोबोल में तैयार कोड।'
      },
      {
        heading: '6. इंटरैक्टिव फॉर्म-भरे जाने योग्य PDF और सिंगल-फाइल HTML5',
        content: 'डिजिटल टेक्स्ट बॉक्स और रीसेट बटन वाले फॉर्म पीडीएफ बनाएं या सिंगल-फाइल HTML5 डाउनलोड करके पेनड्राइव से कहीं भी चलाएं।'
      },
      {
        heading: '7. क्रॉस-प्लेटफ़ॉर्म नेटिव पैकेजिंग',
        content: 'पायथन, गो, रस्ट और नोड.जेएस ऑटोमेशन स्क्रिप्ट उपलब्ध हैं। Android APK, Windows EXE और macOS DMG बनाने के लिए INSTALLATION.md देखें।'
      }
    ]
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    title: 'KayBiT_CEHinteractive — सर्वसमावेशक विद्यार्थी वापरकर्ता मार्गदर्शक',
    sections: [
      {
        heading: '1. विहंगावलोकन आणि ऑफलाइन कार्यप्रणाली',
        content: 'KayBiT_CEHinteractive हे CEH v13 परीक्षेच्या तयारीसाठी एक सर्वसमावेशक, सर्व्हरलेस आणि ऑफलाइन प्लॅटफॉर्म आहे. कोणताही बाह्य डेटाबेस न वापरता प्रगती आणि नोट्स थेट ब्राउझरच्या localStorage मध्ये जतन केल्या जातात.'
      },
      {
        heading: '2. CEH v13 वीस मॉड्यूल्स प्रगती ट्रॅकर',
        content: 'फूटप्रिंटिंगपासून क्लाउड आणि एआय सुरक्षेपर्यंतच्या सर्व २० अधिकृत मॉड्यूल्सचा अभ्यास करा आणि परीक्षेच्या तयारीची टक्केवारी तपासा.'
      },
      {
        heading: '3. रिअल-टाइम मॉक क्विझ आणि सानुकूल प्रश्न संच',
        content: 'सराव पद्धतीत स्पष्टीकरणासह किंवा परीक्षा पद्धतीत वेळेसह सराव करा. स्वतःचे प्रश्न जोडा आणि JSON स्वरूपात निर्यात करा.'
      },
      {
        heading: '4. परस्परसंवादी Nmap कमांड बिल्डर',
        content: 'SYN स्टेल्थ स्कॅन, फायरवॉल बायपास तंत्रे आणि NSE स्क्रिप्ट्सची कमांड एका क्लिकमध्ये तयार करा आणि कॉपी करा.'
      },
      {
        heading: '5. २१ प्रोग्रामिंग भाषांमधील सायबर सुरक्षा कोड',
        content: 'पायथन, जावा, रस्ट, गो, C++, C, बैश, कोटलिन, डार्ट, एसक्यूएल सह २१ भाषांमध्ये प्रत्यक्ष सायबर सिक्युरिटी स्क्रिप्ट्स.'
      },
      {
        heading: '6. इंटरएक्टिव्ह पीडीएफ आणि सिंगल-फाइल एचटीएमएल',
        content: 'भरता येणारे डिजिटल पीडीएफ तयार करा किंवा कोणत्याही संगणकावर चालणारी स्वतंत्र सिंगल-फाइल HTML5 ॲप डाउनलोड करा.'
      },
      {
        heading: '7. क्रॉस-प्लॅटफॉर्म नेटिव्ह इन्स्टॉलेशन',
        content: 'Android APK, Windows EXE आणि macOS DMG तयार करण्यासाठी INSTALLATION.md मधील मार्गदर्शक तत्त्वे वापरा.'
      }
    ]
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    title: 'KayBiT_CEHinteractive — পূর্ণাঙ্গ শিক্ষার্থী নির্দেশিকা',
    sections: [
      {
        heading: '১. সংক্ষিপ্ত পরিচিতি ও অফলাইন আর্কিটেকচার',
        content: 'KayBiT_CEHinteractive হলো CEH v13 সার্টিফিকেশনের জন্য প্রস্তুতকৃত সম্পূর্ণ অফলাইন ও সার্ভারবিহীন স্টাডি প্ল্যাটফর্ম। কোনো ডেটাবেজ ছাড়াই ব্রাউজারের localStorage-এ সমস্ত কুইজ স্কোর ও নোট সংরক্ষিত থাকে।'
      },
      {
        heading: '২. CEH v13 এর ২০টি ডোমেন অগ্রগতি ট্র্যাকার',
        content: 'নেটওয়ার্ক স্ক্যানিং থেকে শুরু করে ক্লাউড ও এআই সিকিউরিটি পর্যন্ত ২০টি মডিউলের অগ্রগতি পর্যবেক্ষণ করুন এবং প্রস্তুতি শতাংশ গণনা করুন।'
      },
      {
        heading: '৩. রিয়েল-টাইম মক কুইজ ও কাস্টম প্রশ্ন তৈরি',
        content: 'তাৎক্ষণিক ব্যাখ্যাসহ প্র্যাকটিস মোড অথবা সময়সীমা যুক্ত এক্সাম মোডে পরীক্ষা দিন। নিজস্ব প্রশ্ন তৈরি করে JSON ফরম্যাটে সংরক্ষণ করুন।'
      },
      {
        heading: '৪. ইন্টারঅ্যাক্টিভ Nmap কমান্ড প্রস্তুতকারক',
        content: 'SYN স্টিলথ স্ক্যান, ফায়ারওয়াল এভ্যাশন ও NSE স্ক্রিপ্ট সহজে নির্বাচন করে এক ক্লিকে সম্পূর্ণ কমান্ড কপি ও ব্যবহার করুন।'
      },
      {
        heading: '৫. ২১টি প্রোগ্রামিং ভাষায় সাইবার সিকিউরিটি কোড শিট',
        content: 'পাইথন, জাভাস্ক্রিপ্ট, জাভা, সি#, রাস্ট, গো, সি++, ব্যাশ, এসকিউএল সহ ২১টি ভাষার আক্রমণাত্মক ও প্রতিরক্ষামূলক কোড।'
      },
      {
        heading: '৬. পূরণযোগ্য ইন্টারেক্টিভ PDF ও একক ফাইল HTML5',
        content: 'ডিজিটাল টেক্সট ফিল্ড ও রিসেট বাটন যুক্ত পিডিএফ তৈরি করুন অথবা পেনড্রাইভ থেকে সরাসরি ব্যবহারের জন্য একক এইচটিএমএল ফাইল ডাউনলোড করুন।'
      },
      {
        heading: '৭. ক্রস-প্ল্যাটফর্ম নেটিভ প্যাকেজিং',
        content: 'Android APK, Windows EXE এবং Mac DMG তৈরির বিস্তারিত নিয়ম জানতে INSTALLATION.md ফাইলটি দেখুন।'
      }
    ]
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    title: 'KayBiT_CEHinteractive — மாணவர்களுக்கான முழுமையான வழிகாட்டி',
    sections: [
      {
        heading: '1. மேலோட்டம் மற்றும் ஆஃப்லைன் கட்டமைப்பு',
        content: 'KayBiT_CEHinteractive என்பது CEH v13 சான்றிதழ் தேர்வுக்குத் தயாராகும் மாணவர்களுக்காக வடிவமைக்கப்பட்ட ஒரு ஆஃப்லைன் சுய-கற்றல் தளம். இது எந்த சர்வர் தரவுத்தளமும் இல்லாமல் உலாவியின் localStorage இல் உங்கள் முன்னேற்றத்தை பாதுகாக்கிறது.'
      },
      {
        heading: '2. CEH v13 20 தொகுதிகள் முன்னேற்றக் கண்காணிப்பாளர்',
        content: 'ஃபுட்பிரிண்டிங் முதல் கிளவுட் மற்றும் AI பாதுகாப்பு வரை அனைத்து 20 தொகுதிகளையும் படித்து தேர்வுக்குத் தயார் நிலையை அறியலாம்.'
      },
      {
        heading: '3. நிகழ்நேர வினாடி வினா இயந்திரம்',
        content: 'விளக்கங்களுடன் கூடிய பயிற்சி முறை அல்லது குறிப்பிட்ட நேரத்திற்குள் எழுதக்கூடிய தேர்வு முறையில் வினாக்களுக்குப் பதிலளிக்கலாம்.'
      },
      {
        heading: '4. ஊடாடும் Nmap கட்டளை உருவாக்கி',
        content: 'SYN ஸ்டெல்த் ஸ்கேன், ஃபயர்வால் தப்பிக்கும் முறைகள் மற்றும் NSE ஸ்கிரிப்ட்களை எளிதாகத் தேர்வுசெய்து கட்டளைகளை உருவாக்கலாம்.'
      },
      {
        heading: '5. 21 நிரலாக்க மொழிகளுக்கான சைபர் பாதுகாப்பு குறிப்புகள்',
        content: 'பைதான், ஜாவாஸ்கிரிப்ட், கோ, ரஸ்ட், சி++, சி, பாஷ், எஸ்கியூஎல் உள்ளிட்ட 21 மொழிகளில் ஆயத்த சைபர் பாதுகாப்பு நிரல்கள்.'
      },
      {
        heading: '6. ஊடாடும் படிவ PDF மற்றும் தனித்த HTML5 கோப்பு',
        content: 'எழுதும் வசதி கொண்ட PDF படிவங்களை உருவாக்கலாம் அல்லது இணையம் இல்லாமல் பயன்படுத்த தனித்த HTML5 கோப்பைப் பதிவிறக்கலாம்.'
      },
      {
        heading: '7. பல இயங்குதளங்களுக்கான நிறுவல் வழிகாட்டி',
        content: 'Android APK, Windows EXE மற்றும் macOS DMG உருவாக்க INSTALLATION.md கோப்பைப் பார்க்கவும்.'
      }
    ]
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    title: 'KayBiT_CEHinteractive — సమగ్ర విద్యార్థి వినియోగదారు మార్గదర్శి',
    sections: [
      {
        heading: '1. పరిచయం & ఆఫ్‌లైన్ ఆర్కిటెక్చర్',
        content: 'KayBiT_CEHinteractive అనేది CEH v13 పరీక్షకు సిద్ధమవుతున్న విద్యార్థుల కోసం రూపొందించబడిన సర్వర్‌లెస్ ఆఫ్‌లైన్ లెర్నింగ్ ప్లాట్‌ఫామ్. ఇది బ్రౌజర్ యొక్క localStorage లో స్కోర్లు మరియు నోట్స్‌ను సురక్షితంగా భద్రపరుస్తుంది.'
      },
      {
        heading: '2. CEH v13 ఇరవై డొమైన్ల పురోగతి ట్రాకర్',
        content: 'రికానైసెన్స్ నుండి క్లౌడ్ సెక్యూరిటీ మరియు AI ముప్పుల వరకు మొత్తం 20 అధికారిక మాడ్యూల్స్ పురోగతిని పర్యవేక్షించండి.'
      },
      {
        heading: '3. రియల్-టైమ్ మాక్ క్విజ్ ఇంజిన్',
        content: 'వివరణలతో కూడిన ప్రాక్టీస్ మోడ్ లేదా సమయ పరిమితి గల ఎగ్జామ్ మోడ్‌లో మాక్ టెస్టులు రాయండి. మీ స్వంత ప్రశ్నలను సృష్టించి JSON ఫైల్ రూపంలో సేవ్ చేయవచ్చు.'
      },
      {
        heading: '4. ఇంటరాక్టివ్ Nmap కమాండ్ బిల్డర్',
        content: 'SYN స్టీల్త్ స్కాన్, ఫైర్‌వాల్ బైపాస్ ఆప్షన్లు మరియు NSE స్క్రిప్ట్‌లను ఎంచుకుని ఒక్క క్లిక్‌తో కమాండ్‌ను కాపీ చేసుకోండి.'
      },
      {
        heading: '5. 21 ప్రోగ్రామింగ్ లాంగ్వేజెస్‌లో సైబర్ సెక్యూరిటీ కోడ్',
        content: 'పైథాన్, జావాస్క్రిప్ట్, టైప్‌స్క్రిప్ట్, జావా, రస్ట్, గో, C++, బ్యాష్, SQL లతో సహా 21 భాషల్లో సైబర్ సెక్యూరిటీ కోడ్ నమూనాలు.'
      },
      {
        heading: '6. ఇంటరాక్టివ్ పూరించదగిన PDF మరియు సింగిల్ ఫైల్ HTML5',
        content: 'టెక్స్ట్ ఫీల్డ్స్ మరియు రీసెట్ బటన్లతో కూడిన ఇంటరాక్టివ్ PDF లను సృష్టించండి లేదా పెన్ డ్రైవ్ నుండి నేరుగా రన్ అయ్యే సింగిల్ ఫైల్ HTML5 ను డౌన్‌లోడ్ చేసుకోండి.'
      },
      {
        heading: '7. క్రాస్-ప్లాట్‌ఫామ్ స్థానిక ప్యాకేజింగ్',
        content: 'Android APK, Windows EXE మరియు macOS DMG రూపంలో యాప్‌ను ఇన్‌స్టాల్ చేయడానికి INSTALLATION.md మార్గదర్శకాలను ఉపయోగించండి.'
      }
    ]
  }
};
