import { Container } from "@/components/shared/container";
import { Products } from "@/components/shared/products";


export default function Home() {
  return (
    <div>
      <Container className="flex items-center justify-center">
        <Products className="mt-10" />
      </Container>
    </div>
  );
}
