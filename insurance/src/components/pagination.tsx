"use client"

import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    data_length: number;
}

export default function ShadcnPagination({ data_length, currentPage, totalPages, setCurrentPage }: PaginationProps) {
    // Calculate total pages based on data length and page size
    const maxVisiblePages = 5
    const totalPages_ = Math.ceil(data_length / totalPages)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Generate the visible page numbers
    const getPageNumbers = () => {

        // If total pages is less than max visible, return all pages
        if (totalPages_ <= maxVisiblePages) {
            return Array.from({ length: totalPages_ }, (_, i) => i + 1)
        }

        // Handle edge cases for current page near the beginning or end
        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5]
        }

        if (currentPage >= totalPages_ - 2) {
            return [totalPages_ - 4, totalPages_ - 3, totalPages_ - 2, totalPages_ - 1, totalPages_]
        }

        // For pages in the middle, show 5 pages centered around the current page
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                {data_length > totalPages &&

                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) handlePageChange(currentPage - 1)
                            }}
                            aria-disabled={currentPage === 1}
                        />
                    </PaginationItem>
                }

                {/* Page Numbers */}
                {getPageNumbers().map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNumber)
                            }}
                            isActive={pageNumber === currentPage}
                        >
                            {pageNumber}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Ellipsis for large page ranges */}
                {currentPage < totalPages_ - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {/* Next Button */}
                {data_length > totalPages &&
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages_) handlePageChange(currentPage + 1)
                            }}
                            aria-disabled={currentPage === totalPages_}
                        />
                    </PaginationItem>}
            </PaginationContent>
        </Pagination>
    )
}