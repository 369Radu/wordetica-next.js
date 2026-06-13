export interface CharCounts {
  withSpaces: number;
  withoutSpaces: number;
}

export function countChars(value: string | null | undefined, stripHtml = false): CharCounts {
  let text = (value ?? '').toString();
  if (stripHtml) {
    text = text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .trim();
  }
  return {
    withSpaces: text.length,
    withoutSpaces: text.replace(/\s/g, '').length,
  };
}
