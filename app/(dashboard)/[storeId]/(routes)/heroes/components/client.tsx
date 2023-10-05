"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APIList } from "@/components/misc/api-list";
import { DataTable } from "@/components/misc/data-table";
import { Heading } from "@/components/index";

import { columns, HeroColumn } from "./columns";

type HeroClientProps = {
  data: HeroColumn[];
};

export const HeroClient = ({ data }: HeroClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Hero Sections (${data.length})`}
          description="Manage the hero sections of your e-commerce store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/heroes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Hero Sections." />
      <Separator />
      <APIList entityName="heroes" entityIdName="heroId" />
    </>
  );
};
