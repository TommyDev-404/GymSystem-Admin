import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";

import type { Member } from "@/features/members/types/member";
import { useCreateMember, useUpdateMember } from "../hooks/useMember";
import { toast } from "sonner";
import { useEffect } from "react";
import { usePlans } from "@/features/settings/sections/membership_plans/hook/usePlan";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  member?: Member | null;
}

export function MemberModal({
  open,
  setOpen,
  member,
}: Props) {
  const { mutate: createMember, isPending: creating } = useCreateMember();
  const { mutate: updateMember, isPending: updating } = useUpdateMember();
  
  const { data: plans = [] } = usePlans();

  /* ---------------- REACT HOOK FORM ---------------- */
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<Member>({
    defaultValues: {
      fullname: member?.fullname || "",
      email: member?.email || "",
      age: member?.age || 0,
      gender: member?.gender || undefined,
      plan_id: member?.plan_id || undefined,
    },
  });

  // put the info of the selected member for edit (only edit mode)
  useEffect(() => {
    if (member) {
      reset({
        fullname: member.fullname,
        email: member.email,
        age: member.age,
        gender: member.gender,
        plan_id: member.plan_id,
      });
    } else {
      reset({
        fullname: "",
        email: "",
        age: 0,
        gender: undefined,
        plan_id: undefined,
      });
    }
  }, [member, reset]);

  // clear the form when modal is closed (for add modal only)
  useEffect(() => {
    if (!open && !member) {
      reset({
        fullname: "",
        email: "",
        age: 0,
        gender: undefined,
        plan_id: undefined,
      });
    }
  }, [open]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data: Member) => {
    if (member) {
      updateMember(
        {
          id: member.id!,
          data,
        },
        {
          onSuccess: () => {
            toast.success("Member updated successfully");
            setOpen(false);
          },
          onError: () => {
            toast.error("Failed to update member");
          },
        }
      );
    } else {
      createMember(data, {
        onSuccess: () => {
          toast.success("Member created successfully");
          setOpen(false);
          reset();
        },
        onError: () => {
          toast.error("Failed to create member");
        },
      });
    }
  };

  const isLoading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">

        <DialogHeader>
          <DialogTitle>
            {member ? "Edit Member" : "Add Member"}
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >

          {/* NAME */}
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <Input {...register("fullname")} />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <Input {...register("email")} />
          </div>

          {/* AGE */}
          <div>
            <label className="text-sm text-slate-600">Age</label>
            <Input
              type="number"
              {...register("age", { valueAsNumber: true })}
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="text-sm text-slate-600">Gender</label>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* PLAN */}
          <div>
            <label className="text-sm text-slate-600">Plan</label>

            <Controller
              control={control}
              name="plan_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan" />
                  </SelectTrigger>

                  <SelectContent>
                    {plans.map((p: { id:number, plan_name: string, duration: number, duration_type: string}) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {`${p.plan_name} (${p.duration} ${p.duration_type.toLocaleLowerCase()})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading
                ? member
                  ? "Saving..."
                  : "Adding..."
                : member
                ? "Save Changes"
                : "Add Member"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}