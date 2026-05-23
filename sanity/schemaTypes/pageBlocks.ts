import {defineArrayMember, defineField, defineType} from "sanity";

export const heroBlockType = defineType({
  name: "hero",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({name: "brandTitle", type: "string"}),
    defineField({
      name: "headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({name: "subheadline", type: "text", rows: 3}),
    defineField({
      name: "ctas",
      title: "Call To Action buttons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: "label", subtitle: "href"},
            prepare({title, subtitle}) {
              return {title: title || "Button", subtitle};
            },
          },
        }),
      ],
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
    }),
  ],
  preview: {
    select: {title: "headline", subtitle: "brandTitle"},
    prepare(selection) {
      return {
        title: selection.title || "Hero",
        subtitle: selection.subtitle,
      };
    },
  },
});

export const galleryBlockType = defineType({
  name: "gallery",
  title: "Gallery Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {hotspot: true},
          fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
        }),
        defineArrayMember({
          name: "videoItem",
          title: "Video Item",
          type: "object",
          fields: [
            defineField({
              name: "videoFile",
              title: "Video file",
              type: "file",
              options: {accept: "video/mp4,video/webm"},
              description:
                "Upload an MP4 to Sanity CDN (recommended). Resolved to videoUrl on the site.",
            }),
            defineField({
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              description:
                "Or paste an HTTPS MP4 URL (Sanity CDN, S3, etc.). Used when no file is uploaded.",
            }),
            defineField({name: "alt", type: "string", title: "Accessibility label"}),
            defineField({
              name: "poster",
              type: "image",
              options: {hotspot: true},
              fields: [defineField({name: "alt", type: "string", title: "Poster alt text"})],
            }),
          ],
          validation: (rule) =>
            rule.custom((value) => {
              const row = value as {videoUrl?: string; videoFile?: {asset?: {_ref?: string}}};
              if (row?.videoFile?.asset?._ref || row?.videoUrl?.trim()) return true;
              return "Add a video file or HTTPS video URL";
            }),
          preview: {
            select: {title: "videoUrl", media: "videoFile"},
            prepare(selection) {
              return {title: selection.title || "Video item"};
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {
        title: selection.title || "Gallery",
      };
    },
  },
});

export const videoBlockType = defineType({
  name: "video",
  title: "Video Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "embedUrl",
      type: "url",
      description:
        "YouTube or Vimeo embed URL, or a watch/share link—the site normalizes common URLs for iframes.",
    }),
    defineField({
      name: "videoFile",
      title: "Video file",
      type: "file",
      options: {accept: "video/mp4,video/webm"},
      description:
        "Upload an MP4 to Sanity CDN (recommended). Resolved to videoUrl on the site.",
    }),
    defineField({
      name: "videoUrl",
      type: "url",
      description:
        "Or paste an HTTPS MP4 URL (Sanity CDN, S3, etc.). Used when no file is uploaded.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const row = value as {
        embedUrl?: string;
        videoUrl?: string;
        videoFile?: {asset?: {_ref?: string}};
      };
      if (row?.embedUrl?.trim() || row?.videoFile?.asset?._ref || row?.videoUrl?.trim()) {
        return true;
      }
      return "Add an embed URL, video file, or HTTPS video URL";
    }),
  preview: {
    select: {title: "title", media: "videoFile"},
    prepare(selection) {
      return {
        title: selection.title || "Video",
      };
    },
  },
});

const carouselVideoItemFields = [
  defineField({name: "title", type: "string"}),
  defineField({
    name: "embedUrl",
    type: "url",
    description: "YouTube or Vimeo URL (optional if using a hosted MP4).",
  }),
  defineField({
    name: "videoFile",
    title: "Video file",
    type: "file",
    options: {accept: "video/mp4,video/webm"},
  }),
  defineField({
    name: "videoUrl",
    title: "Video URL",
    type: "url",
    description: "HTTPS MP4 URL (Sanity CDN or external).",
  }),
  defineField({name: "alt", type: "string", title: "Accessibility label"}),
  defineField({
    name: "poster",
    type: "image",
    options: {hotspot: true},
    fields: [defineField({name: "alt", type: "string", title: "Poster alt text"})],
  }),
];

export const videoCarouselBlockType = defineType({
  name: "videoCarousel",
  title: "Video carousel",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          name: "carouselVideoItem",
          title: "Carousel video",
          type: "object",
          fields: carouselVideoItemFields,
          validation: (rule) =>
            rule.custom((value) => {
              const row = value as {
                embedUrl?: string;
                videoUrl?: string;
                videoFile?: {asset?: {_ref?: string}};
              };
              if (
                row?.embedUrl?.trim() ||
                row?.videoFile?.asset?._ref ||
                row?.videoUrl?.trim()
              ) {
                return true;
              }
              return "Add an embed URL, video file, or HTTPS video URL";
            }),
          preview: {
            select: {title: "title", subtitle: "videoUrl", media: "videoFile"},
            prepare(selection) {
              return {
                title: selection.title || selection.subtitle || "Video slide",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {title: selection.title || "Video carousel"};
    },
  },
});

export const textBlockType = defineType({
  name: "textBlock",
  title: "Text Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "body",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: "title", subtitle: "body"},
    prepare(selection) {
      return {
        title: selection.title || "Text",
        subtitle: selection.subtitle,
      };
    },
  },
});

export const ctaBlockType = defineType({
  name: "cta",
  title: "CTA Block",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: "label", subtitle: "href"},
  },
});

export const aboutBlockType = defineType({
  name: "about",
  title: "About Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({name: "body", type: "text", rows: 8}),
    defineField({
      name: "image",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({name: "value", type: "string"}),
            defineField({name: "label", type: "string"}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {title: selection.title || "About"};
    },
  },
});

export const contactBlockType = defineType({
  name: "contact",
  title: "Contact Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({name: "subtitle", type: "string"}),
    defineField({name: "email", type: "string"}),
    defineField({name: "phone", type: "string"}),
    defineField({name: "location", type: "string"}),
    defineField({name: "submitLabel", type: "string"}),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({name: "label", type: "string"}),
            defineField({name: "href", type: "url"}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {title: selection.title || "Contact"};
    },
  },
});
