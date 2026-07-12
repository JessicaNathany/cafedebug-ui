import { ComingSoonPage } from "@/features/placeholders";

type EditTeamMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;

  return (
    <ComingSoonPage
      route={`/team-members/${id}/edit`}
      summary="The Team Member editor is planned separately, but this route remains available as the edit destination from the list."
      title="Edit Team Member"
    />
  );
}
