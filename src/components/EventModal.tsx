'use client';
import { Event } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

export default function EventModalComponent({event} : {event: Event}) {
  const [isToggled, toggle] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggle(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isToggled]);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.target === ref.current) {
        toggle(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [ref]);
  
  return(
    <div className="col-span-5 gap-0 text-center">
      <div className="truncate 5">
        {event.description}
      </div>
      <button className="bg-primary rounded-lg text-primary-content text-sm p-2 border:none" onClick={()=>toggle(true)}>read more...</button>
      {<dialog ref={ref} className={classNames("modal", {"modal-open": isToggled})}>
          <div className="modal-box bg-gray-500 text-black">
            <h3 className="font-bold text-2xl pb-3">{event.title}</h3>
            {event.description}
            <p className="py-4">Press ESC key or click the button below to close</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn bg-white" onClick={() => toggle(false)}>Close</button>
              </form>
            </div>
          </div>
      </dialog>}
    </div>
  )
}

