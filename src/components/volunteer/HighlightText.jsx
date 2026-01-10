/**
 * Component to highlight search terms in text
 */
export default function HighlightText({ text, search }) {
  if (!search || !text) return <>{text}</>;

  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(searchLower);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-brand-gold/30 text-inherit rounded px-0.5">
        {text.slice(index, index + search.length)}
      </mark>
      {text.slice(index + search.length)}
    </>
  );
}
