import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import { myNftList as nftList } from "../utilities/nftList.json";

import { marketplaceAddress } from "../config";

// const nftList = [
//   {
//     image:
//       "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg",
//     name: "Mona Lisa",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper, these digital assets are selling like 17th-century exotic Dutch tulips—some for millions of dollars.",
//     price: "7.99",
//   },
// ];

// import NFTMarketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function My_nfts() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();

  // useEffect(() => {
  //   loadNFTs();
  // }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    console.log(marketplaceContract, "contractmarket");
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  function listNFT(nft) {
    console.log("hello");
    console.log("nft:", nft);
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === "loaded" && !nftList.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nftList.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img
                alt="nft"
                height="250px"
                src={nft.image}
                style={{
                  height: "200px",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
