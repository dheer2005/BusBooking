export interface PaymentDTO {
  BookingId:     number;
  Amount:        number;
  PaymentMethod: string;
  PaymentStatus: string;
  PaymentDate:   Date | string;
  RazorpayPaymentId: string
  RazorpayOrderId: string
  RazorpaySignature: string
}