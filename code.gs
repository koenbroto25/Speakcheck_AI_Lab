/**
 * ============================================================
 * SpeakCheck: AI Feedback Lab - Google Apps Script Backend
 * ============================================================
 * 
 * Backend API untuk aplikasi latihan berbicara bahasa Inggris
 * Berfungsi sebagai middleware antara React Frontend dan Google Sheets Database
 * 
 * @version 1.0.0
 * @author SpeakCheck Development Team
 * 
 * STRUKTUR DATABASE:
 * - Content_Bank: Menyimpan soal dan konten permainan
 * - Students: Profil siswa dan progress XP
 * - Progress_Log: Log aktivitas untuk penelitian
 * 
 * CARA PENGGUNAAN:
 * 1. Buat Google Spreadsheet baru
 * 2. Buka Extensions > Apps Script
 * 3. Paste seluruh kode ini
 * 4. Jalankan initializeSystem() SEKALI untuk membuat struktur database
 * 5. Deploy sebagai Web App (Execute as: Me, Access: Anyone)
 * 6. Copy Web App URL ke file .env frontend
 */

// ============================================================
// 1. MAIN SETUP FUNCTION
// Jalankan fungsi ini SEKALI untuk membangun database secara otomatis
// ============================================================

/**
 * initializeSystem - Membuat struktur database secara otomatis
 * Fungsi ini akan membuat 3 sheet: Content_Bank, Students, dan Progress_Log
 * dengan kolom yang sesuai dan data sampel untuk testing
 */
function initializeSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Definisi struktur database
  var tables = {
    "Content_Bank": [
      "ID", 
      "Game_Type", 
      "Level", 
      "Prompt_Text", 
      "Target_Keywords", 
      "Correct_Audio_URL", 
      "Feedback_Rules", 
      "Is_Active"
    ],
    "Students": [
      "Student_ID", 
      "Name", 
      "Class", 
      "Total_XP", 
      "Created_At",
      "Settings"
    ],
    "Progress_Log": [
      "Log_ID", 
      "Timestamp", 
      "Student_ID", 
      "Game_Type", 
      "Prompt_ID", 
      "Raw_Speech_Output",
      "Error_Detected", 
      "Feedback_Given", 
      "Feedback_Type",
      "Uptake_Success", 
      "Score",
      "Confidence_Level",
      "Attempt_Count"
    ]
  };
  
  // Buat sheet jika belum ada
  for (var sheetName in tables) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Set header row
      sheet.getRange(1, 1, 1, tables[sheetName].length)
        .setValues([tables[sheetName]]);
      sheet.setFrozenRows(1);
      // Format header
      sheet.getRange(1, 1, 1, tables[sheetName].length)
        .setFontWeight("bold")
        .setBackground("#4A90E2")
        .setFontColor("#FFFFFF")
        .setHorizontalAlignment("center");
    }
  }
  
  // Tambahkan data sampel ke Content_Bank jika kosong
  var contentSheet = ss.getSheetByName("Content_Bank");
  if (contentSheet.getLastRow() < 2) {
    var sampleData = [
      // Grammar Mode - Level 1
      ["G01", "Grammar", "1", "Tell me what you did yesterday.", "went,played,watched,studied", "", "past_tense_check", "TRUE"],
      ["G02", "Grammar", "1", "Ask me about my hobby.", "What is your hobby,Do you have", "", "present_simple_question", "TRUE"],
      ["G03", "Grammar", "1", "Tell me about your family.", "have,has,brother,sister,mother,father", "", "present_simple_statement", "TRUE"],
      ["G04", "Grammar", "2", "Describe what you were doing at 8 PM last night.", "was watching,was reading,was studying,was playing", "", "past_continuous", "TRUE"],
      ["G05", "Grammar", "2", "Tell me about your plans for next weekend.", "will go,am going to,plan to", "", "future_tense", "TRUE"],
      
      // Vocabulary Mode - Level 1
      ["V01", "Vocabulary", "1", "Describe a busy market place.", "crowded,busy,noisy,people,market", "", "keyword_match", "TRUE"],
      ["V02", "Vocabulary", "1", "Describe the weather on a rainy day.", "rainy,wet,cloudy,dark,umbrella", "", "keyword_match", "TRUE"],
      ["V03", "Vocabulary", "1", "Describe your favorite food.", "delicious,tasty,spicy,sweet,favorite", "", "keyword_match", "TRUE"],
      ["V04", "Vocabulary", "2", "Describe a beautiful garden.", "beautiful,flowers,green,peaceful,colorful,blooming", "", "keyword_match", "TRUE"],
      ["V05", "Vocabulary", "2", "Describe a difficult exam.", "difficult,hard,challenging,questions,study,nervous", "", "keyword_match", "TRUE"],
      
      // Pronunciation Mode - Level 1
      ["P01", "Pronunciation", "1", "The weather is nice today.", "weather,nice,today", "", "phonics_check_th", "TRUE"],
      ["P02", "Pronunciation", "1", "She sells seashells by the seashore.", "she,sells,seashells,seashore", "", "phonics_check_sh", "TRUE"],
      ["P03", "Pronunciation", "1", "How much wood would a woodchuck chuck?", "much,wood,would,woodchuck,chuck", "", "phonics_check_w", "TRUE"],
      ["P04", "Pronunciation", "2", "Peter Piper picked a peck of pickled peppers.", "Peter,Piper,picked,peck,pickled,peppers", "", "phonics_check_p", "TRUE"],
      ["P05", "Pronunciation", "2", "The three free throws went through the hoop.", "three,free,throws,through", "", "phonics_check_thr", "TRUE"],
      
      // Noticing Room Mode - Level 1
      ["N01", "Noticing", "1", "Yesterday I go to school.", "went", "go", "past_tense_error", "TRUE"],
      ["N02", "Noticing", "1", "She have a beautiful cat.", "has", "have", "subject_verb_agreement", "TRUE"],
      ["N03", "Noticing", "1", "I am study English every day.", "study", "am study", "present_continuous_error", "TRUE"],
      ["N04", "Noticing", "2", "They was playing football yesterday.", "were", "was", "subject_verb_agreement", "TRUE"],
      ["N05", "Noticing", "2", "He don't like vegetables.", "doesn't", "don't", "subject_verb_agreement", "TRUE"]
    ];
    contentSheet.getRange(2, 1, sampleData.length, sampleData[0].length)
      .setValues(sampleData);
  }
  
  // Tambahkan siswa sampel jika Students kosong
  var studentSheet = ss.getSheetByName("Students");
  if (studentSheet.getLastRow() < 2) {
    var sampleStudents = [
      ["S001", "Ahmad Rizki", "7A", 0, new Date(), "{}"],
      ["S002", "Siti Nurhaliza", "7A", 0, new Date(), "{}"],
      ["S003", "Budi Santoso", "7B", 0, new Date(), "{}"],
      ["DEMO", "Demo Student", "TEST", 0, new Date(), "{}"]
    ];
    studentSheet.getRange(2, 1, sampleStudents.length, sampleStudents[0].length)
      .setValues(sampleStudents);
  }
  
  // Set lebar kolom untuk tampilan yang lebih baik
  setColumnWidths(ss);
  
  Logger.log("✅ SpeakCheck System Initialized Successfully!");
  Logger.log("📊 Sheets created: Content_Bank, Students, Progress_Log");
  Logger.log("📝 Sample data added for testing");
  
  return {
    success: true,
    message: "System initialized successfully!",
    tables: Object.keys(tables)
  };
}

/**
 * Set lebar kolom untuk tampilan yang lebih baik
 */
function setColumnWidths(ss) {
  var contentSheet = ss.getSheetByName("Content_Bank");
  if (contentSheet) {
    contentSheet.setColumnWidth(1, 80);  // ID
    contentSheet.setColumnWidth(2, 100); // Game_Type
    contentSheet.setColumnWidth(3, 60);  // Level
    contentSheet.setColumnWidth(4, 300); // Prompt_Text
    contentSheet.setColumnWidth(5, 250); // Target_Keywords
    contentSheet.setColumnWidth(6, 200); // Correct_Audio_URL
    contentSheet.setColumnWidth(7, 150); // Feedback_Rules
    contentSheet.setColumnWidth(8, 80);  // Is_Active
  }
  
  var progressSheet = ss.getSheetByName("Progress_Log");
  if (progressSheet) {
    progressSheet.setColumnWidth(1, 100); // Log_ID
    progressSheet.setColumnWidth(2, 150); // Timestamp
    progressSheet.setColumnWidth(3, 100); // Student_ID
    progressSheet.setColumnWidth(4, 100); // Game_Type
    progressSheet.setColumnWidth(5, 80);  // Prompt_ID
    progressSheet.setColumnWidth(6, 300); // Raw_Speech_Output
    progressSheet.setColumnWidth(7, 150); // Error_Detected
    progressSheet.setColumnWidth(8, 200); // Feedback_Given
    progressSheet.setColumnWidth(9, 120); // Feedback_Type
    progressSheet.setColumnWidth(10, 100); // Uptake_Success
    progressSheet.setColumnWidth(11, 80); // Score
    progressSheet.setColumnWidth(12, 120); // Confidence_Level
    progressSheet.setColumnWidth(13, 100); // Attempt_Count
  }
  
  var studentSheet = ss.getSheetByName("Students");
  if (studentSheet) {
    studentSheet.setColumnWidth(1, 100); // Student_ID
    studentSheet.setColumnWidth(2, 150); // Name
    studentSheet.setColumnWidth(3, 80);  // Class
    studentSheet.setColumnWidth(4, 80);  // Total_XP
    studentSheet.setColumnWidth(5, 150); // Created_At
    studentSheet.setColumnWidth(6, 200); // Settings
  }
}

// ============================================================
// 2. HTTP REQUEST HANDLERS
// Menangani permintaan API dari React Frontend
// ============================================================

/**
 * doGet - Menangani HTTP GET requests
 * Digunakan untuk mengambil data dari spreadsheet
 * 
 * Parameters:
 * - action: 'getContent', 'getStudent', 'getAllContent', 'getProgress'
 * - level: Level soal (1, 2, 3)
 * - type: Tipe game (Grammar, Vocabulary, Pronunciation, Noticing)
 * - studentId: ID siswa
 */
function doGet(e) {
  var params = e.parameter;
  var action = params.action;
  
  try {
    var result;
    
    switch (action) {
      case 'getContent':
        result = getGameContent(params.level, params.type);
        break;
      case 'getStudent':
        result = getStudentProfile(params.studentId);
        break;
      case 'getAllContent':
        result = getAllContent();
        break;
      case 'getProgress':
        result = getStudentProgress(params.studentId);
        break;
      case 'getLeaderboard':
        result = getLeaderboard();
        break;
      case 'createStudent':
        result = createStudent({
          studentId: params.studentId,
          name: params.name,
          studentClass: params.studentClass
        });
        break;
      case 'saveProgress':
        result = saveProgress(JSON.parse(params.data));
        break;
      case 'health':
        result = { status: 'ok', timestamp: new Date().toISOString() };
        break;
      default:
        result = { error: 'Invalid action. Use: getContent, getStudent, getAllContent, getProgress, getLeaderboard, createStudent, saveProgress' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.toString(),
        message: 'An error occurred while processing your request'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doPost - Menangani HTTP POST requests
 * Digunakan untuk menyimpan data ke spreadsheet
 * 
 * Body JSON:
 * - action: 'saveProgress', 'createStudent', 'updateSettings'
 * - data: Object berisi data yang akan disimpan
 */
function doPost(e) {
  var postData;
  
  try {
    postData = JSON.parse(e.postData.contents);
  } catch (parseError) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON data' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var action = postData.action;
  
  try {
    var result;
    
    switch (action) {
      case 'saveProgress':
        result = saveProgress(postData.data);
        break;
      case 'createStudent':
        result = createStudent(postData.data);
        break;
      case 'updateSettings':
        result = updateStudentSettings(postData.data);
        break;
      case 'bulkSave':
        result = bulkSaveProgress(postData.data);
        break;
      default:
        result = { success: false, error: 'Invalid action' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// 3. API: GET GAME CONTENT
// Mengambil soal dari Content_Bank
// ============================================================

/**
 * getGameContent - Mengambil konten game berdasarkan level dan tipe
 * 
 * @param {string} level - Level soal (1, 2, 3)
 * @param {string} type - Tipe game (Grammar, Vocabulary, Pronunciation, Noticing)
 * @returns {Array} Array of content objects
 */
function getGameContent(level, type) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Content_Bank");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    
    // Konversi array ke object
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    
    // Filter berdasarkan kriteria
    if (obj.Is_Active == "TRUE" || obj.Is_Active === true) {
      var levelMatch = !level || obj.Level == level || obj.Level == parseInt(level);
      var typeMatch = !type || obj.Game_Type == type;
      
      if (levelMatch && typeMatch) {
        result.push(obj);
      }
    }
  }
  
  // Acak urutan soal untuk variasi
  result = shuffleArray(result);
  
  return {
    success: true,
    count: result.length,
    data: result
  };
}

/**
 * getAllContent - Mengambil semua konten yang aktif
 */
function getAllContent() {
  return getGameContent(null, null);
}

/**
 * getNoticingContent - Khusus untuk mode Noticing Room
 * Mengambil konten dengan format khusus untuk Noticing Hypothesis
 */
function getNoticingContent(level) {
  var content = getGameContent(level, 'Noticing');
  
  // Transform data untuk Noticing Room
  if (content.data && content.data.length > 0) {
    content.data = content.data.map(function(item) {
      return {
        id: item.ID,
        level: item.Level,
        sentence: item.Prompt_Text,
        correctWord: item.Target_Keywords,
        errorWord: item.Correct_Audio_URL, // Field ini menyimpan kata yang salah
        feedbackRule: item.Feedback_Rules
      };
    });
  }
  
  return content;
}

// ============================================================
// 4. API: SAVE PROGRESS
// Menyimpan log aktivitas dan memperbarui XP
// ============================================================

/**
 * saveProgress - Menyimpan progress siswa dan memperbarui XP
 * 
 * @param {Object} data - Data progress yang akan disimpan
 * @returns {Object} Result object dengan success status
 */
function saveProgress(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Validasi data
    if (!data.studentId) {
      return { success: false, error: 'Student ID is required' };
    }
    
    // Generate ID dan timestamp
    var timestamp = new Date();
    var logId = "LOG-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    
    // Simpan ke Progress_Log
    var logSheet = ss.getSheetByName("Progress_Log");
    var logRow = [
      logId,
      timestamp,
      data.studentId,
      data.gameType || 'Unknown',
      data.promptId || '',
      data.rawSpeech || '',
      data.errorDetected || '',
      data.feedbackGiven || '',
      data.feedbackType || '',
      data.uptakeSuccess ? 'TRUE' : 'FALSE',
      data.score || 0,
      data.confidenceLevel || 0,
      data.attemptCount || 1
    ];
    
    logSheet.appendRow(logRow);
    
    // Update Student XP
    var xpEarned = data.score || 0;
    if (xpEarned > 0) {
      updateStudentXP(data.studentId, xpEarned, data.studentName, data.studentClass);
    }
    
    return {
      success: true,
      message: 'Progress saved successfully!',
      logId: logId,
      xpEarned: xpEarned,
      timestamp: timestamp.toISOString()
    };
    
  } catch (e) {
    return {
      success: false,
      error: e.toString()
    };
  }
}

/**
 * bulkSaveProgress - Menyimpan banyak data progress sekaligus
 */
function bulkSaveProgress(dataArray) {
  var results = [];
  
  if (!Array.isArray(dataArray)) {
    return { success: false, error: 'Data must be an array' };
  }
  
  for (var i = 0; i < dataArray.length; i++) {
    results.push(saveProgress(dataArray[i]));
  }
  
  return {
    success: true,
    processed: results.length,
    results: results
  };
}

/**
 * updateStudentXP - Memperbarui XP siswa
 */
function updateStudentXP(studentId, xpToAdd, studentName, studentClass) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentSheet = ss.getSheetByName("Students");
  var data = studentSheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == studentId) {
      var currentXP = parseInt(data[i][3]) || 0;
      studentSheet.getRange(i + 1, 4).setValue(currentXP + xpToAdd);
      return true;
    }
  }
  
  // Jika siswa belum ada, buat baru
  if (studentName) {
    studentSheet.appendRow([
      studentId, 
      studentName, 
      studentClass || 'Unknown', 
      xpToAdd, 
      new Date(), 
      '{}'
    ]);
    return true;
  }
  
  return false;
}

// ============================================================
// 5. API: STUDENT MANAGEMENT
// Manajemen profil siswa
// ============================================================

/**
 * getStudentProfile - Mengambil profil siswa berdasarkan ID
 */
function getStudentProfile(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == studentId) {
      return {
        success: true,
        student: {
          id: data[i][0],
          name: data[i][1],
          class: data[i][2],
          xp: parseInt(data[i][3]) || 0,
          createdAt: data[i][4],
          settings: data[i][5] ? JSON.parse(data[i][5]) : {}
        }
      };
    }
  }
  
  return {
    success: false,
    error: 'Student not found',
    studentId: studentId
  };
}

/**
 * createStudent - Membuat profil siswa baru
 */
function createStudent(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  
  // Cek apakah student ID sudah ada
  var existingStudent = getStudentProfile(data.studentId);
  if (existingStudent.success) {
    return {
      success: false,
      error: 'Student ID already exists',
      student: existingStudent.student
    };
  }
  
  // Buat siswa baru
  var newRow = [
    data.studentId,
    data.name || 'New Student',
    data.studentClass || 'Unknown',
    0, // Initial XP
    new Date(),
    JSON.stringify(data.settings || {})
  ];
  
  sheet.appendRow(newRow);
  
  return {
    success: true,
    message: 'Student created successfully',
    student: {
      id: data.studentId,
      name: data.name,
      class: data.studentClass,
      xp: 0,
      createdAt: new Date()
    }
  };
}

/**
 * updateStudentSettings - Memperbarui pengaturan siswa
 */
function updateStudentSettings(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  var studentData = sheet.getDataRange().getValues();
  
  for (var i = 1; i < studentData.length; i++) {
    if (studentData[i][0] == data.studentId) {
      var settings = {};
      try {
        settings = JSON.parse(studentData[i][5] || '{}');
      } catch (e) {
        settings = {};
      }
      
      // Merge settings
      for (var key in data.settings) {
        settings[key] = data.settings[key];
      }
      
      sheet.getRange(i + 1, 6).setValue(JSON.stringify(settings));
      
      return {
        success: true,
        message: 'Settings updated',
        settings: settings
      };
    }
  }
  
  return {
    success: false,
    error: 'Student not found'
  };
}

/**
 * getStudentProgress - Mengambil riwayat progress siswa
 */
function getStudentProgress(studentId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Progress_Log");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] == studentId) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j];
      }
      result.push(obj);
    }
  }
  
  return {
    success: true,
    studentId: studentId,
    count: result.length,
    progress: result
  };
}

/**
 * getLeaderboard - Mengambil leaderboard berdasarkan XP
 */
function getLeaderboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  var data = sheet.getDataRange().getValues();
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    result.push({
      rank: 0, // Will be set after sorting
      id: data[i][0],
      name: data[i][1],
      class: data[i][2],
      xp: parseInt(data[i][3]) || 0
    });
  }
  
  // Sort by XP descending
  result.sort(function(a, b) {
    return b.xp - a.xp;
  });
  
  // Set ranks
  for (var j = 0; j < result.length; j++) {
    result[j].rank = j + 1;
  }
  
  return {
    success: true,
    count: result.length,
    leaderboard: result
  };
}

// ============================================================
// 6. UTILITY FUNCTIONS
// Fungsi-fungsi pembantu
// ============================================================

/**
 * shuffleArray - Mengacak urutan array (Fisher-Yates algorithm)
 */
function shuffleArray(array) {
  var shuffled = array.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * testAPI - Fungsi untuk testing API
 */
function testAPI() {
  Logger.log("=== Testing SpeakCheck API ===");
  
  // Test getGameContent
  var content = getGameContent("1", "Grammar");
  Logger.log("Grammar Level 1: " + content.length + " items");
  
  // Test getStudentProfile
  var student = getStudentProfile("S001");
  Logger.log("Student S001: " + JSON.stringify(student));
  
  // Test saveProgress
  var saveResult = saveProgress({
    studentId: "S001",
    gameType: "Grammar",
    promptId: "G01",
    rawSpeech: "I went to school yesterday",
    errorDetected: "",
    feedbackGiven: "Great job!",
    feedbackType: "None",
    uptakeSuccess: true,
    score: 100,
    confidenceLevel: 0.92,
    attemptCount: 1
  });
  Logger.log("Save Result: " + JSON.stringify(saveResult));
  
  Logger.log("=== Test Complete ===");
}

/**
 * clearTestData - Membersihkan data test dari Progress_Log
 */
function clearTestData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Progress_Log");
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  return { success: true, message: 'Test data cleared' };
}