import { useEffect, useRef, useState } from 'react';
import NoticiaCard from './components/NoticiaCard/NoticiaCard';

const TEMAS_RAPIDOS = [
  { etiqueta: 'Mars', valor: 'Mars' },
  { etiqueta: 'Artemis', valor: 'Artemis' },
  { etiqueta: 'SpaceX', valor: 'SpaceX' },
  { etiqueta: 'Sin resultados', valor: 'zzzz' },
];

function App() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [termino, setTermino] = useState('');
  const inputRef = useRef(null);

  function buscar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget ?? evento.target;
    const texto = formulario.elements.q.value.trim();
    setTermino(texto);
  }

  function seleccionarTema(valor) {
    if (inputRef.current) {
      inputRef.current.value = valor;
    }
    setTermino(valor);
  }

  useEffect(() => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const controlador = new AbortController();

    async function obtenerNoticias() {
      try {
        setCargando(true);
        setError(null);
        setNoticias([]);

        if (!VITE_API_URL) {
          throw new Error('Falta configurar VITE_API_URL en el archivo .env');
        }

        const params = new URLSearchParams({ limit: '12' });
        if (termino) {
          params.set('search', termino);
        }

        const respuesta = await fetch(
          `${VITE_API_URL}/articles/?${params.toString()}`,
          {
            signal: controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        setNoticias(datos.results ?? []);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'No se pudieron cargar las noticias.');
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    obtenerNoticias();

    return () => {
      controlador.abort();
    };
  }, [termino]);

  return (
    <>
      <header className="contenedor cabecera">
        <span className="cabecera__marca">Bitácora Espacial</span>
        <nav aria-label="Principal">
          <ul>
            <li>
              <a href="#noticias">Noticias</a>
            </li>
            <li>
              <a href="#blogs">Blogs</a>
            </li>
            <li>
              <a href="#acerca">Acerca</a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="contenedor">
        <h1>Explora las noticias del espacio</h1>
        <p className="intro">
          Misiones, descubrimientos y próximos destinos. Encuentra un tema y
          sigue explorando.
        </p>

        <form className="buscador" onSubmit={buscar}>
          <label htmlFor="busqueda">Buscar por tema</label>
          <div className="buscador__fila">
            <input
              ref={inputRef}
              id="busqueda"
              name="q"
              type="search"
              placeholder="Ej.: Mars, Artemis, SpaceX"
            />
            <button type="submit">Buscar</button>
          </div>
        </form>

        <div className="filtros-rapidos" aria-label="Búsquedas sugeridas">
          <span>Prueba la búsqueda:</span>
          {TEMAS_RAPIDOS.map((tema) => (
            <button
              key={tema.etiqueta}
              type="button"
              aria-pressed={termino === tema.valor}
              onClick={() => seleccionarTema(tema.valor)}
            >
              {tema.etiqueta}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={termino === ''}
            onClick={() => seleccionarTema('')}
          >
            Ver todas
          </button>
        </div>

        <section id="noticias" aria-labelledby="ultimas-noticias">
          <div className="seccion-cabecera">
            <h2 id="ultimas-noticias">
              {termino ? `Resultados para "${termino}"` : 'Últimas noticias'}
            </h2>
            {!cargando && !error && (
              <p className="seccion-contador">
                {noticias.length}{' '}
                {noticias.length === 1 ? 'noticia' : 'noticias'}
              </p>
            )}
          </div>

          {cargando && (
            <p className="estado-mensaje" role="status">
              Cargando noticias...
            </p>
          )}
          {error && (
            <p className="estado-mensaje estado-mensaje--error" role="alert">
              Error al cargar noticias: {error}
            </p>
          )}
          {!cargando && !error && noticias.length === 0 && (
            <p className="estado-mensaje" role="status">
              No hay noticias para "{termino}".
            </p>
          )}

          <div className="grid-noticias">
            {noticias.map((noticia) => (
              <NoticiaCard
                key={noticia.id}
                titulo={noticia.title}
                resumen={noticia.summary}
                imagen={noticia.image_url}
                fuente={noticia.news_site}
                fecha={noticia.published_at}
                enlace={noticia.url}
              />
            ))}
          </div>
        </section>
      </main>

      <footer id="acerca" className="contenedor pie">
        <p>Datos obtenidos de Spaceflight News API</p>
      </footer>
    </>
  );
}

export default App;
