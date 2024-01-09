"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/AuthProvider";
import { cn } from "@/utils/misc";
import { UserCircle } from "@phosphor-icons/react";
import Link from "next/link";

export function UserNav() {
  const { session, signIn, signOut } = useUser();

  return (
    <div className="">
      <div className="mx-auto flex justify-between  py-7">
        <Link href="/" className="font-walsheim text-xl">
          Redoit
          {false && (
            <span className="ml-2 h-fit rounded bg-yellow-500 px-1 text-xs">
              Pro
            </span>
          )}
        </Link>
        {session === null ? (
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex w-fit items-center",
            )}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Login
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {/* * Temp: get this from users table. */}
                    {session.user.user_metadata.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
              <DropdownMenuItem className="" onClick={() => signOut()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
