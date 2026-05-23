import type { Block } from "@/lib/cms/types";
import HeroBlock from "./HeroBlock";
import GalleryBlock from "./GalleryBlock";
import VideoBlock from "./VideoBlock";
import VideoCarouselBlock from "./VideoCarouselBlock";
import TextBlock from "./TextBlock";
import CtaBlock from "./CtaBlock";
import AboutBlock from "./AboutBlock";
import ContactBlock from "./ContactBlock";

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
          case "videoCarousel":
            return <VideoCarouselBlock key={i} {...block} />;
          case "text":
            return <TextBlock key={i} {...block} />;
          case "cta":
            return <CtaBlock key={i} {...block} />;
          case "about":
            return <AboutBlock key={i} {...block} />;
          case "contact":
            return <ContactBlock key={i} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}