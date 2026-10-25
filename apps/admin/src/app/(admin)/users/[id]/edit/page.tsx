import { UsersEditorPage } from "@/features/users/users-editor-page";

type EditUserPageProps = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  return <UsersEditorPage id={id} mode="edit" />;
}
