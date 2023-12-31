"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

import { useOrigin } from "@/lib/hooks/use-origin";

import { Store } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { APIAlert } from "@/components/misc/api-alert";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/index";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The e-commerce store must have a valid name." }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

type SettingsFormProps = {
  initialData: Store;
};

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();

  const router = useRouter();

  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();

      router.push("/");

      toast.success("The store has been deleted.");
    } catch (error: any) {
      toast.error(
        "Removed associated products and categories before deleting this e-commerce store.",
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      await axios.patch(`/api/stores/${params.storeId}`, data);

      router.refresh();

      router.push(`/${params.storeId}`);

      toast.success("The store has been updated.");
    } catch (error: any) {
      toast.error("An unknown error has occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading
          title="Store settings"
          description="Manage the settings of your e-commerce store."
        />

        <Button
          disabled={loading}
          variant="destructive"
          onClick={() => setOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <Separator orientation="vertical" className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-Commerce store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator orientation="vertical" className="my-4" />

      <APIAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};
