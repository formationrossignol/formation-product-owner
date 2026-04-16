export function getTriggeredEvents(events, completedModuleIds, answeredEventIds) {
  return (events ?? []).filter(event => {
    if (answeredEventIds.includes(event.id)) return false
    if (!event.trigger?.startsWith('after_module:')) return false
    const triggerId = event.trigger.replace('after_module:', '')
    return completedModuleIds.includes(triggerId)
  })
}
