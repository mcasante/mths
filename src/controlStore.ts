import { map } from "nanostores";
import pfp from "@/assets/images/pfp.jpeg";

export const defaults = {
  sourceImage: pfp,
  baseWidth: "360",
  isAscii: false,
  isDithered: true,
  ditherShades: 4,
};

export const $imageControls = map({
  ...defaults,
});
