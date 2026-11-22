import type { ProjectsCollectionItem } from '@nuxt/content'

export type Project = ProjectsCollectionItem & { slug: string }

/** content/projects/canvas-forge.json → "canvas-forge" */
export function slugFromStem(stem: string): string {
  return stem.split('/').pop() ?? stem
}

/**
 * All projects, newest first; projects from the same month are sorted by name.
 * Pages are pre-rendered, so in the browser this data comes from the page
 * payload and no database is downloaded.
 */
export function useProjects() {
  return useAsyncData(
    'projects',
    () => queryCollection('projects').order('date', 'DESC').order('name', 'ASC').all(),
    {
      transform: (items): Project[] =>
        items.map((item) => ({ ...item, slug: slugFromStem(item.stem) })),
      default: (): Project[] => [],
    },
  )
}
