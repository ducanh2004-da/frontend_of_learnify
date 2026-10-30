export const CREATE_PAYMENT_MUTATION = `
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      accountName
      accountNumber
      amount
      bin
      checkoutUrl
      currency
      expiresAt
      orderId
      qrCode
      status
    }
  }
`;

export const UPDATE_PAYMENT_STATUS_MUTATION = `
  mutation UpdatePaymentStatus($input: UpdatePaymentStatus!) {
    updatePaymentStatus(input: $input) {
      isSuccess
      message
      paidAt
      status
    }
  }
`;

export const GET_PAYMENT_QUERY = `
  query Query($paymentId: String!) {
    payment(paymentId: $paymentId) {
      id
      courseId
    }
  }
`;
