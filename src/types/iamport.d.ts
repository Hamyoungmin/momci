// Iamport(PortOne) 브라우저 SDK 전역 타입 선언

export type PortOnePayMethod = 'card' | 'vbank' | 'trans' | 'phone';

export interface PortOneRequestPayParams {
  pg: string;
  pay_method: PortOnePayMethod;
  merchant_uid: string;
  name: string;
  amount: number;
  m_redirect_url?: string;
  buyer_email?: string;
  buyer_name?: string;
  buyer_tel?: string;
  customer_uid?: string; // 빌링키 발급용(정기결제)
}

export interface PortOneResponse {
  success: boolean;
  imp_uid?: string;
  merchant_uid?: string;
  paid_amount?: number;
  status?: string;
  error_msg?: string;
}

export interface Iamport {
  init: (impId: string) => void;
  request_pay: (params: PortOneRequestPayParams, callback: (rsp: PortOneResponse) => void) => void;
}

declare global {
  interface Window {
    IMP: Iamport;
  }
}

export {};


