'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Image from 'next/image';
import NextLink from 'next/link';
import Link from 'next/link';

export default function CategoryCourses({ categories }) {
  return (
    <div className='category-courses py-5 md:py-8'>
      {/* Header */}
      <div className='relative h-20 md:h-50 mt-5 md:mt-10 border border-gray-200 rounded-md  '>
        <Link href='https://7web.lt/'>
          <Image
            src='/banner-2.png'
            alt='banners'
            fill
            className='object-cover rounded-md'
          />
        </Link>
      </div>
      <div className='mt-5 md:mt-8'>
        <div className='grid overflow-hidden rounded-md border md:grid-cols-2 lg:grid-cols-3'>
          {categories?.map((course, index) => (
            <Card
              key={index}
              className='rounded-none border-0 border-b border-r p-6 bg-card last:border-b-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+2)]:border-b lg:[&:nth-last-child(-n+3)]:border-b-0 hover:bg-muted transition-colors duration-500'>
              <CardHeader className='px-0'>
                <div className='flex  items-center gap-3'>
                  <div className='rounded-lg relative h-16 w-16 overflow-hidden'>
                    <Image
                      src={course?.cover?.url || '/placeholder-image.png'}
                      alt={course.name}
                      fill
                      className='object-cover'
                      placeholder='blur'
                      blurDataURL={course?.cover?.url}
                    />
                  </div>
                  <div className='flex-1'>
                    <CardTitle className='text-normal md:text-lg leading-snug hover:text-primary transition-colors duration-200'>
                      <NextLink href={`/courses/${course?.slug}`}>
                        {course.name} ({course.coursesCount})
                      </NextLink>
                    </CardTitle>
                    <p className='text-md md:text-normal  text-muted-foreground'>
                      {course.coursesCount} courses
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='md:px-6 space-y-2'>
                {course.subCategories.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className='text-md md:text-normal text-muted-foreground hover:text-primary transition-colors duration-200'>
                    <NextLink href={`/courses/${course?.slug}/${item?.slug}`}>
                      {item.name} ({item.coursesCount})
                    </NextLink>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
