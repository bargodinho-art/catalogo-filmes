 import { Link } from "react-router";

 function MovieCard({ titulo, classificacao, data, poster, destino }) {
  return (
    <article className="movie_card">
      <Link to={destino}>
        {poster ? (
          <img
            src={"https://image.tmdb.org/t/p/w500" + poster}
            alt={"Poster de " + titulo}
          />
        ) : (
          <p>Sem poster disponível</p>
        )}

        <h3>{titulo}</h3>
        <p>Classificação: {classificacao}/10</p>
        <p>Data de estreia: {data ? data : "Não disponível"}</p>
      </Link>
    </article>
  );
}

export default MovieCard;