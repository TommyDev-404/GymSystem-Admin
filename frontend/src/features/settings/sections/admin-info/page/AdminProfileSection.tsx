import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUpdateAdminProfileInfo } from "../hook/useAdminProfile";
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
    },
  });

  useEffect(() => {
    if (admin) {
      reset({
        username: admin.username ?? "",
        email: admin.email ?? "",
      });
    }
  }, [admin, reset]);

  const onSubmit = (data: UpdateAdminProfileDTO) => {
    const updatedData: Partial<UpdateAdminProfileDTO> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const field = key as keyof UpdateAdminProfileDTO;
      updatedData[field] = data[field];
    });

    if (Object.keys(updatedData).length === 0) return;

    updateAdminInfo(
      {
        adminId: admin!.id,
        data: updatedData as UpdateAdminProfileDTO,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          handleSetAdmin(res.data);
        },
      }
    );
  };

  return (
    <Card className="rounded-2xl border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Admin Profile
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Username
            </label>
            <Input
              {...register("username")}
              placeholder="Enter username"
              className="h-11 border-slate-200 bg-white text-slate-700 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Admin Title
            </label>
            <Input
              value="System Administrator"
              disabled
              className="h-11 border-slate-200 bg-slate-100 text-slate-500 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="Enter email"
              className="h-11 border-slate-200 bg-white text-slate-700 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
            />
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 bg-[#8B1E2D] text-white hover:bg-[#6D1825]"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}