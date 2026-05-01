/**
 * 플로팅 PDF 리드 폼 문구 — 해설 언어 코드와 동일한 키를 사용합니다.
 * 지원 안 되는 언어는 영어(en)로 대체합니다.
 */
export const FLOATING_LEAD_COPY = Object.freeze({
  ko: {
    blurb:
      '이메일을 남겨 주시면 유용한 한국어 표현 100가지 PDF와 함께, 약 4주 뒤 출간 예정 『동화로 배우는 한국어』의 출시 소식과 결제 시 쓸 수 있는 20% 할인 코드 안내를 보내 드립니다.',
    emailLabel: '이메일 주소',
    placeholder: 'you@example.com',
    send: '보내기',
    sending: '보내는 중…',
    success:
      '접수되었습니다. 곧 PDF와 『동화로 배우는 한국어』 출시 소식, 20% 할인 코드를 메일로 보내 드립니다.',
    error: '전송에 실패했습니다. 네트워크를 확인하거나 나중에 다시 시도해 주세요.',
    /** FormSubmit이 배포 도메인(pages.dev 등)에서 요구하는 1회 활성화 */
    needsActivation:
      '이 사이트 주소는 아직 FormSubmit에 등록되지 않았습니다. bunz5911@gmail.com 받은편지함에서 「Activate Form」 링크를 눌러 활성화한 뒤 다시 보내 주세요. (로컬 localhost는 테스트용으로 통과될 수 있습니다.)',
    referrerBlocked:
      '브라우저가 요청 출처(Referrer)를 숨기고 있어 차단되었을 수 있습니다. 설정을 바꾸거나 다른 브라우저에서 시도해 주세요.',
    ariaForm: 'PDF 및 출간·할인 안내 신청',
  },
  en: {
    blurb:
      'Leave your email—get a PDF of 100 useful Korean expressions, updates on Korean Through Fairy Tales (out in four weeks), and a 20% discount code for your purchase.',
    emailLabel: 'Email address',
    placeholder: 'you@example.com',
    send: 'Send',
    sending: 'Sending…',
    success:
      'Request received. We will email your PDF plus launch updates and your 20% discount code shortly.',
    error: 'Something went wrong. Please check your connection and try again.',
    needsActivation:
      'This site URL is not activated on FormSubmit yet. Open the email sent to bunz5911@gmail.com and click “Activate Form”, then try again. (Localhost may work without this step.)',
    referrerBlocked:
      'Your browser may be blocking the request referrer. Try another browser or loosen privacy settings.',
    ariaForm: 'Request PDF, launch news, and discount code',
  },
  ja: {
    blurb:
      'メールをご入力ください。『役に立つ韓国語表現100』PDFと、およそ4週間後発売予定の『童話で学ぶ韓国語』発売情報・購入時に使える20%オフコードをお送りします。',
    emailLabel: 'メールアドレス',
    placeholder: 'you@example.com',
    send: '送信',
    sending: '送信中…',
    success:
      'お申し込みを受け付けました。まもなくPDFと発売情報、割引コードをメールいたします。',
    error: '送信できませんでした。通信状況をご確認のうえ、お試しください。',
    needsActivation:
      'FormSubmitでこのサイトが未登録です。bunz5911@gmail.com に届いたメールの「Activate Form」を開き、登録後にもう一度送信してください。',
    referrerBlocked:
      'ブラウザがリファラーを送らない設定の可能性があります。別ブラウザでお試しください。',
    ariaForm: 'PDF・発売案内・割引コードの請求フォーム',
  },
  zh: {
    blurb:
      '留下电子邮箱，即可获得「实用韩语表达100条」PDF、约四周后上市的《童话学韩语》(동화로 배우는 한국어)出书动态，以及可享优惠的20%折扣码。',
    emailLabel: '电子邮箱',
    placeholder: 'you@example.com',
    send: '发送',
    sending: '发送中…',
    success: '提交成功。我们将尽快向您发送PDF、上市消息与折扣码。',
    error: '发送失败，请检查网络后重试。',
    needsActivation:
      '此站点尚未在 FormSubmit 激活。请查看 bunz5911@gmail.com 邮箱中的「Activate Form」链接并完成激活后再提交。',
    referrerBlocked: '浏览器可能隐藏了来源信息，请更换浏览器或调整隐私设置后再试。',
    ariaForm: '申请PDF与新书发售及折扣资讯',
  },
  es: {
    blurb:
      'Deja tu correo: te enviamos el PDF «100 expresiones coreanas», novedades de Coreano aprendiendo con cuentos (lanzamiento dentro de cuatro semanas) y un código del 20% de descuento.',
    emailLabel: 'Correo electrónico',
    placeholder: 'tu@ejemplo.com',
    send: 'Enviar',
    sending: 'Enviando…',
    success:
      'Listo. Pronto enviaremos tu PDF, avisos de lanzamiento y el código del 20% de dto.',
    error: 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.',
    needsActivation:
      'FormSubmit aún no tiene activado este sitio. Revisa el correo a bunz5911@gmail.com y haz clic en «Activate Form». (En localhost puede funcionar sin esto.)',
    referrerBlocked:
      'Tu navegador podría estar bloqueando el referer. Prueba con otro navegador.',
    ariaForm: 'Solicitar PDF, novedades y código de descuento',
  },
  fr: {
    blurb:
      'Laissez votre e-mail : PDF de 100 expressions coréennes utiles, infos de sortie de Coréen avec les contes (dans environ quatre semaines) et code promo −20 %.',
    emailLabel: 'Adresse e-mail',
    placeholder: 'vous@exemple.com',
    send: 'Envoyer',
    sending: 'Envoi…',
    success:
      'Bien reçu. Nous envoyons vite le PDF, les infos de sortie et votre code −20 %.',
    error: "L'envoi a échoué. Vérifiez votre connexion et réessayez.",
    needsActivation:
      "Ce site n'est pas encore activé sur FormSubmit. Ouvrez le mail sur bunz5911@gmail.com et cliquez « Activate Form », puis réessayez.",
    referrerBlocked:
      'Votre navigateur cache peut-être le référent. Essayez un autre navigateur.',
    ariaForm: 'Demander PDF, annonce de sortie et code promo',
  },
  de: {
    blurb:
      'E-Mail angeben und erhalten: PDF mit 100 nützlichen koreanischen Wendungen plus Infos zur Veröffentlichung von Koreanisch mit Märchen (in etwa vier Wochen) und einen 20%-Rabattcode für den Kauf.',
    emailLabel: 'E-Mail-Adresse',
    placeholder: 'sie@beispiel.de',
    send: 'Senden',
    sending: 'Wird gesendet…',
    success:
      'Anfrage angekommen. Wir mailen bald PDF, Start-Hinweise und den 20%-Code.',
    error:
      'Senden fehlgeschlagen. Bitte Verbindung prüfen und erneut versuchen.',
    needsActivation:
      'Diese Domain ist bei FormSubmit noch nicht aktiviert. E-Mail an bunz5911@gmail.com prüfen und „Activate Form“ anklicken, dann erneut senden.',
    referrerBlocked:
      'Der Referer könnte blockiert sein. Anderen Browser versuchen.',
    ariaForm: 'PDF, Veröffentlichung und Rabattcode anfordern',
  },
  pt: {
    blurb:
      'Deixe seu e-mail: enviamos o PDF «100 expressões coreanas», novidades sobre Coreano através de contos de fadas (lançamento daqui a ~4 semanas) e um código de 20% de desconto na compra.',
    emailLabel: 'E-mail',
    placeholder: 'voce@exemplo.com',
    send: 'Enviar',
    sending: 'Enviando…',
    success:
      'Recebido. Você deve receber o PDF, atualizações e o código dos 20% em breve.',
    error: 'Não foi possível enviar. Verifique a conexão e tente novamente.',
    needsActivation:
      'Este site ainda não está ativado no FormSubmit. Veja o e-mail enviado a bunz5911@gmail.com e clique em «Activate Form». (Em localhost pode funcionar sem isto.)',
    referrerBlocked:
      'Seu navegador pode estar bloqueando o referenciador. Tente outro navegador.',
    ariaForm: 'Pedir PDF, novidades da obra e código de desconto',
  },
})

/** FormSubmit은 수신 주소 첫 제출 시 확인 링크가 필요할 수 있습니다. */
export const LEAD_RECIPIENT_EMAIL = 'bunz5911@gmail.com'
