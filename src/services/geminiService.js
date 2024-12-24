import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateVerilogCode = async (prompt, imageData = null) => {
  try {
    let model;
    let result;

    if (imageData) {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const image = {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      };
      const imagePrompt = `${prompt}
        Please analyze this circuit diagram and identify which circuit is, then generate Verilog code for it.
        Format your response exactly as follows:
        ---DESIGN---
        [Place the design module code here]
        ---TESTBENCH---
        [Place the testbench module code here]`;
      
      result = await model.generateContent([imagePrompt, image]);
    } else {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
      result = await model.generateContent(`
        Generate Verilog code with the following requirements:
        1. Create a design module for: ${prompt}
        2. Create a corresponding testbench module
        Dont write it as markdown.
        Return the response in the following format:
        ---DESIGN---
        [design code here]
        ---TESTBENCH---
        [testbench code here]
      `);
    }

    const response = result.response.text();
    const [designCode, testbenchCode] = response.includes('---DESIGN---') 
      ? parseVerilogCode(response)
      : parseUnformattedResponse(response);
    
    return { designCode, testbenchCode };
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
};

const parseUnformattedResponse = (response) => {
  let cleanResponse = response.replace(/```verilog|```/g, '');
  
  const testbenchKeywords = /\b(testbench|test bench|tb_|_tb)\b/i;
  const lines = cleanResponse.split('\n');
  
  let designCode = [];
  let testbenchCode = [];
  let isTestbench = false;

  for (const line of lines) {
    if (!isTestbench && testbenchKeywords.test(line)) {
      isTestbench = true;
    }
    
    if (isTestbench) {
      testbenchCode.push(line);
    } else {
      designCode.push(line);
    }
  }

  if (testbenchCode.length === 0) {
    return [cleanResponse.trim(), ''];
  }

  return [
    designCode.join('\n').trim(),
    testbenchCode.join('\n').trim()
  ];
};

const parseVerilogCode = (response) => {
  let cleanResponse = response.replace(/```verilog|```/g, '');
  
  const designMatch = cleanResponse.match(/---DESIGN---([\s\S]*?)(?=---TESTBENCH---|$)/);
  const testbenchMatch = cleanResponse.match(/---TESTBENCH---([\s\S]*?)$/);
  
  return [
    designMatch ? designMatch[1].trim() : '',
    testbenchMatch ? testbenchMatch[1].trim() : ''
  ];
};