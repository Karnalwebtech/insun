"use client";
import Shadcn_table from "@/components/table/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TimeAgo } from "@/utils/timeAgo";
import { ApiResponse } from "@/types/all-customers.type";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { encryptValue } from "@/utils/crypto";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import ViewCustomerDetails from "./view-customer-details";

const CustomerList: React.FC = () => {
    const { data: session } = useSession()
    const { toast } = useToast();
    const [rowsPerPage, setRowsPerPage] = useState<string>("25");
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1);
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const router = useRouter();
    const [response, setApiResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const fetchCustomers = useCallback(async () => {
        if (!session?.user?.email) return;

        setLoading(true);
        try {
            const token = await encryptValue(session.user.email);
            const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);

            const res = await fetch(`https://insurance-backend-3qao.onrender.com/api/v1/all-customer?rowsPerPage=${rowsPerPage}&page=${page}`, {
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
    }, [session?.user?.email, toast, rowsPerPage, page]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredItems } = useTableFilters(
        response?.result || [],
        ["fullname", "policy_no", "email"]
    );

    const categoryDropdown: string[] = [];

    const removeRow = useCallback(async (removeId: string) => {
        if (!session?.user?.email) return;
        const token = await encryptValue(session.user.email);
        const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);
        try {
            const res = await fetch(`https://insurance-backend-3qao.onrender.com/api/v1/action/${removeId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": apiKey,
                },
            });
            const data: ApiResponse = await res.json();
            if (!res.ok) {
                toast({
                    title: "Error",
                    description: data.message || "An error occurred.",
                    variant: "destructive",
                });
            }
            toast({
                title: "Success",
                description: data.message || "Successfully removed",
            });
            fetchCustomers();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "An error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [session, toast, fetchCustomers]);

    const DrawerController = useCallback((id: string) => {
        setIsOpen(true)
        setCustomerId(id)
      }, [setIsOpen,setCustomerId]);
      
    const tableBody = useMemo(() => (
        filteredItems?.map((item, index) => (
            <TableRow key={item._id}>
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell className="font-medium">{item.fullname}</TableCell>
                <TableCell className="font-medium">{item.policy_no}</TableCell>
                <TableCell className="font-medium">{item.phone}</TableCell>
                <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                <TableCell className="font-medium">{item.email}</TableCell>
                <TableCell><TimeAgo time={item.updatedAt} /></TableCell>
                <TableCell>{item.user?.name || "N/A"}</TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => item.id && navigator.clipboard.writeText(item.id)}
                            >
                                <Copy /> Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => DrawerController(item.id)}
                            >
                                <Eye /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push(`/karnalwebtech/post/categorie/${item._id}`)}
                            >
                                <Pencil /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onClick={() => removeRow(item.id)}
                            >
                                <Trash2 color="red" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        ))
    ), [filteredItems, removeRow, router, DrawerController]);
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <>

            <Shadcn_table
                table_header={["S.No", "Fullname", "Policy No", "Phone", "Amount", "Email", "Last Update", "Agent", "Action"]}
                // tabelBody={response?.result || []}
                tabel_body={() => tableBody}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                drop_down_selector={categoryDropdown}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={page}
                setCurrentPage={setPage}
                data_length={response?.dataCounter || 10}
                isLoading={loading}
            />
            <DrawerComponent title="" description="" isOpen={isOpen} setIsOpen={setIsOpen}>
                <ViewCustomerDetails validID={customerId}/>
            </DrawerComponent>
        </>
    );
};

export default CustomerList;
