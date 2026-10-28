 import { useEffect, useState } from "react";
 import { Link, useParams } from "react-router";

 function MovieDetails() {
  const { id } = useParams();

  const [filme, setFilme] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const token = import.meta.env.VITE_TMDB_TOKEN;
    const url =
      "https://api.themoviedb.org/3/movie/" +
      id +
      "?language=pt-PT&append_to_response=credits";

     fetch(url, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((resposta) => resposta.json())
      .then((dados) => setFilme(dados))
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
        <Link to="/movies">← Voltar aos filmes</Link>

        {erro && <p>Erro ao carregar o filme.</p>}
        {!filme && !erro && <p>A carregar...</p>}

        {filme && (
          <>
            <section className="movie_info">
              <img
                src={"https://image.tmdb.org/t/p/w500" + filme.poster_path}
                alt={"Poster de " + filme.title}
              />

              <div>
                <h2>{filme.title}</h2>
                <p>Data de estreia: {filme.release_date}</p>
                <p>Cotação: {filme.vote_average}/10</p>
                <p>Duração: {filme.runtime} minutos</p>

                <h3>Resumo</h3>
                <p>{filme.overview}</p>
              </div>
            </section>

            <section>
              <h2>Elenco</h2>

              <div className="cast_list">
                {filme.credits.cast.slice(0, 12).map((ator) => (
                  <article key={ator.credit_id} className="cast_card">
                    <h3>{ator.name}</h3>
                    <p>Personagem: {ator.character}</p>
                  </article>
                ))}
              </div>
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

export default MovieDetails