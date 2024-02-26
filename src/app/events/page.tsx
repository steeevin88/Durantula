import Link from "next/link";
import prisma from "../../lib/prisma";
import { Event } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";
import { getUserByEmail } from "@/util/getUserByEmail";
import EventModal from "@/components/EventModal";

// create User entry in DB if email isn't found...
async function makeUserIfFirstLogin(email : string) {
  const userInfo = (await getUserByEmail(email))!;

  if (!userInfo) {
    await prisma.user.create({
      data: {
        email:email
      }
    })
  }
}

async function getEvents() {
  const events = await prisma.event.findMany();
  return events;
}

type Props = {
  event: Event;
  joined: boolean;
  admin: boolean;
}

const EventComponent = ({event, joined, admin}: Props) => {
  return(
      <div className="grid grid-cols-5 md:min-h-48 bg-white p-4 pr-6 rounded-lg gap-2 text-primary-content justify-center items-center">
        <div className="flex flex-col col-span-3">
          <div className="text-h-full text-2xl truncate">
            {event.title}
          </div>
          <div className="h-[50%] md:h-auto truncate">
            {event.location}
          </div>
        </div>
        <a href={`/events/${event.id}`}>
          <button className="btn btn-secondary btn-sm md:btn-md col-span-2">
            {admin ? "Manage" : (joined ? "View" : "Join")} Event
          </button>
        </a>
        <EventModal event={event}/>
      </div>
  )
}

export default async function Home() {
  const email = (await getSession())!.user.email;
  await makeUserIfFirstLogin(email);
  const userInfo = (await getUserByEmail(email))!;
  const events = await getEvents();

  return (
    <main className="flex flex-col items-center min-h-[calc(100vh)] py-16">
      <h2 className="p-8 md:p-12 text-4xl text-center font-extrabold tracking-tight text-gray-700 lg:text-4xl">
        Friends of Hoover Durant Public Library 
      </h2>
      <div className="bg-gray-700 rounded-lg shadow-md
        w-[90%] md:w-[80%] grid lg:grid-cols-3 gap-2 overflow-y-auto  min-h-[calc(50vh)] p-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventComponent key={event.id} joined={event.userIds.includes(userInfo.id)} admin={event.adminName == userInfo.id} event={event}/>
          ))
        ) : (
          <div className="flex flex-col col-span-3">
            <div className="text-3xl md:text-2xl text-center justify-center text-primary-content col-span-3 md:p-12">
              No events are currently available.
              <br/><br/>
              Click the button below to create a new event for others to join!
            </div>
            <div className="flex h-full justify-center items-center">
              <Link href="/addEvent" className="p-4">
                <button className="btn bg-secondary text-xl border-0">
                  Add Events
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
