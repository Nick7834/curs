import { CardDetail } from "@/components/shared/cardDetail";
import { Container } from "@/components/shared/container";
import { redirect } from "next/navigation";

export default async  function Card({params}: {params: Promise<{ id: string }>})  {

  const { id: id } = await params;
    
  const isValidObjectId = /^[a-f\d]{24}$/i.test(id);
  if (!isValidObjectId) {
    redirect('/');
  }

  return (
    <Container>
      <CardDetail id={id} />
    </Container>
  );
}
