import { getAboutMetadata } from "@/features/about/metadata";
import { AboutRoute } from "@/features/about/server/about-route";

export const metadata = getAboutMetadata();

export default function AboutPageRoute() {
  return <AboutRoute />;
}
