import { STACK, type StackId } from './stack'

export interface StackOption {
  id: StackId
  label: string
  count: number
}

/**
 * Technologies used by at least one project, most used first, then
 * alphabetically, with how many projects use each.
 */
export function stackOptions(projects: { stack: readonly StackId[] }[]): StackOption[] {
  const counts = new Map<StackId, number>()
  for (const project of projects) {
    for (const id of new Set(project.stack)) {
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([id, count]) => ({ id, label: STACK[id].label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'en'))
}

/** Projects that use the technology; all projects when nothing is selected. */
export function filterByStack<T extends { stack: readonly StackId[] }>(
  projects: T[],
  selected: StackId | null,
): T[] {
  return selected ? projects.filter((project) => project.stack.includes(selected)) : projects
}

/**
 * Reads ?stack= from the address. Anything that is not a known technology
 * (a typo, an old link, an array) means "no filter" instead of an error.
 */
export function parseStackQuery(value: unknown): StackId | null {
  return typeof value === 'string' && Object.hasOwn(STACK, value) ? (value as StackId) : null
}
