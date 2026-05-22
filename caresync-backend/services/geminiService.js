import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const getClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }

    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getModel = () => {
    const client = getClient();
    return client.getGenerativeModel({ model: DEFAULT_MODEL });
};

export const generateSpecialistRecommendation = async ({ symptoms, age, gender }) => {
    const model = getModel();

    const prompt = `
You are a healthcare triage assistant.
Given the symptoms and demographics below, recommend the most relevant specialist.
Respond strictly as JSON with keys:
- predictedSpecialist (string)
- rationale (string)
- urgency (one of: low, medium, high)
- nextStep (short action guidance)

Symptoms: ${symptoms}
Age: ${age ?? 'unknown'}
Gender: ${gender ?? 'unknown'}
`;

    const response = await model.generateContent(prompt);
    return response.response.text();
};

export const generateLabSummary = async ({ reportText }) => {
    const model = getModel();

    const prompt = `
You are a medical report explainer for patients.
Summarize the following lab report text in simple language.
Return strictly as JSON with keys:
- plainSummary (string)
- keyFindings (array of strings)
- cautionFlags (array of strings)
- suggestedFollowUp (string)

Lab report text:
${reportText}
`;

    const response = await model.generateContent(prompt);
    return response.response.text();
};

export const generatePrescriptionExplanation = async ({ prescriptionText }) => {
    const model = getModel();

    const prompt = `
You are a medical prescription assistant.
Analyze the following prescription text and provide a patient-friendly summary.
Return strictly as JSON with keys:
- plainSummary (string - overall simple explanation of the prescription)
- dosageInstructions (array of strings - dosage instructions and timing for each medication)
- cautionFlags (array of strings - side effects, food interactions, or warnings)
- suggestedFollowUp (string - follow-up guidelines or when to consult the doctor again)

Prescription text:
${prescriptionText}
`;

    const response = await model.generateContent(prompt);
    return response.response.text();
};

