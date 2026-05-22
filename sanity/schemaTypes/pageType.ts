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
      description: "Use plain slugs without a leading slash (e.g. work, not /work).",
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current?.trim();
          if (!current) return true;
          if (current.startsWith("/")) {
            return 'Remove the leading "/" — use work, about, home, contact';
          }
          return true;
        }),
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
        defineArrayMember({type: "about"}),
        defineArrayMember({type: "contact"}),
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
