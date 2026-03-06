import type { Block } from "@/lib/cms/types";
import HeroBlock from "./HeroBlock";
import GalleryBlock from "./GalleryBlock";
import VideoBlock from "./VideoBlock";
import TextBlock from "./TextBlock";

export default function BlockRenderer({ blocks = [] }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block._type) {
          case "hero":
            return <HeroBlock key={i} {...block} />;
          case "gallery":
            return <GalleryBlock key={i} {...block} />;
          case "video":
            return <VideoBlock key={i} {...block} />;
          case "text":
            return <TextBlock key={i} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}