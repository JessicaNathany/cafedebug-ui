import { BannerEditorPage } from "@/features/banners/banner-editor-page";

type EditBannerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;

  return <BannerEditorPage id={id} mode="edit" />;
}
