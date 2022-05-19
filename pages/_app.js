import "../styles/globals.css";
import "../styles/Home.module.css";
import Link from "next/link";
import Head from "next/head";

function _app({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">Home</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-pink-500">Sell NFT</a>
          </Link>
          <Link href="/my_nfts">
            <a className="mr-6 text-pink-500">My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-pink-500">Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default _app;
