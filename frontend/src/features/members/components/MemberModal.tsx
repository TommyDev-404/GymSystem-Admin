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
      referral_code: "",
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
        referral_code: member.referral_code || "",
      });
    } else {
      reset({
        fullname: "",
        email: "",
        age: 0,
        gender: undefined,
        plan_id: undefined,
        referral_code: "",
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
        referral_code: "",
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
      <DialogContent
        className="
          sm:max-w-md
          rounded-2xl
          bg-white
          dark:bg-stone-900
          border-stone-200
          dark:border-stone-700
        "
      >
        <DialogHeader>
          <DialogTitle
            className="
              text-xl
              font-semibold
              text-slate-800
              dark:text-slate-100
            "
          >
            {member ? "Edit Member" : "Add Member"}
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            flex
            flex-col
            gap-5
            mt-3
          "
        >
          {/* PERSONAL INFORMATION */}
          <div className="space-y-4">
            <p className="
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
              dark:text-slate-500
            ">
              Personal Information
            </p>

            {/* NAME */}
            <div className="space-y-1.5">
              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Full Name
              </label>

              <Input
                {...register("fullname")}
                placeholder="Enter full name"
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

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Email Address
              </label>

              <Input
                {...register("email")}
                placeholder="example@email.com"
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

            {/* AGE + GENDER */}
            <div className="grid grid-cols-2 gap-3">
              {/* AGE */}
              <div className="space-y-1.5">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Age
                </label>

                <Input
                  type="number"
                  placeholder="Age"
                  {...register("age", {
                    valueAsNumber: true
                  })}
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

              {/* GENDER */}
              <div className="space-y-1.5">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Gender
                </label>

                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >

                      <SelectTrigger
                        className="
                          bg-white
                          dark:bg-stone-800
                          border-slate-200
                          dark:border-stone-700
                          text-slate-700
                          dark:text-slate-200
                          w-full
                          py-5.5
                        "
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent
                        className="
                          bg-white
                          dark:bg-stone-900
                          border-slate-200
                          dark:border-stone-700
                        "
                      >
                        <SelectItem value="Male">
                          Male
                        </SelectItem>

                        <SelectItem value="Female">
                          Female
                        </SelectItem>

                      </SelectContent>

                    </Select>
                  )}
                />

              </div>
            </div>
          </div>

          {/* REFERRAL CODE */}
          <div className="space-y-1.5">

            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Referral Code
            </label>


            <Input
              {...register("referral_code")}
              placeholder="Enter referral code (optional)"
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
          
          {/* MEMBERSHIP */}
          {!member && 
            <div className="space-y-4">
              <p className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                dark:text-slate-500
              ">
                Membership
              </p>

              {/* PLAN */}
              <div className="space-y-1.5">
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Membership Plan
                </label>

                <Controller
                  control={control}
                  name="plan_id"
                  render={({ field }) => (
                    <Select
                      value={
                        field.value
                          ? String(field.value)
                          : ""
                      }
                      onValueChange={(val) =>
                        field.onChange(Number(val))
                      }
                    >

                      <SelectTrigger
                        className="
                          bg-white
                          dark:bg-stone-800
                          border-slate-200
                          dark:border-stone-700
                          text-slate-700
                          dark:text-slate-200
                          w-full
                          py-5.5
                        "
                      >
                        <SelectValue placeholder={plans.length > 0 ? "Select membership plan" : "No available membership plan."}/>
                      </SelectTrigger>

                      <SelectContent
                        className="
                          bg-white
                          dark:bg-stone-900
                          border-slate-200
                          dark:border-stone-700
                          py-2
                        "
                      >
                        {plans.length !== 0 &&
                          plans.map(
                            (
                              p: {
                                id: number;
                                plan_name: string;
                                duration: number;
                                duration_type: string;
                              }
                            ) => (
                              <SelectItem
                                key={p.id}
                                value={String(p.id)}
                              >
                                {`${p.plan_name} (${p.duration} ${p.duration_type.toLowerCase()})`}
                              </SelectItem>
                            )
                          )
                        }
                      </SelectContent>

                    </Select>
                  )}
                />

              </div>

            </div>
          }

          {/* ACTIONS */}
          <div className="
            flex
            gap-3
            mt-3
          ">

            <Button
              type="button"
              variant="outline"
              className="
                flex-1
                h-11
                border-slate-200
                dark:border-stone-700
                dark:text-slate-200
                dark:hover:bg-stone-800
              "
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="
                flex-1
                h-11
                bg-emerald-500
                hover:bg-emerald-600
                text-white
              "
              disabled={isLoading}
            >
              {isLoading
                ? member
                  ? "Saving..."
                  : "Adding..."
                : member
                ? "Save Changes"
                : "Add"}
            </Button>

          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}