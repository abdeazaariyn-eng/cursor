const KSA_PHONE_REGEX = /^(?:\+?966|00966|0)?5[0-9]{8}$/
const KWT_PHONE_REGEX = /^(?:\+?965|00965)?[4569][0-9]{7}$/
const GENERIC_GCC_PHONE_REGEX = /^(?:\+?[0-9]{1,4})?[0-9]{7,12}$/

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return KWT_PHONE_REGEX.test(cleaned) || KSA_PHONE_REGEX.test(cleaned) || GENERIC_GCC_PHONE_REGEX.test(cleaned)
}

export function validateSaudiPhone(phone: string): boolean {
  return validatePhone(phone)
}

export function normalizeSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '')
  if (cleaned.startsWith('+966')) return '0' + cleaned.slice(4)
  if (cleaned.startsWith('00966')) return '0' + cleaned.slice(5)
  if (cleaned.startsWith('966')) return '0' + cleaned.slice(3)
  if (cleaned.startsWith('5') && cleaned.length === 9) return '0' + cleaned
  return cleaned
}
