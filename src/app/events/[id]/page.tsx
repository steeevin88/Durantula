import prisma from "@/lib/prisma"
import { Session, getSession } from "@auth0/nextjs-auth0"
import { getUserByEmail } from "@/util/getUserByEmail"

export default async function Page({ params }: { params: { id: string} }) {
    const id = params.id
    const eventData = await prisma.event.findUnique({
        where: {id},
    })

    if (!eventData) {
      console.log("Cannot find event")
      return false    
    }

    const eventAttendees = await Promise.all(
      eventData.userIds.map(async (userId) => {
          const user = await prisma.user.findUnique({
              where: { id: userId },
          });
  
          return user?.email || ''; // Return the user's email or an empty string if not found
      })
  );

    const email = (await getSession())!.user.email;
    const userData = (await getUserByEmail(email))!;

    const admin = await prisma.user.findUnique({
      where: {
        id : eventData?.adminName
      }
    })

    // add user to event's attendees
    if (!eventData.userIds.some(id => id == userData.id)) {
      await prisma.event.update({
        'where': {id: eventData.id},
        'data': {
          users: {
            connect: {
              id: userData.id
            }
          }
        }
      })
    }

    return (
      <div className="py-20 min-h-[calc(100vh)] flex flex-col gap-4 text-center">
        <div className="text-7xl">{eventData.title}</div>
        <div className="text-3xl">Hosted by: {admin?.email}</div>
        <div className="text-2xl">{eventData.description}</div>

        <div className="grid grid-cols-5 gap-3 px-6">
          <div className="flex flex-col col-span-2">
            {/* List of Attendees */}
            <div className="shadow-lg rounded-lg p-4 bg-white text-black max-h-[50rem]">
              <h2 className="text-xl  font-bold mb-2">Attendees:</h2>
              <ul>
                {eventAttendees.map((email) => {
                  return (
                    <li key={email}>{email}</li>
                  );
                })}
              </ul>
            </div>

            {/* Past Notes --> each is a modal */}
            <div>

            </div>
          </div>
          <div className="flex flex-col col-span-3 text-center">
            <div className="text-lg absolute">Notepad</div>
            <div className="shadow-lg rounded-lg p-4 bg-white text-black min-h-[60vh]">
            </div>
          </div>
        </div>
      </div>
    )
  }
