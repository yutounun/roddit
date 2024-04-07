"use client";
import { useSession } from "next-auth/react";

function Profile() {
  const session = useSession();
  if (session.data?.user) {
    return (
      <div>From Client Component: {JSON.stringify(session.data?.user)}</div>
    );
  }

  return <div>From Client Component: you`&apos;`re not signed in</div>;
}

export default Profile;
