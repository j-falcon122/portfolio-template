import {defineField, defineType} from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navigationMode",
      title: "Navigation layout",
      type: "string",
      options: {
        list: [
          {title: "Multi-page (each nav item is its own route)", value: "routes"},
          {title: "Single page (home stacks sections; nav scrolls via #anchors)", value: "single-page"},
        ],
        layout: "radio",
      },
      initialValue: "routes",
    }),
    defineField({
      name: "singlePageSectionSlugs",
      title: "Single-page section order",
      description:
        "When using single-page navigation: page slugs to stack on the home URL, top to bottom. Must match published page documents (e.g. home, about, work). Leave empty to use the template default order.",
      type: "array",
      of: [{type: "string"}],
      validation: (rule) =>
        rule.custom<string[]>((slugs) => {
          if (!slugs?.length) return true;
          const bad = slugs.filter((s) => !s?.trim());
          if (bad.length) return "Remove empty entries";
          return true;
        }),
    }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
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
            select: {
              title: "label",
              subtitle: "href",
            },
          },
        },
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      return {
        title: selection.title || "Site Settings",
      };
    },
  },
});
