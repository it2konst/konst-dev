import { z } from 'zod'
import { STACK_IDS } from '../utils/stack'

/**
 * The shape of one project file in content/projects/<slug>.json.
 *
 * Nuxt Content validates every file against this schema at build time, and
 * the unit tests run the same check, so a missing translation, a bad date or
 * an unknown technology is caught before anything is deployed.
 */

/** Text in both site languages. */
const localized = z.object({
  en: z.string().trim().min(1),
  ru: z.string().trim().min(1),
})

const localizedList = z
  .object({
    en: z.array(z.string().trim().min(1)).min(1).max(6),
    ru: z.array(z.string().trim().min(1)).min(1).max(6),
  })
  .refine((list) => list.en.length === list.ru.length, {
    message: 'English and Russian lists must have the same number of items',
  })

const httpsUrl = z.string().url().startsWith('https://')

export const projectSchema = z.object({
  /** Display name, usually the repository name. */
  name: z.string().trim().min(1),

  /** When the project was released or last had a major update, as YYYY-MM. Newest first. */
  date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the YYYY-MM format'),

  /** "in-progress" and "archived" get a label on the card; "live" needs none. */
  status: z.enum(['live', 'in-progress', 'archived']),

  /** Featured projects are shown on the home page. */
  featured: z.boolean(),

  /** One or two sentences: what it is and why it is interesting. */
  summary: localized,

  /** Short points for the project page: what is notable inside. */
  highlights: localizedList,

  /** Ids from shared/utils/stack.ts, most important first. */
  stack: z.array(z.enum(STACK_IDS)).min(1).max(8),

  links: z.object({
    repo: httpsUrl.startsWith('https://github.com/'),
    demo: httpsUrl.optional(),
  }),

  /**
   * A screenshot in public/projects/<slug>/. 16:10 works best.
   * Projects without a user interface can show a terminal snippet instead.
   */
  cover: z
    .object({
      src: z.string().regex(/^\/projects\/[a-z0-9-]+\/[\w.-]+\.(webp|avif|png|jpe?g)$/),
      alt: localized,
    })
    .optional(),

  /** Shell commands shown in place of a cover, one per line, without the prompt. */
  terminal: z.array(z.string().min(1)).min(1).max(5).optional(),
})

export type ProjectData = z.infer<typeof projectSchema>

/**
 * Rules that span several fields. Nuxt Content needs a plain object schema to
 * build its database table, so these run in the tests rather than in the
 * collection itself.
 */
export const projectFileSchema = projectSchema.superRefine((project, ctx) => {
  if (!project.cover && !project.terminal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Add a cover screenshot or a terminal snippet, so the card has a picture',
    })
  }
  if (project.status === 'live' && !project.links.demo && !project.terminal) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['links', 'demo'],
      message: 'A live project with a user interface needs a demo link',
    })
  }
})
