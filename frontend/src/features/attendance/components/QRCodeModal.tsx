import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 
 import { QRCodeCanvas } from "qrcode.react";
 
 import { Button } from "@/components/ui/button";
 
 export function QRCodeModal({
   open,
   setOpen,
 }: {
   open: boolean;
   setOpen: (v: boolean) => void;
 }) {
   const sampleValue = "GYM-USER-123456";
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogContent className="flex flex-col items-center text-center">
 
         <DialogHeader>
           <DialogTitle>Member QR Code</DialogTitle>
         </DialogHeader>
 
         <div className="p-6 bg-white rounded-xl border shadow-sm">
           <QRCodeCanvas value={sampleValue} size={180} />
         </div>
 
         <p className="text-sm text-slate-500">
           Scan this QR code to check-in
         </p>
 
         <Button className="w-full mt-3" onClick={() => setOpen(false)}>
           Close
         </Button>
 
       </DialogContent>
     </Dialog>
   );
 }