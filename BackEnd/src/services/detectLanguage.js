function detectLanguage(code) {
    if (code.includes("console.log")) return "javascript";
    if (code.includes("cout <<")) return "cpp";
    if (code.includes("System.out.println")) return "java";
    if (code.includes("print(")) return "python";
    return "plaintext"; 
  }
  
  module.exports = detectLanguage;
  