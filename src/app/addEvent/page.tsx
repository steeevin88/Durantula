import React from 'react';
import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { getUserByEmail } from "@/util/getUserByEmail";

export default function AddEvent() {
  async function submitEvent(formData: FormData) {
    "use server"

    const session = await getSession();
    if (!session) return; // needed bc line 21 require non-null session

    const email = session.user.email;
    const userInfo = (await getUserByEmail(email))!;


    await prisma.event.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        adminName: formData.get("adminName") as string,
        adminId: userInfo.id
      }
    });
    redirect("/");
  }

  return (
    <div className='md:flex justify-center min-h-screen'>
      <div className='flex flex-col px-4 py-32 text-black gap-8'>
        <h1 className='text-2xl font-bold text-center'>Host a new event for friends of
        the Hoover Durant Public Library...</h1>
        <form className='flex flex-col gap-4 text-black' action={submitEvent}>
          <input className='input input-large bg-gray-500' name="title" placeholder='Event Name' />
          <input className='input input-large bg-gray-500' name="description" placeholder='Description' />
          <input className='input input-large bg-gray-500' name="location" placeholder='Location' />
          <input className='input input-large bg-gray-500' name="adminName" placeholder='Admin Name' />
          <button className='btn' type="submit">
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}
