"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  generateImageSimilarityScore,
  GenerateImageSimilarityScoreOutput,
} from '@/ai/flows/generate-image-similarity-score';
import {
  highlightSimilarImageFeatures,
  HighlightSimilarImageFeaturesOutput,
} from '@/ai/flows/highlight-similar-image-features';
import { ImageUploader } from '@/components/image-uploader';
import { AppHeader } from '@/components/header';
import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import { ScoreDisplay } from '@/components/score-display';
import { Separator } from '@/components/ui/separator';

type AiResult = GenerateImageSimilarityScoreOutput &
  Partial<HighlightSimilarImageFeaturesOutput>;

export default function Home() {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleHighlightSimilarities = async () => {
    if (!image1 || !image2) {
      toast({
        title: 'Error',
        description: 'Please upload two images to compare.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAiResult(null);
    try {
      const scoreResult = await generateImageSimilarityScore({
        image1DataUri: image1,
        image2DataUri: image2,
      });
      setAiResult(scoreResult);

      const highlightResult = await highlightSimilarImageFeatures({
        image1DataUri: image1,
        image2DataUri: image2,
      });
      setImage1(highlightResult.highlightedImage1DataUri);
      setImage2(highlightResult.highlightedImage2DataUri);
      setAiResult((prev) => ({ ...prev!, ...highlightResult }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage1(null);
    setImage2(null);
    setAiResult(null);
  };

  const canCompare = useMemo(() => image1 && image2, [image1, image2]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <ImageUploader
            id="image1"
            image={image1}
            onImageChange={setImage1}
            title="First Image"
          />
          <ImageUploader
            id="image2"
            image={image2}
            onImageChange={setImage2}
            title="Second Image"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-8">
          <Button
            onClick={handleHighlightSimilarities}
            disabled={!canCompare || isLoading}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Highlight Similarities
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {(isLoading || aiResult) && (
          <Card className="w-full max-w-4xl mx-auto animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">
                Similarity Analysis Results
              </CardTitle>
              <CardDescription>
                Here's how the two images compare.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-8">
              {isLoading && !aiResult && (
                <div className="flex flex-col items-center gap-4 text-muted-foreground py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="font-semibold">Analyzing images...</p>
                </div>
              )}
              {aiResult && (
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="md:col-span-1 flex justify-center">
                    <ScoreDisplay score={aiResult.similarityScore * 100} />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-headline text-xl font-semibold text-foreground">
                        Feature Highlights
                      </h3>
                      <p className="text-muted-foreground">
                        {aiResult.featureHighlights}
                      </p>
                    </div>
                    {aiResult.description && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-headline text-xl font-semibold text-foreground">
                            AI Description
                          </h3>
                          <p className="text-muted-foreground">
                            {aiResult.description}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>Powered by AI. Built with Next.js, Genkit and TypeScript.</p>
      </footer>
    </div>
  );
}
