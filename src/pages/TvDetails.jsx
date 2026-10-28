import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function TvDetails() {
  const { id } = useParams();

  const [serie, setSerie] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    const url =
      "https://api.themoviedb.org/3/tv/" +
      id +
      "?language=pt-PT&append_to_response=aggregate_credits";

    fetch(url, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro");
        }
        return resposta.json();
      })
      .then((dados) => setSerie(dados))
      .catch(() => setErro(true));
  }, [id]);

  return (
    <div className="movies_page">
      <header className="movies_header">
        <h1>IMTV</h1>

        <nav className="nav_buttons">
          <Link to="/movies">Filmes</Link>
          <Link to="/tv">Séries</Link>
        </nav>
      </header>

      <main className="movie_details">
        <Link to="/tv">← Voltar às séries</Link>

        {erro && <p>Erro ao carregar a série.</p>}
        {!serie && !erro && <p>A carregar...</p>}

        {serie && (
          <>
            <section className="movie_info">
              {serie.poster_path ? (
                <img
                  src={"https://image.tmdb.org/t/p/w500" + serie.poster_path}
                  alt={"Poster de " + serie.name}
                />
              ) : (
                <p>Sem poster disponível</p>
              )}

              <div>
                <h2>{serie.name}</h2>

                <p>
                  Géneros:{" "}
                  {serie.genres.map((genero) => genero.name).join(", ")}
                </p>

                <p>
                  Estreia da série:{" "}
                  {serie.first_air_date
                    ? serie.first_air_date.split("-").reverse().join("/")
                    : "Não disponível"}
                </p>

                <p>
                  Cotação:{" "}
                  {serie.vote_count > 0
                    ? serie.vote_average.toFixed(1) + "/10"
                    : "Sem avaliações"}
                </p>

                <p>Temporadas: {serie.number_of_seasons}</p>
                <p>Episódios: {serie.number_of_episodes}</p>

                <p>
                  Criadores:{" "}
                  {serie.created_by.map((pessoa) => pessoa.name).join(", ") ||
                    "Não disponível"}
                </p>

                <details>
                  <summary>Ver realizadores</summary>
                  <p>
                    {serie.aggregate_credits.crew
                      .filter((pessoa) =>
                        pessoa.jobs.some((t) => t.job === "Director")
                      )
                      .map((pessoa) => pessoa.name)
                      .join(", ") || "Não disponível"}
                  </p>
                </details>

                <h3>Resumo</h3>
                <p>{serie.overview || "Não existe resumo disponível em português."}</p>
              </div>
            </section>

            <section>
              <h2>Elenco</h2>

              <div className="cast_list">
                {serie.aggregate_credits.cast.slice(0, 12).map((ator) => (
                  <article key={ator.id} className="cast_card">
                    {ator.profile_path ? (
                      <img
                        src={"https://image.tmdb.org/t/p/w185" + ator.profile_path}
                        alt={ator.name}
                      />
                    ) : (
                      <p>Sem fotografia</p>
                    )}

                    <h3>{ator.name}</h3>
                    <p>
                      Personagem:{" "}
                      {ator.roles.map((papel) => papel.character).join(", ") ||
                        "Não disponível"}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2>Equipa técnica</h2>

              <details>
                <summary>Ver nomes e funções da equipa técnica</summary>

                <ul>
                  {serie.aggregate_credits.crew.map((pessoa) => (
                    <li key={pessoa.id}>
                      {pessoa.name} —{" "}
                      {pessoa.jobs.map((t) => t.job).join(", ")}
                    </li>
                  ))}
                </ul>
              </details>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Trabalho orientado pelo Docente Marco Rodrigues</p>
        <p>Discente Bárbara Godinho</p>
        <p>Dados e imagens: TMDB.</p>
      </footer>
    </div>
  );
}

export default TvDetails;