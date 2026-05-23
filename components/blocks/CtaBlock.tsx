"use client";

import Link from "next/link";
import type { CtaBlock as CtaBlockType } from "@/lib/cms/types";

export default function CtaBlock({ label, href }: CtaBlockType) {
  return (
    <div className="cta page-container my-6 text-center">
      <Link href={href} className="cta__button inline-block rounded-full bg-black text-white px-6 py-3 text-sm font-medium">
        {label}
      </Link>
    </div>
  );
}
