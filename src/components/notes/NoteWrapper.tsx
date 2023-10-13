import NoteInput from "./NoteInput";
import Notes from "./Notes";

const NoteWrapper = () => {
    return (
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex-1 justify-between flex flex-col mb-28">
                <Notes/>
            </div>

            <NoteInput/>
        </div>
    )
}

export default NoteWrapper;