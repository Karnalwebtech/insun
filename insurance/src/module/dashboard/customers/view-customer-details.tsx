"use client"
import { TooltipBtnIcon } from '@/components/buttons/TooltipIcon';
import LoadingPage from '@/components/loading-page';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/UserAvatar';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/all-customers.type';
import { encryptValue } from '@/utils/crypto';
import { AtSign, Fingerprint, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'

interface ViewCustomerDetailsProps {
    validID: string | null;
}
const ViewCustomerDetails: React.FC<ViewCustomerDetailsProps> = ({ validID }) => {
    const { toast } = useToast();
    const { data: session } = useSession()
    const [loading, setLoading] = useState<boolean>(true);
    const [response, setApiResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);

    if (!validID) {
        throw Error("Id is missing")
    }

    const fetchCustomers = useCallback(async () => {
        if (!session?.user?.email) return;

        setLoading(true);
        try {
            const token = await encryptValue(session.user.email);
            const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);

            const res = await fetch(`http://localhost:9000/api/v1/action/${validID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": apiKey,
                },
            });
            const data: ApiResponse = await res.json();
            if (!res.ok) throw new Error(data.message || "An error occurred.");

            setApiResponse(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
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
        return <p>{error}</p>
    }
    const { result } = response;
if(!result){
    return null
}
    return loading ? <LoadingPage /> : (
        <>
            <div>
                <Card>
                    <CardContent>
                        <div className='flex gap-4'>
                            <UserAvatar fullname={result?.fullname} imageUrl={result?.profile_image?.path} alt={result?.profile_image?.altText || "profile pitcher"} />
                            <h2>{result.fullname}</h2>
                            <div>
                                <TooltipBtnIcon icon={<Phone className='hover:text-red ' size={"sm"} />} title={result?.phone} />
                                <TooltipBtnIcon icon={<AtSign />} title={result?.email} />
                                <TooltipBtnIcon icon={<Fingerprint />} title={result?.id} />

                            </div>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ViewCustomerDetails