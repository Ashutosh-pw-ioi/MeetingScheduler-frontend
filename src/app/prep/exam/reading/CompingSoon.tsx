import React, { JSX } from "react";

export default function ComingSoon(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <h1 className="text-4xl font-bold text-white">Coming Soon 🚧</h1>
      <p className="text-neutral-400 text-lg max-w-md">
        We&apos;re working on this section. Stay tuned for something awesome!
      </p>
    </div>
  );
}
