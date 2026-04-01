export function createWhatsAppLink(productName: string, sizeName: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
  const text = `Ola, quero comprar a camisa ${productName}, tamanho ${sizeName}.`;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encodedText}`;
}
