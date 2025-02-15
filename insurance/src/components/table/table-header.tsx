import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

interface ShadcnTableHeaderProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    drop_down_selector: string[];
    categoryFilter: string;
    setCategoryFilter: (value: string) => void;
    statusFilter: string[];  // ✅ Ensure it's an array
    setStatusFilter: (value: string[]) => void;  // ✅ Ensure setter takes an array
    rowsPerPage: string;
    setRowsPerPage: (value: string) => void;
}

const ShadcnTableHeader: React.FC<ShadcnTableHeaderProps> = ({
    searchTerm,
    setSearchTerm,
    drop_down_selector,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    rowsPerPage,
    setRowsPerPage
}) => {
    return (
        <div className="flex justify-between items-center">
            <Input
                placeholder="Search by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <div className="flex space-x-2">
                {drop_down_selector.length > 0 &&
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {drop_down_selector.map((item, i) =>
                                <SelectItem key={i} value={item}>{item}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                }
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[180px]">
                            Filter by Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {['Published', 'Draft', 'Review'].map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={statusFilter.includes(status)}  // ✅ Works with an array
                                onCheckedChange={(checked) =>
                                    setStatusFilter(
                                        checked
                                            ? [...statusFilter, status]  // ✅ Add status to array
                                            : statusFilter.filter((item) => item !== status) // ✅ Remove status from array
                                    )
                                }
                            >
                                {status}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="No: rows" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="1000">1000</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default ShadcnTableHeader
