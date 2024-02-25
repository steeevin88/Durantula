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
        adminName: userInfo.id
      }
    });
    redirect("/");
  }

  return (
    <div className='md:flex justify-center min-h-screen'>
      <div className='flex flex-col px-4 py-32 gap-8'>
        <h1 className='text-4xl font-bold text-gray-700'>Add Event</h1>
        <form className='flex flex-col gap-4 text-primary' action={submitEvent}>
          <input className='input input-large' name="title" placeholder='Event Name' />
          <input className='input input-large' name="description" placeholder='Description' />
          <input className='input input-large' name="location" placeholder='Location' />
          <input className='input input-large' name="adminName" placeholder='Admin Name' />
          <button className='btn' type="submit">
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}
