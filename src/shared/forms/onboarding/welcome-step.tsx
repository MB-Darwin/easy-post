"use client";

interface WelcomeStepProps {
  onNext: (userType: "merchant" | "agency") => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-12">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">
          Hey there,
          <br />
          nice to meet you! How about we get to
          <br />
          know each other better?
        </h1>
      </div>

      <div className="space-y-6">
        <p className="text-base text-foreground font-medium">
          First... What brings you here?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNext("merchant")}
            className="px-6 py-4 text-base font-medium text-foreground bg-background border border-border rounded-lg hover:border-foreground transition-all duration-200"
          >
            Merchant
          </button>

          <button
            onClick={() => onNext("agency")}
            className="px-6 py-4 text-base font-medium text-foreground bg-background border border-border rounded-lg hover:border-foreground transition-all duration-200"
          >
            Agency
          </button>
        </div>
      </div>
    </div>
  );
}
