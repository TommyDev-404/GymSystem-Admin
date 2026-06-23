import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";

type QRCodeModalProps = {
  open: boolean;
  setOpen: (v: boolean) => void;
  qr?: string;
  loading?: boolean;
  error?: Error | null;
};

export function QRCodeModal({
  open,
  setOpen,
  qr,
  loading,
}: QRCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col items-center text-center">

        <DialogHeader>
          <DialogTitle>Member QR Code</DialogTitle>
        </DialogHeader>

        {/* LOADING */}
        {loading && (
          <p className="text-sm text-slate-500">
            Loading QR code...
          </p>
        )}


        {/* QR CODE */}
        {!loading && qr && (
          <div className="p-6 bg-white rounded-xl border shadow-sm">
            <QRCodeCanvas value={qr} size={180} />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !qr && (
          <p className="text-sm text-slate-500">
            No QR code available
          </p>
        )}

        {/* DESCRIPTION (UNCHANGED DESIGN) */}
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