import React from 'react'
import ShadcnPagination from '../pagination';

interface ShadcnTableFooterProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  data_length:number;
}
const ShadcnTableFooter: React.FC<ShadcnTableFooterProps> = ({ currentPage,
  totalPages,
  setCurrentPage,data_length }) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
        <ShadcnPagination currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          data_length={data_length}
        />
      </div>
      
    </div>
  )
}

export default ShadcnTableFooter