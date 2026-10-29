export default function GlitchText({ text, className }) {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <span className="glitch-text" data-text={text}>{text}</span>
    </div>
  );
}