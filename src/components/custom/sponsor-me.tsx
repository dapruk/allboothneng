import { CupSoda } from "lucide-react";
import AnimatedButton from "./button";

export default function SponsorMe() {
  return (
    <AnimatedButton
      className="absolute bottom-16 left-5 items-center"
      fromColor={{
        background: "#FFFFFF",
        text: "#8276a3",
      }}
      toColor={{
        background: "#8276a3",
        text: "#FFFFFF",
      }}
      onClick={() => window.open("https://trakteer.id/dapruk/tip", "_blank")}
    >
      <CupSoda />
      <span>Sponsor My Caffeine</span>
    </AnimatedButton>
  );
}
