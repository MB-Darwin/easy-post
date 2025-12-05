"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { Button, Calendar, Popover } from "../ui";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    setDate(undefined);
    e.preventDefault();
  };

  return (
    <Popover>
      <Popover.Trigger asChild>
        <div className="relative w-[250px]">
          <Button
            type="button"
            variant="outline"
            mode="input"
            placeholder={!date}
            className="w-full"
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
          {date && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              className="absolute -end-0 top-1/2 -translate-y-1/2"
              onClick={handleReset}
            >
              <X />
            </Button>
          )}
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </Popover.Content>
    </Popover>
  );
}
