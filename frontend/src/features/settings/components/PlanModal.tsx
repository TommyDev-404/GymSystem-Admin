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
 
 type PlanForm = {
   name: string;
   price: number;
   duration: number;
   durationType: "Day" | "Week" | "Month";
 };
 
 interface Props {
   open: boolean;
   setOpen: (v: boolean) => void;
   form: PlanForm;
   setForm: (v: PlanForm) => void;
   onSave: () => void;
   isEdit?: boolean;
 }
 
 export function PlanModal({
   open,
   setOpen,
   form,
   setForm,
   onSave,
   isEdit,
 }: Props) {
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogContent className="sm:max-w-md rounded-2xl">
 
         {/* HEADER */}
         <DialogHeader>
           <DialogTitle className="text-lg font-semibold text-slate-800">
             {isEdit ? "Edit Plan" : "Add Plan"}
           </DialogTitle>
         </DialogHeader>
 
         {/* FORM */}
         <div className="flex flex-col gap-4 mt-2">
 
           {/* PLAN NAME */}
           <div className="flex flex-col gap-1">
             <label className="text-sm text-slate-600">
               Plan Name
             </label>
 
             <Input
               placeholder="e.g. Premium Plan"
               value={form.name}
               onChange={(e) =>
                 setForm({ ...form, name: e.target.value })
               }
             />
           </div>
 
           {/* PRICE */}
           <div className="flex flex-col gap-1">
             <label className="text-sm text-slate-600">
               Price
             </label>
 
             <Input
               type="number"
               placeholder="Enter price"
               value={form.price}
               onChange={(e) =>
                 setForm({ ...form, price: Number(e.target.value) })
               }
             />
           </div>
 
           {/* DURATION + TYPE */}
           <div className="grid grid-cols-2 gap-3">
 
             {/* DURATION */}
             <div className="flex flex-col gap-1">
               <label className="text-sm text-slate-600">
                 Duration
               </label>
 
               <Input
                 type="number"
                 placeholder="e.g. 2"
                 value={form.duration}
                 onChange={(e) =>
                   setForm({
                     ...form,
                     duration: Number(e.target.value),
                   })
                 }
               />
             </div>
 
             {/* DURATION TYPE */}
             <div className="flex flex-col gap-1">
               <label className="text-sm text-slate-600">
                 Type
               </label>
 
               <Select
                 value={form.durationType}
                 onValueChange={(value) =>
                   setForm({
                     ...form,
                     durationType: value as any,
                   })
                 }
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select" />
                 </SelectTrigger>
 
                 <SelectContent>
                   <SelectItem value="Day">Day</SelectItem>
                   <SelectItem value="Week">Week</SelectItem>
                   <SelectItem value="Month">Month</SelectItem>
                 </SelectContent>
               </Select>
             </div>
 
           </div>
         </div>
 
         {/* ACTIONS */}
         <div className="flex gap-3 mt-6">
           <Button
             variant="outline"
             className="flex-1"
             onClick={() => setOpen(false)}
           >
             Cancel
           </Button>
 
           <Button
             className="flex-1 bg-emerald-500 hover:bg-emerald-600"
             onClick={onSave}
           >
             {isEdit ? "Save Changes" : "Create Plan"}
           </Button>
         </div>
 
       </DialogContent>
     </Dialog>
   );
 }