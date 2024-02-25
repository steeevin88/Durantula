import prisma from "../lib/prisma"; 

export async function getUserByEmail(email : string) {
  const userData = await prisma.user.findUnique({
    where:{
      email
    }
  })
  return userData;
}
