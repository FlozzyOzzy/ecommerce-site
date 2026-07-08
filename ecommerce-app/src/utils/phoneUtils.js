// Format phone number for M-Pesa (2547XXXXXXXX)
export const formatMpesaPhone = (phone) => {
  let cleaned = phone.trim().replace(/[\s-]/g, "")

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1)
  }
  if (cleaned.startsWith("0")) {
    cleaned = `254${cleaned.slice(1)}`
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = `254${cleaned}`
  }

  return cleaned
}

export const isValidMpesaPhone = (phone) => /^254[17]\d{8}$/.test(formatMpesaPhone(phone))
