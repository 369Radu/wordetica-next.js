import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "a", "b", "blockquote", "br", "code", "div", "em", "h1", "h2", "h3", "h4",
  "h5", "h6", "hr", "i", "img", "li", "ol", "p", "pre", "s", "small", "span",
  "strong", "sub", "sup", "u", "ul",
];

const ALLOWED_ATTRIBUTES = {
  "*": ["class", "style"],
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
};

const ALLOWED_STYLES = {
  "*": {
    color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i, /^hsl\(/i],
    "background-color": [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/i, /^hsl\(/i],
    "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
    "text-decoration": [/^none$/, /^underline$/, /^line-through$/],
    "font-weight": [/^normal$/, /^bold$/, /^\d+$/],
    "font-style": [/^normal$/, /^italic$/],
    "font-size": [/^\d+(?:px|em|rem|%)$/],
    "line-height": [/^\d+(?:px|em|rem|%)?$/],
    margin: [/^\d+(?:px|em|rem|%)?(?:\s+\d+(?:px|em|rem|%)?){0,3}$/],
    "margin-left": [/^\d+(?:px|em|rem|%)?$/],
    "margin-right": [/^\d+(?:px|em|rem|%)?$/],
    "padding-left": [/^\d+(?:px|em|rem|%)?$/],
  },
};

/** Sanitize Quill HTML before persisting (mirrors Django bleach rules). */
export function sanitizeArticleHtml(raw) {
  return sanitizeHtml(raw || "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedStyles: ALLOWED_STYLES,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
  });
}
