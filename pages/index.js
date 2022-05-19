/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { dashboardList as nftList } from "../utilities/nftList.json";

import { marketplaceAddress } from "../config";
import Link from "next/link";

// const nftList = [
//   {
//     image:
//       "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg",
//     name: "Mona Lisa",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper, these digital assets are selling like 17th-century exotic Dutch tulips—some for millions of dollars.",
//     price: "7.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492408?width=700&size=0.6666666666666666&pixel_ratio=1.5",
//     name: "The Mascot Doodle",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "14.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492407?width=700&size=1.5&pixel_ratio=1.5",
//     name: "5000 Days",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "199.99 ",
//   },
//   {
//     image:
//       "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg",
//     name: "Mona Lisa",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper, these digital assets are selling like 17th-century exotic Dutch tulips—some for millions of dollars.",
//     price: "7.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492408?width=700&size=0.6666666666666666&pixel_ratio=1.5",
//     name: "The Mascot Doodle",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "14.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492407?width=700&size=1.5&pixel_ratio=1.5",
//     name: "5000 Days",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "199.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492408?width=700&size=0.6666666666666666&pixel_ratio=1.5",
//     name: "The Mascot Doodle",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "14.99 ",
//   },
//   {
//     image:
//       "https://images.barrons.com/im-492407?width=700&size=1.5&pixel_ratio=1.5",
//     name: "5000 Days",
//     description:
//       "Non-fungible tokens (NFTs) seem to have exploded out of the ether this year. From art and music to tacos and toilet paper.",
//     price: "199.99 ",
//   },
// ];

// import NFTMarketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  // useEffect(() => {
  //   loadNFTs();
  // }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItem();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nftList.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div className="flex justify-center">
      <div className="px-20 py-10" style={{ maxWidth: "1600px" }}>
        <div className=" py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nftList.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img
                height="250px"
                src={nft.image}
                style={{
                  height: "200px",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="mb-5 text-2xl font-bold text-white">
                  {nft.price} ETH
                </p>
                <Link
                  href={`/checkout?item=${nft.key}`}
                  className="p-10 w-full"
                  // onClick={() => buyNft(nft)}
                >
                  <a className="mx-auto p-10 mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded">
                    Buy
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
