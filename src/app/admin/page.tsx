import { AdminPanel } from "@/components/shared/AdminPanel/adminPanel";
import { Container } from "@/components/shared/container";
import { getUserSession } from "@/lib/get-user-session";
import { redirect } from "next/navigation";

export default async  function Admin()  {

    const admin = await getUserSession();

    if(admin?.user.role !== 'admin') {
        redirect('/')
    }

  return (
    <Container className="flex flex-col items-center justify-center">
      <AdminPanel className="flex flex-col items-center justify-center" />
    </Container>
  );
}
