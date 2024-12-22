import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateVerilogCode = async (prompt, imageData = null) => {
  try {
    let model;
    let result;

    if (imageData) {
      model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const imageParts = [
        {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg"
          }
        },
        prompt
      ];
      result = await model.generateContent(imageParts);
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
    const [designCode, testbenchCode] = parseVerilogCode(response);
    return { designCode, testbenchCode };
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
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