import { imagesUploadHandler } from "@/features/images/server/images-upload.handler";

export async function POST(request: Request) {
  return imagesUploadHandler(request);
}
