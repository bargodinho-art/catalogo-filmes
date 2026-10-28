import { useEffect, useState } from "react";
import { Link } from "react-router";

const GENEROS = [
  { id: 18, nome: "Drama" },
  { id: 10759, nome: "Ação e Aventura" },
  { id: 35, nome: "Comédia" },
  { id: 9648, nome: "Mistério" },
  { id: 80, nome: "Crime" },
  { id: 10765, nome: "Ficção Científica e Fantasia" },
];

const CATEGORIAS = [
  { id: "popular", nome: "Populares" },
  { id: "top_rated", nome: "Melhor avaliadas" },
  { id: "on_the_air", nome: "No ar" },
  { id: "airing_today", nome: "Em exibição hoje" },
];

// Faz um pedido à API do TMDB e devolve os dados
function pedir(caminho) {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  return fetch("https://api.themoviedb.org/3" + caminho, {
    headers: { Authorization: "Bearer " + token },
  }).then((resposta) => resposta.json());
}

// Vai buscar os atores e os realizadores de uma série
async function juntarElenco(serie) {
  const creditos = await pedir(
    "/tv/" + serie.id + "/aggregate_credits?language=pt-PT"
  );

  const atores = creditos.cast
    .slice(0, 3)
    .map((ator) => ator.name)
    .join(", ");

  const realizadores = creditos.crew
    .filter((pessoa) => pessoa.jobs.some((t) => t.job === "Director"))
    .slice(0, 3)
    .map((pessoa) => pessoa.name)
    .join(", ");

  return {
    ...serie,
    atores: atores || "Não disponível",
    realizadores: realizadores || "Não disponível",
  };
}

function Tv() {
  const [categoria, setCategoria] = useState("generos");
  const [grupos, setGrupos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarSeries() {
      try {
        setCarregando(true);
        setErro(false);

        // Cada secção tem um nome, um endereço da API e um número de séries
        let secoes;

        if (categoria === "generos") {
          secoes = GENEROS.map((genero) => ({
            nome: genero.nome,
            caminho:
              "/discover/tv?language=pt-PT&sort_by=popularity.desc&with_genres=" +
              genero.id,
            quantidade: 6,
          }));
        } else {
          const escolhida = CATEGORIAS.find((c) => c.id === categoria);

          secoes = [
            {
              nome: escolhida.nome,
              caminho: "/tv/" + categoria + "?language=pt-PT",
              quantidade: 12,
            },
          ];
        }

        const resultado = await Promise.all(
          secoes.map(async (secao) => {
            const dados = await pedir(secao.caminho);
            const lista = dados.results.slice(0, secao.quantidade);
            const series = await Promise.all(lista.map(juntarElenco));

            return { nome: secao.nome, series: series };
          })
        );

        setGrupos(resultado);
      } catch {
        setErro(true);
      }

      setCarregando(false);
    }

    carregarSeries();
  }, [categoria]);

  return (
    <div className="movies_page">
      <header className="movies_header">
        <h1>IMTV</h1>

        <nav className="nav_buttons">
          <Link to="/movies">Filmes</Link>
          <Link to="/tv">Séries</Link>
        </nav>
      </header>

      <main className="movies_main">
        <h2>Descobre séries</h2>

        <div className="series-categorias">
          <button onClick={() => setCategoria("generos")}>Por género</button>

          {CATEGORIAS.map((opcao) => (
            <button key={opcao.id} onClick={() => setCategoria(opcao.id)}>
              {opcao.nome}
            </button>
          ))}
        </div>

        {carregando && <p>A carregar séries e elenco…</p>}
        {erro && <p>Erro ao carregar as séries.</p>}

        {!carregando &&
          !erro &&
          grupos.map((grupo) => (
            <section key={grupo.nome}>
              <h2>{grupo.nome}</h2>

              <div className="series-cartazes-grid">
                {grupo.series.map((serie) => (
                  <article key={serie.id} className="filme_card">
                    {serie.poster_path ? (
                      <img
                        src={"https://image.tmdb.org/t/p/w500" + serie.poster_path}
                        alt={"Poster de " + serie.name}
                      />
                    ) : (
                      <p>Sem poster disponível</p>
                    )}

                    <h3>{serie.name}</h3>

                    {categoria !== "generos" && (
                      <p>
                        Géneros:{" "}
                        {GENEROS.filter((g) => serie.genre_ids.includes(g.id))
                          .map((g) => g.nome)
                          .join(", ")}
                      </p>
                    )}

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

                    <p>Atores principais: {serie.atores}</p>
                    <p>Realizadores: {serie.realizadores}</p>

                    <Link to={"/tv/" + serie.id}>Ver detalhes</Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
      </main>

      <footer className="footer">
        <p>Trabalho orientado pelo Docente Marco Rodrigues</p>
        <p>Discente Bárbara Godinho</p>
        <p>Dados e imagens: TMDB.</p>
      </footer>
    </div>
  );
}

export default Tv;