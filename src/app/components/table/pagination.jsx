import React from 'react';
import { usePagination, DOTS } from './usePagination';
const Pagination = (props) => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });
    if (currentPage === 0 || paginationRange.length < 0) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    return (
        <ul className="flex flex-wrap items-center space-x-2 text-xs">
            <li>
                <a className={`block px-4 py-2 font-medium cursor-pointer ${currentPage === 1 ? "text-[#9F9F9F]" : ""}`} onClick={(e) => {
                    e.preventDefault();
                    if (!(currentPage === 1)) {
                        onPrevious();
                    }
                }}>Previous page</a>
            </li>
            {paginationRange.map((pageNumber) => {
                if (pageNumber === DOTS) {
                    return <li className="pagination-item dots">&#8230;</li>;
                }
                return (
                    <li>
                        <a className={`block text-center leading-5 w-5 h-5 cursor-pointer ${pageNumber === currentPage ? "bg-[#008BD0] text-white" : "bg-[#E6E6E6]"} font-medium rounded-full`} onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNumber);
                        }}>{pageNumber}</a>
                    </li>
                );
            })}
            <li>
                <a className={`block px-4 py-2 font-medium cursor-pointer ${currentPage === lastPage ? "text-[#9F9F9F]" : ""}`} onClick={(e) => {
                    e.preventDefault();
                    if (!(currentPage === lastPage)) {
                        onNext();
                    }
                }}>Next page</a>
            </li>
        </ul>
    );
};

export default Pagination;
