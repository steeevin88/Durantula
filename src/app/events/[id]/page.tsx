import prisma from "@/lib/prisma";
import { Session, getSession } from "@auth0/nextjs-auth0";
import { getUserByEmail } from "@/util/getUserByEmail";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const eventData = await prisma.event.findUnique({
    where: { id },
  });

  if (!eventData) {
    console.log("Cannot find event");
    return false;
  }

  const eventAttendees = await Promise.all(
    eventData.userIds.map(async (userId) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return user?.email || ''; // Return the user's email or an empty string if not found
    })
  );

  const eventNotes = await prisma.note.findMany({
    where: {
      eventId: eventData.id,
    },
  });

  const email = (await getSession())!.user.email;
  const userData = (await getUserByEmail(email))!;

  const admin = await prisma.user.findUnique({
    where: {
      id: eventData?.adminId,
    },
  });

  // add user to event's attendees
  if (!eventData.userIds.some((id) => id == userData.id)) {
    await prisma.event.update({
      where: { id: eventData.id },
      data: {
        users: {
          connect: {
            id: userData.id,
          },
        },
      },
    });
  }

  // handle note submissions
  async function submitNote(formData: FormData) {
    "use server"

    const session = await getSession();
    if (!session) return;

    // create note
    await prisma.note.create({
      data: {
        content: formData.get("content") as string,
        authorId: userData.id as string,
        eventId: eventData?.id as string,
      }
    });
  }

  return (
    <div className="py-20 min-h-[calc(100vh)] flex flex-col gap-4 text-black">
      <div className="grid grid-cols-5 text-center gap-4">
        <div className="text-5xl col-span-2">{eventData.title}</div>
        <div className="flex flex-col col-span-3">
          <div className="text-lg">
            This event is hosted by: {eventData.adminName} ({admin?.email})
          </div>
          <div className="text-xl">{eventData.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 px-6">
        <div className="flex flex-col col-span-2 gap-4">
          {/* List of Attendees */}
          <div className="shadow-lg rounded-lg p-4 bg-white text-black max-h-[50rem]">
            <h2 className="text-xl font-bold mb-2">Attendees:</h2>
            <ul>
              {eventAttendees.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>

          {/* Past Notes --> each is a modal */}
          <div className="shadow-lg rounded-lg p-4 bg-white text-black max-h-[50rem]">
            <h2 className="text-xl font-bold mb-2">Previous Notes:</h2>
            <ul>
              {eventNotes.map((note) => (
                <li key={note.authorId}>- {note.content}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col col-span-3 text-black">
          <div className="shadow-lg rounded-lg p-4 bg-white text-black min-h-[60vh]">
            <form className="flex flex-col gap-4 text-primary" action={submitNote}>
              <textarea
                className="textarea min-h-[60vh] input-large bg-white"
                name="content"
                placeholder="Notepad"
              />
              <button className="btn" type="submit">
                Save Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
