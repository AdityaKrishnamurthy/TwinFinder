'use server';
/**
 * @fileOverview Highlights similar features between two images using AI.
 *
 * - highlightSimilarImageFeatures - A function that handles the image comparison process.
 * - HighlightSimilarImageFeaturesInput - The input type for the highlightSimilarImageFeatures function.
 * - HighlightSimilarImageFeaturesOutput - The return type for the highlightSimilarImageFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightSimilarImageFeaturesInputSchema = z.object({
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
export type HighlightSimilarImageFeaturesInput = z.infer<typeof HighlightSimilarImageFeaturesInputSchema>;

const HighlightSimilarImageFeaturesOutputSchema = z.object({
  highlightedImage1DataUri: z
    .string()
    .describe("A data URI of the first image with similar features highlighted."),
  highlightedImage2DataUri: z
    .string()
    .describe("A data URI of the second image with similar features highlighted."),
  description: z.string().describe('A description of the similarities between the two images.'),
});
export type HighlightSimilarImageFeaturesOutput = z.infer<typeof HighlightSimilarImageFeaturesOutputSchema>;

export async function highlightSimilarImageFeatures(input: HighlightSimilarImageFeaturesInput): Promise<HighlightSimilarImageFeaturesOutput> {
  return highlightSimilarImageFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightSimilarImageFeaturesPrompt',
  input: {schema: HighlightSimilarImageFeaturesInputSchema},
  output: {schema: HighlightSimilarImageFeaturesOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI expert in computer vision. Your goal is to identify similar features between two images and highlight them.

You will receive two images as input. You MUST return two images with the similar features highlighted, and a text description of the similarities. The features to consider include shapes, textures, colors, and other visual elements.

The highlighted images MUST be returned as data URIs.

Image 1: {{media url=image1DataUri}}
Image 2: {{media url=image2DataUri}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
    responseModalities: ['TEXT', 'IMAGE'],
  }
});

const highlightSimilarImageFeaturesFlow = ai.defineFlow(
  {
    name: 'highlightSimilarImageFeaturesFlow',
    inputSchema: HighlightSimilarImageFeaturesInputSchema,
    outputSchema: HighlightSimilarImageFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
