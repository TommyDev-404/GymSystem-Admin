import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUpdateAdminProfileInfo } from "../hook/useAdminProfile";
import { useEffect } from "react";
import { toast } from "sonner";
import type { UpdateAdminProfileDTO } from "../types/admin-info.types";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6"
    >
      <h3 className="text-slate-800 font-semibold">
        Admin Profile
      </h3>

      <div className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm text-slate-600">
            Username
          </label>

          <Input
            {...register("username")}
            placeholder="Enter username"
          />
        </div>

        {/* Admin Title */}
        <div className="space-y-2">
          <label className="text-sm text-slate-600">
            Admin Title
          </label>

          <Input
            value="System Administrator"
            disabled
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-slate-600">
            Email
          </label>

          <Input
            type="email"
            {...register("email")}
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm text-slate-600">
            Phone
          </label>

          <Input
            {...register("contact")}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isPending ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}