import React, { useState, useEffect } from "react";
import Axios from "axios";
import Coin from "./Coin";

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=ngn&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    )
      .then((res) => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch((error) => alert(`Yo Error - ${error}`));
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLocaleLowerCase())
  );
  return (
    <>
      <div className="bg-body text-white min-h-screen">
        <h1 className="text-3xl md:text-8xl font-heading text-center py-4">
          COINS TRACKER
        </h1>
        <article className="mb-12">
          <h2 className="font-heading text-center py-8 text-2xl md:text-5xl">
            Search Cyptocurrency
          </h2>
          <form className="flex flex-col justify-center items-center">
            <input
              onChange={handleChange}
              placeholder="Search ....."
              className="w-auto md:w-fit h-8 text-2xl font-text text-center text-black border-none rounded-sm"
            />
          </form>
        </article>

        {filteredCoins.map((coin) => {
          return (
            <Coin
              key={coin.id}
              name={coin.name}
              image={coin.image}
              symbol={coin.symbol}
              volume={coin.total_volume}
              price={coin.current_price}
              priceChange={coin.market_cap_change_percentage_24h}
              marketCap={coin.market_cap}
            />
          );
        })}

        <footer className="mt-8 text-3xl text-center font-heading">
          <p>Built By Lekan Dar</p>
        </footer>
      </div>
    </>
  );
}

export default App;
