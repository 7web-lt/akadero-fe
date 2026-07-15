'use client';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination';
import React from 'react';
import Filters from '../filters';
import Listing from '../listing';
import SubCategoryList from './sub-category';
import { useSearchParams } from 'next/navigation';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import Link from 'next/link';

const getSearchParams = (searchParams, page, category, subCategory) => {
  const params = new URLSearchParams(searchParams.toString());

  // ✅ convert all to lowercase
  for (const [key, value] of params.entries()) {
    params.set(key, value.toLowerCase());
  }

  // ✅ add category / subcategory filters
  if (category?.slug) params.set('category', category.slug);
  if (subCategory?.slug) params.set('subcategory', subCategory.slug);

  // ✅ add current page
  if (page) params.set('page', page);

  const queryString = params.toString();
  return queryString.length ? '?' + queryString : '';
};

export default function CoursesList({
  subCategory,
  filters,
  category,
  subCategoriesData,
}) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ correct order
  const searchQuery = getSearchParams(
    searchParams,
    currentPage,
    category,
    subCategory
  ).replace(/^\?/, '');

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['courses', searchQuery],
    queryFn: () => api.getFilterCourses(searchQuery),
    keepPreviousData: true,
  });

  // pagination data from API
  const totalItems = data?.count || data?.total || 0; // handles both cases
  const itemsPerPage = data?.limit || 10;
  const totalPages = data?.totalPages || Math.ceil(totalItems / itemsPerPage);

  //  show range like 1–12, 13–24
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='courses-list mt-4 md:mt-8 space-y-4'>
      <div className='relative h-20 md:h-50 border border-gray-200 rounded-md '>
        <Link href='https://7web.lt/'>
          <Image
            src='/banner-2.png'
            alt='banners'
            fill
            className='object-cover rounded-md'
          />
        </Link>
      </div>
      {subCategoriesData && (
        <SubCategoryList
          subCategories={subCategoriesData}
          category={category?.slug}
        />
      )}

      <Filters filters={filters} />

      {isLoading ? (
        <div className='h-50 flex items-center justify-center'>
          <Spinner className='size-10' />
        </div>
      ) : (
        <Listing
          courses={data?.data}
          isLoading={isLoading}
        />
      )}

      {/* Enhanced Pagination Display */}
      {!isLoading && totalItems > 0 && (
        <div className='flex flex-col md:flex-row justify-between items-center gap-2 mt-6'>
          <h6 className='text-md md:text-base font-medium text-foreground'>
            Rodoma {startItem}–{endItem} iš {totalItems} kursai
          </h6>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
