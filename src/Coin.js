import React from "react";

const Coin = ({
  name,
  image,
  symbol,
  price,
  volume,
  priceChange,
  marketCap,
}) => {
  return (
    <div className="px-8 font-text">
      <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-white p-8 text-lg">
        <img src={image} alt="crypto" className="w-16" />
        <h1 className="uppercase">{name}</h1>
        <p className="uppercase">{symbol}</p>
        <p>Price: ₦{price?.toLocaleString()}</p>
        <p className="text-sm md:text-lg">
          24H Vol: {volume?.toLocaleString()}NGN
        </p>
        {priceChange < 0 ? (
          <p className="text-red-500">24H : {priceChange.toFixed(2)}%</p>
        ) : (
          <p className="text-green-500">24H : {priceChange.toFixed(2)}%</p>
        )}
        <p>Mkt Cap: {marketCap?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Coin;
