import { defineCollection, defineContentConfig } from '@nuxt/content'
import { projectSchema } from './shared/schema/project'

export default defineContentConfig({
  collections: {
    // One JSON file per project: content/projects/<slug>.json
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.json',
      schema: projectSchema,
    }),
  },
})
