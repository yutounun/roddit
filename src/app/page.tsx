import { Button } from "@nextui-org/react";
import * as actions from "@/actions/index";
import { auth } from "@/auth";
import Profile from "@/components/Profile";
export default async function Home() {
  const session = await auth();
  return (
    <div>
      <form action={actions.signIn}>
        <Button type="submit">SignIn</Button>
      </form>
      <form action={actions.signOut}>
        <Button type="submit">SignOut</Button>
      </form>
      {session?.user ? (
        <div>{JSON.stringify(session.user)}</div>
      ) : (
        <div>Not signed in</div>
      )}
      <Profile />
    </div>
  );
}
