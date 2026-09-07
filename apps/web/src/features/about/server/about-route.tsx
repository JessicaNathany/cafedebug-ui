import { AboutPage } from "../components/about-page";
import { getAboutContent } from "../services/get-about-content";

export async function AboutRoute() {
  const content = await getAboutContent();

  return <AboutPage content={content} />;
}
