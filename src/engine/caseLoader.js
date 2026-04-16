import yaml from 'js-yaml'

export async function loadCase(caseId) {
  const res = await fetch(`/cases/${caseId}.yaml`)
  if (!res.ok) throw new Error(`Cas introuvable : ${caseId}`)
  const text = await res.text()
  return yaml.load(text)
}

export const CASE_IDS = [
  'case-ecommerce',
  'case-saas-b2b',
  'case-sante',
  'case-finance',
  'case-rh',
  'case-education',
]
