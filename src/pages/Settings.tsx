import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileCheck2 } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("My Agency");
  const [email, setEmail] = useState("partner@example.com");
  const [currency, setCurrency] = useState("USD");
  const [withdrawal, setWithdrawal] = useState("bank");
  const [verifactuConnected, setVerifactuConnected] = useState(false);
  const [verifactuNif, setVerifactuNif] = useState("");
  const [verifactuCert, setVerifactuCert] = useState("");

  return (
    <div className="section-spacing max-w-3xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your partner account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Your business details and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
          <CardDescription>Configure your billing preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>How you receive your earnings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="withdrawal">Withdrawal Method</Label>
            <Select value={withdrawal} onValueChange={setWithdrawal}>
              <SelectTrigger id="withdrawal"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full">Update Payment Details</Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button className="flex-1" onClick={() => toast.success("Settings saved")}>
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </div>
  );
}