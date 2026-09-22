import { z } from "zod";

export const analyticsEventNames = ["page_view", "project_view", "resume_download"] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const analyticsEventSchema = z
  .object({
    name: z.enum(analyticsEventNames),
    path: z
      .string()
      .min(1)
      .max(300)
      .refine((value) => value.startsWith("/") && !value.startsWith("//"), "Path must be relative"),
    projectSlug: z
      .string()
      .min(1)
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })
  .superRefine((event, ctx) => {
    if (event.name === "project_view" && !event.projectSlug) {
      ctx.addIssue({
        code: "custom",
        path: ["projectSlug"],
        message: "Project views require a project slug",
      });
    }
    if (event.name !== "project_view" && event.projectSlug) {
      ctx.addIssue({
        code: "custom",
        path: ["projectSlug"],
        message: "Project slug is only valid for project views",
      });
    }
  });

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
