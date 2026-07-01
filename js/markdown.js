function renderMarkdown(text) {
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  const html = marked.parse(text);

  setTimeout(() => {
    document.querySelectorAll("pre").forEach((pre) => {
      if (!pre.querySelector(".copy-btn")) {
        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.innerText = "📋 Copy";

        btn.onclick = () => {
          const code = pre.querySelector("code");
          if (code) {
            navigator.clipboard.writeText(code.innerText);
            btn.innerText = "✅ Copied";
            setTimeout(() => {
              btn.innerText = "📋 Copy";
            }, 2000);
          }
        };

        pre.style.position = "relative";
        pre.appendChild(btn);
      }
    });

    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, 0);

  return html;
}