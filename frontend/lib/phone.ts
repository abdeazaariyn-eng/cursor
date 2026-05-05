const KSA_PHONE_REGEX = /^(?:\+?966|00966|0)?5[0-9]{8}$/

export function validateSaudiPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return KSA_PHONE_REGEX.test(cleaned)
}

export function normalizeSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  if (cleaned.startsWith('+966')) return '0' + cleaned.slice(4)
  if (cleaned.startsWith('00966')) return '0' + cleaned.slice(5)
  if (cleaned.startsWith('966')) return '0' + cleaned.slice(3)
  if (cleaned.startsWith('5')) return '0' + cleaned
  return cleaned
}
