import { SearchableItem } from "@/types/all-customers.type";
import { useState, useMemo } from "react";


export function useTableFilters<T extends SearchableItem>(
    items: T[],
    searchKeys: (keyof T)[],
) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const filteredItems = useMemo(() => {
        return items?.filter((item) => {
            // Check if the item matches the search term
            const matchesSearch = searchKeys.some((key) => {
                const value = item[key];

                // Ensure value is string or number before calling .toString()
                if (typeof value === "string" || typeof value === "number") {
                    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                }

                return false;
            });


            // Check if the item's status matches the selected statuses
            //   const matchesStatus =
            //     statusFilter.length === 0 || // No filter applied
            //     statusFilter.toString().toLowerCase().includes(item.status.toLowerCase()); // Filter by 'status' field

            //   // Return true only if both conditions are met
            //   return matchesSearch && matchesStatus;
            return matchesSearch;
        });
    }, [
        items, searchKeys, searchTerm, 
        // statusFilter
    ]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredItems,
    };
}