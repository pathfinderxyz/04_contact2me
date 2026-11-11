import { Back } from "../shell";

const COURSES = [
  {
    title: "Tu tarjeta en un día",
    lessons: "4 lecciones",
    text: "Titular, WhatsApp y el primer enlace que puedes compartir.",
  },
  {
    title: "Campañas que sí se abren",
    lessons: "6 lecciones",
    text: "Cuándo usar video y cuándo una invitación directa.",
  },
  {
    title: "Seguimiento de leads",
    lessons: "3 lecciones",
    text: "Del primer mensaje al cierre, sin perder a nadie en el chat.",
  },
];

export default function Academy() {
  return (
    <div className="page">
      <Back to="/app/mas" label="Más" />
      <header className="page-head">
        <div>
          <p className="eyebrow">Aprende a usar la plataforma</p>
          <h1>Academia</h1>
        </div>
      </header>
      <div className="card-grid">
        {COURSES.map((course) => (
          <article key={course.title} className="campaign-card static">
            <span className="badge video">{course.lessons}</span>
            <h2>{course.title}</h2>
            <p>{course.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
