export const formatTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          onClick={(e) => {
            e.preventDefault();
            window.open(part, '_blank', 'noopener,noreferrer');
          }}
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};
