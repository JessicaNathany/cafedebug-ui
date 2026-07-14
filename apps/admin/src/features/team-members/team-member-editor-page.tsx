"use client";

import type { ReactNode } from "react";

import { TeamMemberEditorErrorState } from "./components/team-member-editor-error-state";
import { TeamMemberEditorForm } from "./components/team-member-editor-form";
import { TeamMemberEditorTopbar } from "./components/team-member-editor-topbar";
import {
  useTeamMemberEditor,
  type TeamMemberEditorMode,
} from "./hooks/use-team-member-editor";

type TeamMemberEditorPageProps = {
  mode: TeamMemberEditorMode;
  id?: string;
};

type TeamMemberEditorShellProps = {
  children: ReactNode;
  mode: TeamMemberEditorMode;
  onBack: () => void;
};

function TeamMemberEditorShell({
  children,
  mode,
  onBack,
}: TeamMemberEditorShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TeamMemberEditorTopbar active={false} mode={mode} onBack={onBack} />
      {children}
    </div>
  );
}

function TeamMemberEditorLoadingShell() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading team member"
      className="grid flex-1 animate-pulse xl:grid-cols-3"
    >
      <div className="space-y-8 px-6 pb-10 pt-8 lg:px-8 xl:col-span-2 xl:px-10 xl:pt-12">
        <span className="block h-16 max-w-3xl rounded-xl bg-surface-container-low" />
        <span className="block h-96 rounded-xl bg-surface-container-low" />
      </div>
      <div className="space-y-6 border-t border-outline-variant/60 bg-surface-container-lowest px-6 pb-10 pt-8 lg:px-8 xl:border-l xl:border-t-0 xl:px-10 xl:pt-10">
        <span className="block aspect-square max-w-full rounded-xl bg-surface-container-low" />
        <span className="block h-12 rounded-full bg-surface-container-low" />
      </div>
    </section>
  );
}

export function TeamMemberEditorPage({ mode, id }: TeamMemberEditorPageProps) {
  const editor = useTeamMemberEditor({ mode, id });

  if (editor.isInvalidTeamMemberId) {
    return (
      <TeamMemberEditorShell mode={mode} onBack={editor.handleNavigateBack}>
        <TeamMemberEditorErrorState
          detail="The requested team member id is invalid. Return to the team members list and choose a valid record."
          onBack={editor.handleNavigateBack}
          title="Invalid team member id"
        />
      </TeamMemberEditorShell>
    );
  }

  if (editor.isLoading) {
    return (
      <TeamMemberEditorShell mode={mode} onBack={editor.handleNavigateBack}>
        <TeamMemberEditorLoadingShell />
      </TeamMemberEditorShell>
    );
  }

  if (editor.isNotFound) {
    return (
      <TeamMemberEditorShell mode={mode} onBack={editor.handleNavigateBack}>
        <TeamMemberEditorErrorState
          detail="This team member no longer exists or is unavailable."
          onBack={editor.handleNavigateBack}
          title="Team member not found"
          traceId={editor.loadError?.traceId}
        />
      </TeamMemberEditorShell>
    );
  }

  if (editor.loadError) {
    return (
      <TeamMemberEditorShell mode={mode} onBack={editor.handleNavigateBack}>
        <TeamMemberEditorErrorState
          detail={editor.loadError.detail}
          onBack={editor.handleNavigateBack}
          onRetry={() => void editor.retryLoad()}
          title={editor.loadError.title}
          traceId={editor.loadError.traceId}
        />
      </TeamMemberEditorShell>
    );
  }

  return (
    <TeamMemberEditorForm
      active={editor.active}
      form={editor.form}
      isSubmitting={editor.isSubmitting}
      mode={mode}
      onCancel={editor.handleNavigateBack}
      onSubmit={editor.onSubmit}
      submitError={editor.submitError}
    />
  );
}
