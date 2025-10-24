import { Aperture } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-4">
        <Aperture className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground">
          TwinFinder
        </h1>
      </div>
      <p className="mt-4 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload two images and let our AI discover the similarities, from subtle
        textures to overarching themes.
      </p>
    </header>
  );
}
