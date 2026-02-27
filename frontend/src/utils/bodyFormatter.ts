
import formatXml from 'xml-formatter';
import yaml from 'js-yaml';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css'; // Import github style for syntax highlighting
import hljsxml from 'highlight.js/lib/languages/xml' 
import hljsjson from 'highlight.js/lib/languages/json' 
import hljsyaml from 'highlight.js/lib/languages/yaml' 

hljs.registerLanguage('xml', hljsxml);
hljs.registerLanguage('json', hljsjson);
hljs.registerLanguage('yaml', hljsyaml);

export function formatBody(raw: string | null): { text: string; html: string, lang: string } {
  if (!raw) return { text: "<no body>", html: "<no body>", lang: "text" }

  const trimmed = raw.trim()

  try {
    const parsed = JSON.stringify(JSON.parse(trimmed), null, 2);
    return { text: parsed, html: hljs.highlight(parsed, { language: "json" }).value, lang: "json" }
  } catch (_) {}

  if (/^<\?xml|<[\w]+[\s\S]*>/.test(trimmed)) {
    try {
        new DOMParser().parseFromString(trimmed, "application/xml");
        const parsed = formatXml(trimmed, { indentation: '  ', collapseContent: true });
        return { text: parsed, html: hljs.highlight(parsed, { language: "xml" }).value, lang: "xml" };
    } catch (_) {}
  }

  try {
      const yamlObj = yaml.dump(yaml.load(trimmed), { indent: 2 });
      return { text: yamlObj, html: hljs.highlight(yamlObj, { language: "yaml" }).value, lang: "yaml" };
  } catch (_) {}

  return { text: trimmed, html: trimmed, lang: "text" }
}
