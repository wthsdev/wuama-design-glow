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

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Verifactu
                  {verifactuConnected ? (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-success" /> Conectado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">No conectado</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Conecta Verifactu para emitir y registrar tus facturas automáticamente conforme a la AEAT.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="verifactu-nif">NIF / CIF</Label>
            <Input
              id="verifactu-nif"
              placeholder="B12345678"
              value={verifactuNif}
              onChange={(e) => setVerifactuNif(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verifactu-cert">Certificado digital / API Key</Label>
            <Input
              id="verifactu-cert"
              type="password"
              placeholder="Introduce tu clave de Verifactu"
              value={verifactuCert}
              onChange={(e) => setVerifactuCert(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tus credenciales se guardan cifradas y solo se usan para emitir facturas en tu nombre.
            </p>
          </div>
          {verifactuConnected ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setVerifactuConnected(false);
                  toast.success("Verifactu desconectado");
                }}
              >
                Desconectar
              </Button>
              <Button
                className="flex-1"
                onClick={() => toast.success("Conexión con Verifactu verificada")}
              >
                Verificar conexión
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              disabled={!verifactuNif || !verifactuCert}
              onClick={() => {
                setVerifactuConnected(true);
                toast.success("Verifactu conectado · las facturas se generarán automáticamente");
              }}
            >
              Conectar Verifactu
            </Button>
          )}
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