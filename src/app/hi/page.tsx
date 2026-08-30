import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

export default function HindiPreviewPage() {
  return <SiteChrome active="home"><section className="hindi-page" lang="hi"><p className="micro-copy">हिंदी पूर्वावलोकन</p><h1>किसी बात को एक से ज़्यादा कोणों से देखिए।</h1><p className="page-lede">यह शुरुआती हिंदी स्क्रीन है। प्रकाशित हिंदी संस्करण के लिए भाषा-संपादन और स्रोतों की अलग समीक्षा ज़रूरी होगी।</p><div className="hindi-cards"><article><h2>दस्तावेज़ित</h2><p>वह बात जिसे स्रोत सीधे सहारा देता है।</p></article><article><h2>व्याख्यायित</h2><p>स्रोत को देखकर निकला तर्क, जो अंतिम सत्य नहीं है।</p></article><article><h2>अनसुलझा</h2><p>वह प्रश्न जिसके लिए और प्रमाण चाहिए।</p></article></div><Link className="primary-action" href="/en/onboarding">Reading guide in English <span aria-hidden="true">↗</span></Link></section></SiteChrome>;
}
