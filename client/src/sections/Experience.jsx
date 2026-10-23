import Reveal from '../components/Reveal';
export default function Experience({ profile }) {
  const journey = profile?.journey || [];
  return (
    <section id="experience" className="section">
      <Reveal><p className="eyebrow">LEARNING JOURNEY</p><h2 className="section-title">The orbit so far.</h2></Reveal>
      {journey.length === 0
        ? <p className="muted">Learning journey information has not been added yet.</p>
        : <ol className="timeline">
            {journey.map((step, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <li className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-period">{step.period}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>}
    </section>
  );
}
