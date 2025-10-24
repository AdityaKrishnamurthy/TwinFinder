'use server';

/**
 * @fileOverview Generates a similarity score between two images using AI.
 *
 * - generateImageSimilarityScore - A function that generates the similarity score.
 * - GenerateImageSimilarityScoreInput - The input type for the generateImageSimilarityScore function.
 * - GenerateImageSimilarityScoreOutput - The return type for the generateImageSimilarityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageSimilarityScoreInputSchema = z.object({
  image1DataUri: z
    .string()
    .describe(
      "The first image to compare, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second image to compare, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageSimilarityScoreInput = z.infer<typeof GenerateImageSimilarityScoreInputSchema>;

const GenerateImageSimilarityScoreOutputSchema = z.object({
  similarityScore: z
    .number()
    .describe('The similarity score between the two images, from 0 to 1.'),
  featureHighlights: z
    .string()
    .describe('The description of similar features between the images.'),
});
export type GenerateImageSimilarityScoreOutput = z.infer<typeof GenerateImageSimilarityScoreOutputSchema>;

export async function generateImageSimilarityScore(
  input: GenerateImageSimilarityScoreInput
): Promise<GenerateImageSimilarityScoreOutput> {
  return generateImageSimilarityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageSimilarityScorePrompt',
  input: {schema: GenerateImageSimilarityScoreInputSchema},
  output: {schema: GenerateImageSimilarityScoreOutputSchema},
  prompt: `You are an AI that compares two images and determines a similarity score between 0 and 1, where 0 means not similar, and 1 means identical.

You also detect and highlight similar features between the images; consider shapes, textures, colors, etc.

Image 1: {{media url=image1DataUri}}
Image 2: {{media url=image2DataUri}}

Similarity Score: 
Feature Highlights:`, // Explicitly ask for the format of output.
});

const generateImageSimilarityScoreFlow = ai.defineFlow(
  {
    name: 'generateImageSimilarityScoreFlow',
    inputSchema: GenerateImageSimilarityScoreInputSchema,
    outputSchema: GenerateImageSimilarityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
