"use client";

import { UsersEditorErrorState } from "./components/users-editor-error-state";
import { UsersEditorForm } from "./components/users-editor-form";
import {
  useUserEditor,
  type UserEditorMode
} from "./hooks/use-user-editor";

type UsersEditorPageProps = {
  mode: UserEditorMode;
  id?: string;
};

export function UsersEditorPage({ mode, id }: UsersEditorPageProps) {
  const editor = useUserEditor({ mode, id });

  if (editor.isInvalidUserId) {
    return (
      <UsersEditorErrorState
        detail="The requested user id is invalid. Return to the users list and choose a valid record."
        onBack={editor.handleNavigateBack}
        title="Invalid user id"
      />
    );
  }

  if (editor.isNotFound) {
    return (
      <UsersEditorErrorState
        detail="This user no longer exists or is unavailable."
        onBack={editor.handleNavigateBack}
        title="User not found"
        {...(editor.loadError?.traceId ? { traceId: editor.loadError.traceId } : {})}
      />
    );
  }

  if (editor.loadError) {
    return (
      <UsersEditorErrorState
        detail={editor.loadError.detail}
        onBack={editor.handleNavigateBack}
        onRetry={() => void editor.retryLoad()}
        title={editor.loadError.title}
        {...(editor.loadError.traceId ? { traceId: editor.loadError.traceId } : {})}
      />
    );
  }

  if (editor.isLoading) {
    return (
      <div className="mx-auto mt-12 w-full max-w-3xl px-6 lg:px-8">
        <div className="space-y-4">
          <span className="block h-12 animate-pulse rounded-xl bg-surface-container-low" />
          <span className="block h-12 animate-pulse rounded-xl bg-surface-container-low" />
          <span className="block h-12 animate-pulse rounded-xl bg-surface-container-low" />
          <span className="block h-12 animate-pulse rounded-xl bg-surface-container-low" />
        </div>
      </div>
    );
  }

  return (
    <UsersEditorForm
      form={editor.form}
      isSubmitting={editor.isSubmitting}
      mode={mode}
      onCancel={editor.handleNavigateBack}
      onSubmit={editor.onSubmit}
      submitError={editor.submitError}
    />
  );
}
