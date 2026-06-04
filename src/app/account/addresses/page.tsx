"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import type { Address } from "@/types/user";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(5),
  phone: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export default function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const { addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useAuthStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openAdd = () => {
    setEditing(null);
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      phone: user?.phone ?? "",
    });
    setOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    reset({
      firstName: addr.firstName,
      lastName: addr.lastName,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone,
    });
    setOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (editing) {
      updateAddress(editing.id, {
        ...data,
        country: "India",
      });
    } else {
      addAddress({
        ...data,
        country: "India",
        isDefault: !user?.addresses.length,
      });
    }
    setOpen(false);
  };

  const addresses = user?.addresses ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl">Addresses</h1>
        <Button variant="outline" size="sm" onClick={openAdd}>
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center border">
          No saved addresses. Add one or complete checkout to save an address.
        </p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border p-4 relative">
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-medium uppercase tracking-wider text-gold">
                  Default
                </span>
              )}
              <p className="font-medium">
                {addr.firstName} {addr.lastName}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {addr.line1}
                {addr.line2 && <>, {addr.line2}</>}
                <br />
                {addr.city}, {addr.state} {addr.postalCode}
                <br />
                {addr.phone}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDefaultAddress(addr.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openEdit(addr)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => removeAddress(addr.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr-first">First Name</Label>
                <Input id="addr-first" className="mt-1.5" {...register("firstName")} />
              </div>
              <div>
                <Label htmlFor="addr-last">Last Name</Label>
                <Input id="addr-last" className="mt-1.5" {...register("lastName")} />
              </div>
            </div>
            <div>
              <Label htmlFor="line1">Address</Label>
              <Input id="line1" className="mt-1.5" {...register("line1")} />
            </div>
            <div>
              <Label htmlFor="line2">Apartment, suite (optional)</Label>
              <Input id="line2" className="mt-1.5" {...register("line2")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr-city">City</Label>
                <Input id="addr-city" className="mt-1.5" {...register("city")} />
              </div>
              <div>
                <Label htmlFor="addr-state">State</Label>
                <Input id="addr-state" className="mt-1.5" {...register("state")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addr-postal">PIN Code</Label>
                <Input id="addr-postal" className="mt-1.5" {...register("postalCode")} />
              </div>
              <div>
                <Label htmlFor="addr-phone">Phone</Label>
                <Input id="addr-phone" className="mt-1.5" {...register("phone")} />
              </div>
            </div>
            <Button type="submit" variant="luxury" className="w-full">
              {editing ? "Save Address" : "Add Address"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
