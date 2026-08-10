// Отправка СМС-уведомления о новой заявке через сервис SMS.ru
// Требуются переменные окружения:
//   SMSRU_API_ID  — API-ключ из личного кабинета sms.ru
//   NOTIFY_PHONE  — номер телефона Ольги, куда слать уведомления (например 79001234567)

export async function sendSmsNotification(lead: {
  name: string
  phone: string
  message?: string | null
  service?: string | null
}): Promise<void> {
  const apiId = process.env.SMSRU_API_ID
  const notifyPhone = process.env.NOTIFY_PHONE

  if (!apiId || !notifyPhone) {
    console.log('[v0] SMS notification skipped: SMSRU_API_ID or NOTIFY_PHONE is not set')
    return
  }

  const parts = [`Новая заявка с сайта: ${lead.name}, тел. ${lead.phone}`]
  if (lead.service) parts.push(`Услуга: ${lead.service}`)
  if (lead.message) parts.push(lead.message.slice(0, 200))
  const text = parts.join('. ').slice(0, 500)

  try {
    // Нормализуем номер: убираем всё лишнее и заменяем ведущую 8 на 7
    let to = notifyPhone.replace(/\D/g, '')
    if (to.length === 11 && to.startsWith('8')) to = `7${to.slice(1)}`

    const params = new URLSearchParams({
      api_id: apiId,
      to,
      msg: text,
      json: '1',
    })
    const response = await fetch(`https://sms.ru/sms/send?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    })
    const result = await response.json()
    if (result.status !== 'OK') {
      console.log('[v0] SMS.ru error:', JSON.stringify(result))
    }
  } catch (error) {
    console.log('[v0] SMS notification failed:', error)
  }
}
