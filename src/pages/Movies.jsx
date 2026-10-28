import { useEffect, useState } from "react";
import { Link } from "react-router";

const GENEROS = [
  { id: 10749, nome: "Romance" },
  { id: 28, nome: "Ação" },
  { id: 35, nome: "Comédia" },
  { id: 18, nome: "Drama" },
  { id: 12, nome: "Aventura" },
  { id: 27, nome: "Terror" },
];

const CATEGORIAS = [
  { id: "popular", nome: "Populares" },
  { id: "top_rated", nome: "Melhor avaliados" },
  { id: "now_playing", nome: "Em exibição" },
  { id: "upcoming", nome: "Em breve" },
];

// Faz um pedido à API do TMDB e devolve os dados
function pedir(caminho) {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  return fetch("https://api.themoviedb.org/3" + caminho, {
    headers: { Authorization: "Bearer " + token },
  }).then((resposta) => resposta.json());
}

// Vai buscar os atores e o realizador de um filme
async function juntarElenco(filme) {
  const creditos = await pedir("/movie/" + filme.id + "/credits?language=pt-PT");

  const atores = creditos.cast
    .slice(0, 3)
    .map((ator) => ator.name)
    .join(", ");

  const realizador = creditos.crew
    .filter((pessoa) => pessoa.job === "Director")
    .map((pessoa) => pessoa.name)
    .join(", ");

  return {
    ...filme,
    atores: atores || "Não disponível",
    realizador: realizador || "Não disponível",
  };
}

function Movies() {
  const [categoria, setCategoria] = useState("generos");
  const [grupos, setGrupos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarFilmes() {
      try {
        setCarregando(true);
        setErro(false);

        // Cada secção tem um nome, um endereço da API e um número de filmes
        let secoes;

        if (categoria === "generos") {
          secoes = GENEROS.map((genero) => ({
            nome: genero.nome,
            caminho:
              "/discover/movie?language=pt-PT&sort_by=popularity.desc&with_genres=" +
              genero.id,
            quantidade: 6,
          }));
        } else {
          const escolhida = CATEGORIAS.find((c) => c.id === categoria);

          secoes = [
            {
              nome: escolhida.nome,
              caminho: "/movie/" + categoria + "?language=pt-PT",
              quantidade: 12,
            },
          ];
        }

        const resultado = await Promise.all(
          secoes.map(async (secao) => {
            const dados = await pedir(secao.caminho);
            const lista = dados.results.slice(0, secao.quantidade);
            const filmes = await Promise.all(lista.map(juntarElenco));

            return { nome: secao.nome, filmes: filmes };
          })
        );

        setGrupos(resultado);
      } catch {
        setErro(true);
      }

      setCarregando(false);
    }

    carregarFilmes();
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
        <h2>Descobre filmes</h2>

        <div className="filmes-categorias">
          <button onClick={() => setCategoria("generos")}>Por género</button>

          {CATEGORIAS.map((opcao) => (
            <button key={opcao.id} onClick={() => setCategoria(opcao.id)}>
              {opcao.nome}
            </button>
          ))}
        </div>

        {carregando && <p>A carregar filmes e elenco…</p>}
        {erro && <p>Erro ao carregar os filmes.</p>}

        {!carregando &&
          !erro &&
          grupos.map((grupo) => (
            <section key={grupo.nome}>
              <h2>{grupo.nome}</h2>

              <div className="filmes-cartazes-grid">
                {grupo.filmes.map((filme) => (
                  <article key={filme.id} className="filme_card">
                    {filme.poster_path ? (
                      <img
                        src={"https://image.tmdb.org/t/p/w500" + filme.poster_path}
                        alt={"Poster de " + filme.title}
                      />
                    ) : (
                      <p>Sem poster disponível</p>
                    )}

                    <h3>{filme.title}</h3>

                    {categoria !== "generos" && (
                      <p>
                        Géneros:{" "}
                        {GENEROS.filter((g) => filme.genre_ids.includes(g.id))
                          .map((g) => g.nome)
                          .join(", ")}
                      </p>
                    )}

                    <p>
                      Data de estreia:{" "}
                      {filme.release_date
                        ? filme.release_date.split("-").reverse().join("/")
                        : "Não disponível"}
                    </p>

                    <p>
                      Cotação:{" "}
                      {filme.vote_count > 0
                        ? filme.vote_average.toFixed(1) + "/10"
                        : "Sem avaliações"}
                    </p>

                    <p>Atores principais: {filme.atores}</p>
                    <p>Realizador: {filme.realizador}</p>

                    <Link to={"/movie/" + filme.id}>Ver detalhes</Link>
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

export default Movies;