"use client";

import { Button, Input } from "@/shared/components";
import { useAppForm } from "@/shared/hooks/use-app-form";

import { X } from "lucide-react";

interface WorkspaceStepProps {
  onNext: (data: {
    workspaceName: string;
    invitedMembers: Array<{ email: string; role: "moderator" | "member" }>;
  }) => void;
  onBack: () => void;
}

export function WorkspaceStep({ onNext, onBack }: WorkspaceStepProps) {
  const form = useAppForm({
    defaultValues: {
      workspaceName: "",
      members: [{ email: "", role: "member" as "moderator" | "member" }],
    },
    onSubmit: async ({ value }) => {
      onNext({
        workspaceName: value.workspaceName,
        invitedMembers: value.members.filter((m) => m.email.trim() !== ""),
      });
    },
  });

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Have I mentioned it&apos;s even more magical as a team?
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field name="members" mode="array">
          {(field) => (
            <div className="space-y-3">
              {field.state.value.map((_, index) => (
                <form.Field key={index} name={`members[${index}].email`}>
                  {(emailField) => (
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="jschmoe@example.com"
                        value={emailField.state.value}
                        onChange={(e) =>
                          emailField.handleChange(e.target.value)
                        }
                        onBlur={emailField.handleBlur}
                        className="h-12 text-base bg-background border-border"
                      />
                      {field.state.value.length > 1 && (
                        <button
                          type="button"
                          onClick={() => field.removeValue(index)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </form.Field>
              ))}

              <button
                type="button"
                onClick={() => field.pushValue({ email: "", role: "member" })}
                className="text-sm text-foreground underline hover:no-underline"
              >
                Add another invite
              </button>
            </div>
          )}
        </form.Field>

        <div className="space-y-3 pt-4">
          <Button type="submit" size="lg">
            Send Invites
          </Button>
          <Button type="button" onClick={onBack} variant={"soft"}>
            Skip for now
          </Button>
        </div>
      </form>
    </div>
  );
}
