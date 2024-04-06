"use client";

import { NextUIProvider } from "@nextui-org/react";

type ProviderProps = {
  children: React.ReactNode;
};

function Providers({ children }: ProviderProps) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

export default Providers;
