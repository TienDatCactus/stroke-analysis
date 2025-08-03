"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
const Access: React.FC = () => {
  const { login, user, logout } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    login({
      username: values.username,
    });
  }
  async function onLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="hover:shadow-md  cursor-pointer border w-10 h-10 border-gray-200">
            <AvatarImage src="https://api.dicebear.com/9.x/glass/svg" />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className="text-black text-base cursor-pointer"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login?</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="the ai master" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Log In</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Access;
