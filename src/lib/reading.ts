/** Reading time, based on roughly 220 words per minute. */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;

  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|-]/g, ' ')
    .trim();

  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** "4 min read" */
export const readingLabel = (body: string | undefined) => `${readingMinutes(body)} min read`;
