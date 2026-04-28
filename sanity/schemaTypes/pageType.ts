import {defineArrayMember, defineField, defineType} from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {source: "title", maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      type: "array",
      of: [
        defineArrayMember({type: "hero"}),
        defineArrayMember({type: "gallery"}),
        defineArrayMember({type: "video"}),
        defineArrayMember({type: "textBlock"}),
        defineArrayMember({type: "cta"}),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});
