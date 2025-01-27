import { Container } from "@/components/shared/container";
import { ProductsCart } from "@/components/shared/productsCart";

export default async  function Card()  {

  return (
    <Container className="flex items-center justify-center">
      <ProductsCart />
    </Container>
  );
}
