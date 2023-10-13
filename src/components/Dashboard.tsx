"use client";

import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import Link from "next/link";
import { Ghost, Loader2, Plus, TrashIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { Button } from "./ui/button";

const Dashboard = () => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const utils = trpc.useContext();
  const { data: books, isLoading } = trpc.getUserBooks.useQuery();
  const { mutate: deleteBook } = trpc.deleteUserBook.useMutation({
    onSuccess: () => {
      utils.getUserBooks.invalidate();
    },
    onMutate: ({ id }) => {
      setDeletingFile(id);
    },
    onSettled: () => {
      setDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Your files</h1>
        <UploadButton />
      </div>

      {books && books?.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {books
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((book) => (
              <li
                key={book.key}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${book.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg truncate font-medium text-zinc-900">
                          {book.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(book.createdAt), "dd MMM yyyy")}
                  </div>
                  <Button
                    onClick={() => {
                      deleteBook({ id: book.id });
                    }}
                    className="w-full"
                    size="sm"
                    variant="destructive"
                  >
                    {deletingFile === book.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Empty</h3>
          <p>upload book</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
