"use client";

import dynamic from "next/dynamic";

const Product3DViewer = dynamic(() => import("./Product3DViewer"), { ssr: false });

export default function Dynamic3DViewer({ modelUrl }: { modelUrl: string }) {
  return <Product3DViewer modelUrl={modelUrl} />;
}