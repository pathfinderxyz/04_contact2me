import { useState } from "react";

const REPLIES = [
  "Puedes crear una campaña de video o de audiencia desde Campañas.",
  "Los contactos nuevos quedan en Leads, con estado Nuevo.",
  "En Datos guardas WhatsApp, redes y el texto de tus páginas.",
];

export default function Chat() {
  const [messages, setMessages] = useState([
    { from: "ia", text: "Soy el asistente del panel. Pregúntame por campañas, leads o datos." },
  ]);
  const [text, setText] = useState("");

  const send = (event) => {
    event.preventDefault();
    const question = text.trim();
    if (!question) return;
    const answer = REPLIES[messages.length % REPLIES.length];
    setMessages((prev) => [...prev, { from: "me", text: question }, { from: "ia", text: answer }]);
    setText("");
  };

  return (
    <div className="page narrow chat-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Asistente del panel</p>
          <h1>Chat IA</h1>
        </div>
      </header>
      <section className="panel chat-log">
        {messages.map((message, index) => (
          <p key={index} className={message.from === "me" ? "bubble mine" : "bubble"}>
            {message.text}
          </p>
        ))}
      </section>
      <form className="chat-form" onSubmit={send}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe una pregunta"
        />
        <button className="btn primary" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
