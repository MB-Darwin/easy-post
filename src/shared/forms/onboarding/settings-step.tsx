"use client";

import { Button, Checkbox, Select } from "@/shared/components";
import { useAppForm } from "@/shared/hooks/use-app-form";

import { useForm } from "@tanstack/react-form";

interface SettingsStepProps {
  onNext: (data: {
    language: string;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
  }) => void;
  onBack: () => void;
}

export function SettingsStep({ onNext, onBack }: SettingsStepProps) {
  const form = useAppForm({
    defaultValues: {
      language: "en",
      notificationsEnabled: true,
      emailNotifications: false,
    },
    onSubmit: async ({ value }) => {
      onNext(value);
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Button
        appearance="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 sm:mb-8"
      >
        Back
      </Button>

      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
            Choose your preferences
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 sm:space-y-8"
        >
          <form.Field name="language">
            {(field) => (
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <Select.Trigger
                  id="language"
                  className="h-11 sm:h-12 text-base bg-background border-border"
                >
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="en">English</Select.Item>
                  <Select.Item value="es">Español</Select.Item>
                  <Select.Item value="fr">Français</Select.Item>
                  <Select.Item value="de">Deutsch</Select.Item>
                  <Select.Item value="it">Italiano</Select.Item>
                  <Select.Item value="pt">Português</Select.Item>
                </Select.Content>
              </Select>
            )}
          </form.Field>

          <div className="space-y-4 sm:space-y-6 text-left">
            <form.Field name="notificationsEnabled">
              {(field) => (
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                    className="mt-0.5"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-foreground">
                      Enable push notifications
                    </div>
                    <div className="text-muted-foreground">
                      Get notified about important updates
                    </div>
                  </div>
                </label>
              )}
            </form.Field>

            <form.Field name="emailNotifications">
              {(field) => (
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                    className="mt-0.5"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-foreground">
                      I want to receive news via email
                    </div>
                  </div>
                </label>
              )}
            </form.Field>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
