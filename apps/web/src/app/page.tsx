const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export default function Home() {
  return (
    <main className="app-shell">
      <section className="status-panel" aria-labelledby="page-title">
        <p className="status-kicker">Ambiente local</p>
        <h1 id="page-title">Waypoint</h1>
        <p>
          Web Next.js ativa em desenvolvimento. A API NestJS fica disponível em
          {` ${apiUrl}`}.
        </p>
        <div className="status-actions">
          <a href={`${apiUrl}/health`}>Ver health da API</a>
        </div>
      </section>
    </main>
  );
}
