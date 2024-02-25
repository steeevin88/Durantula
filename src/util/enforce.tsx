import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Enforce({children, shouldRedirect} : {children: any, shouldRedirect?: boolean}) {
  const session = await getSession();
        
  if (session) redirect('/events')
  return children
}