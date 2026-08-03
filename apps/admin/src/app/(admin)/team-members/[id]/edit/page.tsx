import { TeamMemberEditorPage } from "@/features/team-members/team-member-editor-page";

type EditTeamMemberPageProps = { params: Promise<{ id: string }> };

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  return <TeamMemberEditorPage id={id} mode="edit" />;
}
