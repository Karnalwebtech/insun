"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PolicyForm() {
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Policy Form Preview</CardTitle>
        <CardDescription>This is a preview of the policy form with sample fields</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input id="policyNumber" placeholder="Enter policy number" />
              </div>
              <div>
                <Label htmlFor="policyHolder">Policy Holder ID</Label>
                <Input id="policyHolder" placeholder="Enter policy holder ID" />
              </div>
              <div>
                <Label htmlFor="coverageAmount">Coverage Amount</Label>
                <Input id="coverageAmount" type="number" placeholder="Enter coverage amount" />
              </div>
              <div>
                <Label htmlFor="policyType">Policy Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="premium" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="premiumAmount">Premium Amount</Label>
                <Input id="premiumAmount" type="number" placeholder="Enter premium amount" />
              </div>
              <div>
                <Label htmlFor="premiumFrequency">Premium Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Premium History</Label>
              <div className="bg-secondary p-4 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">Premium history entries would be listed here...</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="claims" className="space-y-4">
            <div>
              <Label>Beneficiaries</Label>
              <div className="bg-secondary p-4 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">Beneficiary entries would be listed here...</p>
              </div>
            </div>
            <div>
              <Label>Claims History</Label>
              <div className="bg-secondary p-4 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">Claim history entries would be listed here...</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="additional" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                <Input id="termsAndConditions" placeholder="Enter terms and conditions" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isRenewable" />
                <Label htmlFor="isRenewable">Is Renewable</Label>
              </div>
            </div>
            <div>
              <Label>Discounts</Label>
              <div className="bg-secondary p-4 rounded-md mt-2">
                <p className="text-sm text-muted-foreground">Discount entries would be listed here...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Submit Policy</Button>
      </CardFooter>
    </Card>
  )
}

