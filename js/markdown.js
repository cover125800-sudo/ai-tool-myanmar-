function renderMarkdown(text) {
  if (typeof marked === "undefined") {
    return text;
  }

  const html = marked.parse(text);

  setTimeout(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, 0);

  return html;
}