import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
  import { OrderInformation } from "./components/OrderInformation"
  
  type PurchaseReceiptEmailProps = {
    product: {
      name: string
      imagePath: string
      description: string
    }
    order: { id: string; createdAt: Date; pricePaidInCent: number }
    downloadVerificationId: string
  }
  
  PurchaseReceiptEmail.PreviewProps = {
    product: {
      name: "Product name",
      description: "Some description",
      imagePath:
        "/products/21ae0043-8eaf-4c27-b896-edf13f3ca0b4-bg.jpeg",
    },
    order: {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCent: 10000,
    },
    downloadVerificationId: crypto.randomUUID(),
  } satisfies PurchaseReceiptEmailProps
  
  export default function PurchaseReceiptEmail({
    product,
    order,
    downloadVerificationId,
  }: PurchaseReceiptEmailProps) {
    return (
      <Html>
        <Preview>Download {product.name} and view receipt</Preview>
        <Tailwind>
          <Head />
          <Body className="font-sans bg-white">
            <Container className="max-w-xl">
              <Heading>Purchase Receipt</Heading>
              <OrderInformation
                order={order}
                product={product}
                downloadVerificationId={downloadVerificationId}
              />
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }