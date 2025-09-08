import db from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Stripe from 'stripe';
import { CheckoutForm } from './_component/CheckoutForm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage(props: { params: Promise<{ id: string }> }) {
  // ✅ Await params first
  const { id } = await props.params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (product === null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCent,
    currency: 'usd',
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret === null) {
    throw Error('Stripe Failed to create payment intent');
  }

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
