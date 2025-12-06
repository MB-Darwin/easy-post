"use client";

import { Button, Input, Textarea } from "@/shared/components";
import { useAppForm } from "@/shared/hooks/use-app-form";

interface ProjectStepProps {
  userType: "merchant" | "agency";
  onNext: (data: {
    projectName: string;
    projectGoals?: string;
    projectDescription?: string;
  }) => void;
  onBack: () => void;
}

export function ProjectStep({ userType, onNext, onBack }: ProjectStepProps) {
  const form = useAppForm({
    defaultValues: {
      projectName: "",
      projectGoals: "",
      projectDescription: "",
    },
    onSubmit: async ({ value }) => {
      onNext({
        projectName: value.projectName,
        projectGoals: userType === "merchant" ? value.projectGoals : undefined,
        projectDescription:
          userType === "merchant" ? value.projectDescription : undefined,
      });
    },
  });

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">
          {userType === "merchant"
            ? "Tell us about your project"
            : "Create your first project"}
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="projectName">
          {(field) => (
            <Input
              placeholder="Project name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              required
              className="h-12 text-base bg-background border-border"
            />
          )}
        </form.Field>

        {userType === "merchant" && (
          <>
            <form.Field name="projectGoals">
              {(field) => (
                <Input
                  placeholder="Project goals"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-12 text-base bg-background border-border"
                />
              )}
            </form.Field>

            <form.Field name="projectDescription">
              {(field) => (
                <Textarea
                  placeholder="Description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                  className="text-base resize-none bg-background border-border"
                />
              )}
            </form.Field>
          </>
        )}

        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button type="button" onClick={onBack} variant={"soft"} size="lg">
            Back
          </Button>
          <Button type="submit" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
