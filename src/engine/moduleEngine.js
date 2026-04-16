export function getNextModule(modules, completedIds) {
  return modules.find(m => !completedIds.includes(m.id)) ?? null
}

export function isModuleUnlocked(moduleId, modules, completedIds) {
  const index = modules.findIndex(m => m.id === moduleId)
  if (index === 0) return true
  return completedIds.includes(modules[index - 1].id)
}
