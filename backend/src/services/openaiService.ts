import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @desc    Summarizes the given text using the OpenAI API
 * @param   text The text to summarize
 * @returns The summarized text
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes medical records.',
        },
        {
          role: 'user',
          content: `Please summarize the following medical record:\n\n${text}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || 'No summary available.';
  } catch (error) {
    console.error('Error summarizing text with OpenAI:', error);
    throw new Error('Failed to summarize text');
  }
};