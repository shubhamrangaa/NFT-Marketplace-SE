import { useRouter } from "next/router";
import Link from "next/link";

import { dashboardList } from "../utilities/nftList.json";
import styles from "../styles/checkout.module.scss";

const Checkout = () => {
  const router = useRouter();
  const { item } = router.query;

  let currentNft = {};
  for (const i = 0; i < dashboardList.length; i++) {
    if (dashboardList[i].key === item) {
      currentNft = dashboardList[i];
      break;
    }
  }
  return (
    <div>
      <div className={styles.container}>
        <div
          className={
            ("border", "shadow", "rounded-xl", "overflow-hidden", styles.card)
          }
        >
          <img
            height="250px"
            src={currentNft.image}
            style={{
              height: "200px",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
          <div className="p-4">
            <p style={{ height: "64px" }} className="text-2xl font-semibold">
              {currentNft.name}
            </p>
            <div style={{ height: "70px", overflow: "hidden" }}>
              <p className="text-gray-400">{currentNft.description}</p>
            </div>
          </div>
        </div>
        <div>
          <h2>Place order</h2>
          <h3>
            Price: <strong>{currentNft.price} ETH</strong>
          </h3>
          <div className={styles.btn}>Choose Payment Mode</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
