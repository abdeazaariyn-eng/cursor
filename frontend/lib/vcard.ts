/**
 * Generate .vcf (vCard) file for "Save Our Number" button.
 * Allows customers to save the store number with a friendly name.
 */

export function generateVCard(phoneNumber: string): Blob {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:متجرنا
TEL;TYPE=CELL:${phoneNumber}
ORG:Mahd Baby
NOTE:تأكيد طلبك والشحن
END:VCARD`

  return new Blob([vcard], { type: 'text/vcard' })
}

export function downloadVCard(phoneNumber: string): void {
  const blob = generateVCard(phoneNumber)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mahd_baby_store.vcf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
