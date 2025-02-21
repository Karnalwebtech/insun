"use client";
import LoadingPage from "@/components/loading-page";
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { CustomerProps, DetailsResponse } from "@/types/all-customers.type";
import { encryptValue } from "@/utils/crypto";
import {
  Activity,
  Calendar,
  CreditCard,
  Edit2,
  FileImage,
  FileText,
  Fingerprint,
  Heart,
  Mail,
  MoreHorizontal,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LinkTooltipBtnIcon } from "@/components/buttons/link-tooltipIcon";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { ScrollArea } from "@/components/ui/scroll-area";
interface ViewCustomerDetailsProps {
  validID: string | null;
}
const ViewCustomerDetails: React.FC<ViewCustomerDetailsProps> = ({
  validID,
}) => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [response, setApiResponse] = useState<CustomerProps | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  if (!validID) {
    throw Error("Id is missing");
  }

  const fetchCustomers = useCallback(async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const token = await encryptValue(session.user.email);
      const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);

      const res = await fetch(
        `https://insurance-backend-3qao.onrender.com/api/v1/action/${validID}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        }
      );
      const data: DetailsResponse = await res.json();
      if (!res.ok) throw new Error(data.message || "An error occurred.");

      setApiResponse(data.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email, toast, validID]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  if (error) {
    return <p>{error}</p>;
  }
  const formatDate = (date: string) => {
    return format(new Date(date), "PPP")
  }
  console.log(response)
  if (loading) return <LoadingPage />
  if (!response) return <p>No data found</p>;
  return (
    <>
      <div className="bg-gray-50/50">
        {/* Main Content */}
        <div>
          {/* Header */}
          {/* <header className="border-b bg-white px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost">← Contacts</Button>
              <Button variant="ghost">Actions ▾</Button>
            </div>
            <Button>Customize record</Button>
          </header> */}

          {/* Contact Section */}
          <div className="py-2">
            <div className="flex items-start space-x-6">
              <UserAvatar
                fullname={response?.fullname}
                imageUrl={response?.profile_image?.path}
                alt={response?.profile_image?.altText || "profile pitcher"}
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold">
                    {response.fullname}
                  </h1>
                  <LinkTooltipBtnIcon
                    icon={<Edit2 className="h-4 w-4" />}
                    title={"Edit"}
                    url={`/customers/${response.id}`}
                  />
                </div>
                <p className="text-sm hover:text-blue text-muted-foreground">
                  <Link href={`mailto:${response.email}`}>
                    {response.email}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-4">
            <LinkTooltipBtnIcon
              icon={<Mail className="h-4 w-4" />}
              title={"Email"}
              url={`mailto:${response.email}`}
              variant="outline"
            />
            <LinkTooltipBtnIcon
              icon={<Phone className="h-4 w-4" />}
              variant="outline"
              title={"Call"}
              url={`tel:${response.phone}`}
            />
            <LinkTooltipBtnIcon
              icon={<Fingerprint className="h-4 w-4" />}
              variant="outline"
              title={`Customer ID ${response.id}`}
              url={`#`}
            />
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="flex pt-4 space-x-4">
        <TabsList className="flex flex-col space-y-2 h-auto p-4 justify-normal border-r w-40">
          <TabsTrigger className="w-[100%]" value="details">
            Customer Details
          </TabsTrigger>
          <TabsTrigger className="w-[100%]" value="documents">
            Documents
          </TabsTrigger>
          <TabsTrigger className="w-[100%]" value="policy">
            Policy Information
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 p-2">
          <ScrollArea className="h-[260px] rounded-md border p-4">
            <TabsContent value="details">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground">
                          {response.fullname}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Customer No</p>
                        <p className="text-sm text-muted-foreground">
                          {response.no}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {response.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {response.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Policy Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Policy Number</p>
                        <p className="text-sm text-muted-foreground">
                          {response.policy_no}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <Badge variant="secondary">{response.category}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Sum Insured</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(response?.si)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Premium Amount</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(response.amount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Important Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Date of Purchase</p>
                        <p className="text-sm text-muted-foreground">{formatDate(response.dop)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Date of Registration
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(response.dor)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Policy Year</p>
                        <p className="text-sm text-muted-foreground">
                          {response.issue_policy_year}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Created At</p>
                        <p className="text-sm text-muted-foreground">{formatDate(response.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Premium Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium">Premium Mode</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {response.premium_mode ||
                          "No Premium mode"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Identity Documents
                      </h3>
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Aadhar Card</p>
                            <p className="text-xs text-muted-foreground">
                              {response?.addhar_card?.originalname}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(response?.addhar_card?.path, "_blank")}>
                            View
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-8 w-8 text-blue-500" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">PAN Card</p>
                            <p className="text-xs text-muted-foreground">
                              {response?.pan_card?.originalname || "Not uploaded"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(response?.pan_card?.path, "_blank")}>
                            View
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Other Documents</h3>
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-4">
                          <FileImage className="h-8 w-8 text-blue-500" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Profile Image</p>
                            <p className="text-xs text-muted-foreground">
                              {response?.profile_image?.originalname ||
                                "Not uploaded"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(response?.profile_image?.path, "_blank")}>
                            View
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              Additional Document
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {response?.document?.originalname || "Not uploaded"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(response?.document?.path, "_blank")}>
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="policy">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium">Policy Status</p>
                        <Badge
                          variant={
                            response.is_active ? "success" : "destructive"
                          }
                          className="mt-1"
                        >
                          {response.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground mt-1">{formatDate(response.updatedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Policy Version</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          v{response.__v}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Activity Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm">Policy Created</p>
                            <p className="text-xs text-muted-foreground">{formatDate(response.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm">Last Modified</p>
                            <p className="text-xs text-muted-foreground">{formatDate(response.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </>
  );
};

export default ViewCustomerDetails;
