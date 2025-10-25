# Code Architecture

The project is structured to separate the user interface, AI logic, and component design, making it organized and scalable.

### 1. Main User Interface (`src/app/page.tsx`)

This is the primary component that the user interacts with.

-   **Component Role**: It's a React Client Component (`"use client"`) that manages the application's state and orchestrates the user workflow.
-   **State Management**: It uses `useState` hooks to manage:
    -   `image1` & `image2`: The user-uploaded images, stored as Base64 data URIs.
    -   `aiResult`: The data returned from the AI, including the similarity score and highlighted images.
    -   `isLoading`: A boolean to control the visibility of loading spinners during AI processing.
-   **Core Logic (`handleHighlightSimilarities`)**:
    1.  This function is called when the "Highlight Similarities" button is clicked.
    2.  It first calls `generateImageSimilarityScore`, an AI flow that returns a numerical score and a text description.
    3.  It then calls `highlightSimilarImageFeatures`, a second AI flow that returns new versions of the images with highlights added.
    4.  The results from both flows are combined and stored in the `aiResult` state, which triggers the UI to update and display the analysis.

### 2. AI Logic with Genkit (`src/ai/flows/`)

This directory contains the "flows," which are server-side functions that orchestrate calls to the AI models.

-   **`generate-image-similarity-score.ts`**:
    -   **Purpose**: To compare two images and produce a similarity score.
    -   **Input**: Two image data URIs.
    -   **Output**: A JSON object containing `similarityScore` (a number from 0 to 1) and `featureHighlights` (a string description).
    -   **How it works**: It defines a prompt for the Gemini model, providing it with the two images and instructing it to return a score and description in the specified JSON format.

-   **`highlight-similar-image-features.ts`**:
    -   **Purpose**: To take two images and return versions with similar features visually highlighted.
    -   **Input**: Two image data URIs.
    -   **Output**: A JSON object with `highlightedImage1DataUri` and `highlightedImage2DataUri`, which are the new, modified images, along with a text `description`.
    -   **How it works**: This flow uses a vision-capable Gemini model. The prompt instructs the model to act as a computer vision expert, identify similarities, and return new images with those features marked.

-   **`src/ai/genkit.ts`**: This file initializes Genkit and configures the default AI model (`googleai/gemini-2.5-flash`) used by the flows.

### 3. Reusable UI Components (`src/components/`)

This directory contains the building blocks of the UI.

-   **`header.tsx`**: A simple component that displays the application's title ("TwinFinder") and a brief description.
-   **`image-uploader.tsx`**: A key component that handles the logic for uploading an image. It supports both clicking to open a file dialog and dragging and dropping a file. It displays the uploaded image or the upload prompt.
-   **`score-display.tsx`**: A specialized component for visualizing the similarity score. It shows a circular progress bar and displays the score as `0` if below 30% and `1` if above 60%, while also showing the precise percentage match below.
-   **`ui/`**: This subdirectory contains the ShadCN UI components (e.g., `Button.tsx`, `Card.tsx`). These are general-purpose components that have been styled according to the project's theme.

### 4. Styling and Configuration

-   **`src/app/globals.css`**: Defines the global CSS styles and color variables for the application's theme (e.g., primary, background, accent colors) using HSL values.
-   **`tailwind.config.ts`**: Configures Tailwind CSS, including extending the theme with custom fonts (`Inter`, `Space Grotesk`) and color variables defined in `globals.css`.
-   **`package.json`**: Lists all project dependencies (like React, Next.js, Genkit, and ShadCN components) and defines the scripts for running, building, and developing the application.
