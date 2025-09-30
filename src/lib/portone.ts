const PORTONE_API_BASE = 'https://api.portone.io';

export interface PortOneV2PaymentInfo {
  id: string; // imp_uid
  merchantId: string; // merchant_uid
  status: 'paid' | 'ready' | 'cancelled' | 'failed';
  amount: {
    total: number;
  };
  method: string;
}

function getV2AuthHeader(): string {
  const storeId = process.env.PORTONE_STORE_ID as string;
  const storeSecret = process.env.PORTONE_STORE_SECRET as string;
  if (!storeId || !storeSecret) {
    throw new Error('Missing PortOne v2 credentials (PORTONE_STORE_ID/PORTONE_STORE_SECRET)');
  }
  const token = Buffer.from(`${storeId}:${storeSecret}`).toString('base64');
  return `Basic ${token}`;
}

// v2: imp_uid로 결제 조회
export async function getPaymentByImpUid(impUid: string): Promise<{
  imp_uid: string;
  merchant_uid: string;
  status: string;
  amount: number;
}> {
  const res = await fetch(`${PORTONE_API_BASE}/payments/${impUid}`, {
    headers: { Authorization: getV2AuthHeader() },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PortOne v2 get payment error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as PortOneV2PaymentInfo;
  return {
    imp_uid: data.id,
    merchant_uid: data.merchantId,
    status: data.status,
    amount: data.amount.total,
  };
}

// v2: 빌링키(고객)로 즉시 결제 요청
export async function chargeWithBillingKey(params: {
  customerUid: string; // customer_uid
  merchantUid: string;
  amount: number;
  name: string;
}): Promise<{ success: boolean; imp_uid?: string }>
{
  const res = await fetch(`${PORTONE_API_BASE}/subscribe/payments/again`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getV2AuthHeader(),
    },
    body: JSON.stringify({
      customerUid: params.customerUid,
      merchantUid: params.merchantUid,
      amount: params.amount,
      name: params.name,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PortOne v2 again error: ${res.status} ${text}`);
  }
  const data = await res.json();
  return { success: true, imp_uid: data.id };
}


