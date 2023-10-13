import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"
import NoteWrapper from "@/components/notes/NoteWrapper"
import PDFRenderer from "@/components/PDFRenderer"
import { db } from "@/db/index"

interface BookProps {
    params: {
        bookid: string
    }
}

const Page = async ({ params }: BookProps) => {
    const { bookid } = params 
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) {
        redirect(`/auth-callback?origin=dashboard/${bookid}`)
    }

    const book = await db.book.findFirst({
        where: {
            id: bookid,
            userId: user.id
        }
    })
    
    if(!book) {
        notFound()
    }

    return (
        <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]">
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                <div className="flex-1 xl:flex ">
                    <div className="px-4 py-6 sm:px6 lg:pl-8 xl:flex-1 xl:pl-6">
                        <PDFRenderer url={book.url}/>
                    </div>
                </div>

                <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    <NoteWrapper/>
                </div>
            </div>
        </div>
    )
}

export default Page;