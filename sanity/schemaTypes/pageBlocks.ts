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
      name: "cta",
      title: "Call To Action",
      type: "object",
      fields: [
        defineField({name: "label", type: "string"}),
        defineField({name: "href", type: "string"}),
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
    defineField({name: "embedUrl", type: "url"}),
    defineField({name: "videoUrl", type: "url"}),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {
        title: selection.title || "Video",
      };
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
