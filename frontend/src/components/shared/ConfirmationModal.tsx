import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 
 type ConfirmModalProps = {
   open: boolean;
   title?: string;
   description?: string;
   confirmText?: string;
   cancelText?: string;
   variant?: "default" | "destructive";
   loading?: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
 };
 
 export function ConfirmModal({
   open,
   title = "Are you sure?",
   description = "This action cannot be undone.",
   confirmText = "Confirm",
   cancelText = "Cancel",
   variant = "default",
   loading = false,
   onOpenChange,
   onConfirm,
 }: ConfirmModalProps) {
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent>
         <DialogHeader>
           <DialogTitle>{title}</DialogTitle>
         </DialogHeader>
 
         <p className="text-sm text-slate-500">{description}</p>
 
         <DialogFooter className="flex gap-2 mt-4">
           <Button
             variant="outline"
             onClick={() => onOpenChange(false)}
             disabled={loading}
           >
             {cancelText}
           </Button>
 
           <Button
             variant={variant}
             onClick={onConfirm}
             disabled={loading}
           >
             {confirmText}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }