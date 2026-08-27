import { useEffect, useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function buscarPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );

        const data = await response.json();

        const detalhes = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);

            return response.json();
          })
        );

        setPokemons(detalhes);
      } catch (error) {
        console.error("Erro ao buscar Pokémon:", error);
      }
    }

    buscarPokemons();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-10 text-center text-4xl font-bold">
          Pokémon Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {pokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-red-500"
            >
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default
                }
                alt={pokemon.name}
                className="mx-auto h-40 w-40 object-contain"
              />

              <h2 className="text-center text-xl font-bold capitalize">
                {pokemon.name}
              </h2>

              <div className="mt-3 flex justify-center gap-2">
                {pokemon.types.map((item) => (
                  <span
                    key={item.type.name}
                    className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold capitalize"
                  >
                    {item.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}

export default App;