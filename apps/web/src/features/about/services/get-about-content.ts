import { mockAboutContent } from "../mock/about.mock";
import type { AboutContent } from "../types";

export type AboutContentReader = {
  read(): Promise<AboutContent>;
};

export function createMockAboutContentReader(content: AboutContent = mockAboutContent): AboutContentReader {
  return {
    async read() {
      return content;
    }
  };
}

const mockAboutContentReader = createMockAboutContentReader();

export async function getAboutContent(): Promise<AboutContent> {
  return mockAboutContentReader.read();
}
