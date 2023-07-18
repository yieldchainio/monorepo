import { Tier } from "components/cards/tier";

export const TiersSection = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-6 ">
      <Tier
        tierName="Premium"
        price={49.9}
        description="per month"
        onClick={() => alert("Click")}
        borderColors={{
          heavyColor: "var(--border)",
          lightColor: "var(--border)",
        }}
        style={{
          opacity: "100%",
        }}
      />
      <Tier
        tierName="Premium"
        price={499.9}
        description="one time payment"
        onClick={() => alert("Click")}
        borderColors={{
          heavyColor: "var(--yc-lb)",
          lightColor: "var(--yc-ly)",
        }}
        style={{
          opacity: "75%",
        }}
      />
    </div>
  );
};
