import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUpdateAdminProfileInfo } from "../hook/useAdminProfile";
import { useEffect } from "react";
import { toast } from "sonner";
import type { UpdateAdminProfileDTO } from "../types/admin-info.types";
import { Card } from "@/components/ui/card";

export function AdminProfileSection() {
  const { admin, handleSetAdmin } = useAuth();
  const { mutate: updateAdminInfo, isPending } = useUpdateAdminProfileInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<UpdateAdminProfileDTO>({
    defaultValues: {
      username: admin?.username ?? "",
      email: admin?.email ?? "",
      contact: admin?.contact ?? "",
    },
  });

  // Fill form inputs when admin data is available
  useEffect(() => {
    if (admin) {
      reset({
        username: admin.username ?? "",
        email: admin.email ?? "",
        contact: admin.contact ?? "",
      });
    }
  }, [admin, reset]);

  const onSubmit = (data: UpdateAdminProfileDTO) => {
    const updatedData: Partial<UpdateAdminProfileDTO> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const field = key as keyof UpdateAdminProfileDTO;
      updatedData[field] = data[field];
    });

    if (Object.keys(updatedData).length === 0) {
      return;
    }

    updateAdminInfo({
      adminId: admin!.id,
      data: updatedData as UpdateAdminProfileDTO,
    }, {
      onSuccess: (res) => {
        toast.success(res.message);
        handleSetAdmin(res.data);
      }
    });
  };

  return (
    <Card
      className="
        rounded-2xl
        border-stone-200
        dark:border-stone-700
        bg-white
        dark:bg-stone-900
        shadow-sm
      "
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6"
      >
        <h3
          className="
            text-lg
            font-semibold
            text-slate-800
            dark:text-slate-100
          "
        >
          Admin Profile
        </h3>

        <div className="space-y-4">

          {/* Username */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Username
            </label>

            <Input
              {...register("username")}
              placeholder="Enter username"
              className="
                h-11
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />
          </div>

          {/* Admin Title */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Admin Title
            </label>

            <Input
              value="System Administrator"
              disabled
              className="
                h-11
                bg-slate-100
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-500
                dark:text-slate-400
              "
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Email
            </label>

            <Input
              type="email"
              {...register("email")}
              placeholder="Enter email"
              className="
                h-11
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Phone
            </label>

            <Input
              {...register("contact")}
              placeholder="Enter phone number"
              className="
                h-11
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="
              h-11
              bg-emerald-500
              hover:bg-emerald-600
              text-white
            "
          >
            {isPending
              ? "Updating..."
              : "Update Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}