function renderMarkdown(text) {
  if (typeof marked !== "undefined") {
    return marked.parse(text);
  }

  return text;
}