import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ROLES } from "@/lib/constants";
import {
  getInviteLinkSchema,
  GetInviteLinkSchema,
} from "@/lib/validation/organization";
import { getOrganizationInviteLinkAPI } from "@/services/api-organization";
import { IErrorRes } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function GetInviteLinkDialog() {
  const form = useForm<GetInviteLinkSchema>({
    resolver: zodResolver(getInviteLinkSchema),
  });

  const [copied, setCopied] = React.useState(false);

  const {
    mutate: getOrganizationLink,
    isPending,
    data,
  } = useMutation({
    mutationFn: getOrganizationInviteLinkAPI,
    onError: (err: IErrorRes) => toast.error(err.response.data.message),
  });

  function handleCreateOrganization(data: GetInviteLinkSchema) {
    getOrganizationLink(data);
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `${BASE_URL}/register?invite-session=${data.invitationSession}`
    );
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Get invite link</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get invitation link</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateOrganization)}>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map((role, i) => (
                          <SelectItem value={role} key={i}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit" loading={isPending} className="min-w-32">
                  Generate
                </Button>
              </DialogFooter>
            </form>
          </Form>
          {data?.invitationSession && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Invite link</CardTitle>
                <CardDescription>
                  Share this link with others to invite them to your
                  organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  Copy{" "}
                  {copied ? (
                    <CopyCheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GetInviteLinkDialog;
