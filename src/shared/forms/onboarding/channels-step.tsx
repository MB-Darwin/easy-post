"use client";

import { Button, Checkbox } from "@/shared/components";
import { useAppForm } from "@/shared/hooks/use-app-form";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

interface ChannelsStepProps {
  onNext: (data: {
    connectedChannels: {
      facebook: boolean;
      instagram: boolean;
      whatsapp: boolean;
      messenger: boolean;
    };
  }) => void;
  onBack: () => void;
}

export function ChannelsStep({ onNext, onBack }: ChannelsStepProps) {
  const form = useAppForm({
    defaultValues: {
      facebook: false,
      instagram: false,
      whatsapp: false,
      messenger: false,
    },
    onSubmit: async ({ value }) => {
      onNext({
        connectedChannels: value,
      });
    },
  });

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Connect your channels
        </h2>
        <p className="text-sm text-muted-foreground">
          Social accounts (Facebook, Instagram, etc.),
          <br />
          Messaging apps (WhatsApp, Messenger)
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="space-y-4 text-left">
          <form.Field name="facebook">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span className="text-sm font-medium text-foreground">
                  Facebook
                </span>
              </label>
            )}
          </form.Field>

          <form.Field name="instagram">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <Instagram className="w-5 h-5 text-[#E4405F]" />
                <span className="text-sm font-medium text-foreground">
                  Instagram
                </span>
              </label>
            )}
          </form.Field>

          <form.Field name="whatsapp">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="text-sm font-medium text-foreground">
                  WhatsApp
                </span>
              </label>
            )}
          </form.Field>

          <form.Field name="messenger">
            {(field) => (
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                />
                <MessageCircle className="w-5 h-5 text-[#0084FF]" />
                <span className="text-sm font-medium text-foreground">
                  Messenger
                </span>
              </label>
            )}
          </form.Field>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button type="button" onClick={onBack} variant={"soft"} size="lg">
            Back
          </Button>
          <Button type="submit" size="lg">
            Done
          </Button>
        </div>
      </form>
    </div>
  );
}
