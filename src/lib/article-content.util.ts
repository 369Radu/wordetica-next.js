/** Remove a leading title echo from Quill/HTML body (matches page h1). */
export function stripDuplicateTitleFromContent(html: string, title: string): string {
  const normalizedTitle = title.trim();
  if (!normalizedTitle || !html?.trim()) {
    return html;
  }

  const escaped = normalizedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let output = html.trim();

  const leadingPatterns = [
    new RegExp(`^\\s*<h1[^>]*>\\s*${escaped}\\s*</h1>\\s*`, 'i'),
    new RegExp(`^\\s*<h2[^>]*>\\s*${escaped}\\s*</h2>\\s*`, 'i'),
    new RegExp(`^\\s*<p[^>]*>\\s*<strong>\\s*${escaped}\\s*</strong>\\s*</p>\\s*`, 'i'),
    new RegExp(`^\\s*<p[^>]*>\\s*${escaped}\\s*</p>\\s*`, 'i'),
  ];

  for (const pattern of leadingPatterns) {
    output = output.replace(pattern, '');
  }

  return output.trim();
}
