import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewWorkspace() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");

  return (
    <div className="section-spacing max-w-3xl">
      <Link
        to="/workspaces"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        aria-label="Return"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Create New Workspace</h1>
        <p className="text-sm text-muted-foreground">Set up a new AI agent for your client</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Basic details about your client and their business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              placeholder="TechCorp Solutions"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry Sector *</Label>
            <Input
              id="industry"
              placeholder="HealthPlus Medical"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full gap-2"
        onClick={() => navigate("/workspaces")}
      >
        <Bot className="h-5 w-5" /> Create Agent & Workspace
      </Button>
    </div>
  );
}