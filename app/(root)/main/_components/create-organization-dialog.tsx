import React from "react";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { encrypt, updateSessionCookie } from "@/lib/actions/auth";
import { CreateOrganizationSchema } from "@/lib/validation/organization";
import { createOrganizationAPI } from "@/services/api-organization";
import { IErrorRes } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateOrganizationDialog({ setSuccess }: Props) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateOrganizationSchema>();

  const { mutate: createOrganization, isPending } = useMutation({
    mutationFn: createOrganizationAPI,
    onSuccess: async (data) => {
      const user = data.updatedUser;
      const newSession = await encrypt({ user });

      await updateSessionCookie(newSession);
      setSuccess(true);
      toast.success("Organization created successfully");
      setOpen(false);
    },
    onError: (err: IErrorRes) => toast.error(err.response.data.message),
  });

  function handleCreateOrganization(data: CreateOrganizationSchema) {
    createOrganization(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateOrganization)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your organization name"
                      disabled={isPending}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" loading={isPending} className="min-w-24">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrganizationDialog;
