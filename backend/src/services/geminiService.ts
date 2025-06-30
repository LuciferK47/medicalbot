import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * @desc    Summarizes the given text using the Google Gemini API
 * @param   text The text to summarize
 * @returns The summarized text
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    // Use Gemini 2.5 Flash model for fast text summarization
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a prompt that instructs Gemini to summarize the medical record
    const prompt = `**Prompt for Medical Data Analysis Assistant:**

You are MediAI, an advanced medical assistant specialized in analyzing diverse medical data inputs. Your task is to accurately interpret and explain various medical documents and images submitted by the user. Respond clearly and precisely based on the type of data provided. Your response structure should follow the guidelines below:

**If the input is a Prescription:**

1. List clearly all medicines written in the prescription, including their dosages and frequency.
2. Provide concise recommendations regarding the purpose and effectiveness of each medication.
3. Clearly state any important precautions, side-effects, or interactions the patient should be aware of.

**If the input is a Medical Imaging Scan (e.g., X-ray, MRI, CT Scan):**

1. Clearly identify the type of imaging provided.
2. Analyze and explain visible findings in simple terms.
3. Highlight any abnormalities or notable observations.
4. Suggest the next steps or actions recommended based on your analysis.

**If the input is a Medical Report (e.g., blood test, biopsy report, pathology report):**

1. Summarize key findings and results clearly and understandably.
2. Highlight any critical values, abnormalities, or conditions mentioned.
3. Provide clear recommendations or follow-up actions the patient should consider.

---

**Few-shot Examples:**

**User Input:**
Prescription:

* Paracetamol 500 mg, thrice daily
* Amoxicillin 250 mg, twice daily for 7 days

**Assistant Response:**

* **Medicines:**

  1. Paracetamol 500 mg, three times daily: For pain relief and fever reduction.
  2. Amoxicillin 250 mg, twice daily for 7 days: Antibiotic for bacterial infection.
* **Recommendations:**

  * Complete the full antibiotic course to avoid resistance.
  * Paracetamol should be taken after food to avoid gastric irritation.
* **Precautions:**

  * Monitor for allergic reactions to Amoxicillin, such as rashes or swelling.
  * Avoid alcohol consumption during the course of medication.

---

**User Input:**
X-ray Image: Chest X-ray showing white shadows in lower left lung region.

**Assistant Response:**

* **Imaging Type:** Chest X-ray
* **Findings:** Presence of white shadows in the lower left lung area, possibly indicative of pneumonia or fluid accumulation.
* **Abnormalities:** Likely lung infection or fluid buildup (pleural effusion).
* **Next Steps:** Consultation with a pulmonologist recommended for detailed evaluation. Possible further tests like CT scan or sputum analysis may be required.

---

**Your turn:** Now, carefully analyze and respond to the medical data provided by the user, adhering strictly to the guidelines above.
${text}`;

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Return the generated text
    return response.text() || 'No summary available.';
  } catch (error) {
    console.error('Error summarizing text with Gemini:', error);
    throw new Error('Failed to summarize text');
  }
};

/**
 * @desc    Analyzes an image using the Google Gemini API
 * @param   imagePath The path to the image file
 * @param   prompt The prompt to use for analysis
 * @returns The analysis result
 */
export const analyzeImage = async (imagePath: string, prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const fileExtension = path.extname(imagePath).toLowerCase();
    let mimeType: string;

    switch (fileExtension) {
      case '.jpeg':
      case '.jpg':
        mimeType = 'image/jpeg';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      default:
        throw new Error(`Unsupported image type: ${fileExtension}`);
    }

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(fs.readFileSync(imagePath)).toString('base64'),
          mimeType,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error('Failed to analyze image');
  }
};